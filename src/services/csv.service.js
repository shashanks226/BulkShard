import csv from "csv-parser";
import { logInfo, logFailedRecord } from "../utils/logger.js";
import { validateOrder } from "../validators/order.validator.js";
import { insertOrders } from "../repositories/orders.repository.js";
import { getShardKey } from "../utils/shard.util.js";

const BATCH_SIZE = 1000;

// Inserting the current batch into the database
async function flushBatch(batch) {
  if (batch.length === 0) {
    return 0;
  }
  await insertOrders(batch);
  logInfo(`Inserted batch of ${batch.length} records`);
  const inserted = batch.length;
  batch.length = 0;
  return inserted;
}

export function processCSV(stream) {
  return new Promise((resolve, reject) => {
    const batch = [];
    const statistics = {
      totalRows: 0,
      successfulRows: 0,
      failedRows: 0,
    };

    let flushing = Promise.resolve();
    const parser = csv();

    // Processing each CSV record
    parser.on("data", (row) => {
      parser.pause();

      flushing = flushing
        .then(async () => {
          statistics.totalRows++;

          // Validateing the record before processing
          try {
            const order = validateOrder(row);
            order.shard_key = getShardKey(order.customer_id);
            batch.push(order);
          } catch (error) {
            statistics.failedRows++;

            logFailedRecord(
              statistics.totalRows,
              row,
              error.message
            );

            return;
          }

          // Inserting records when the batch size is reached
          if (batch.length >= BATCH_SIZE) {
            statistics.successfulRows += await flushBatch(batch);
          }
        })
        .then(() => {
          parser.resume();
        })
        .catch(reject);
    });

    // Processing any remaining records
    parser.on("end", async () => {
      try {
        await flushing;

        statistics.successfulRows += await flushBatch(batch);

        resolve(statistics);
      } catch (error) {
        reject(error);
      }
    });

    // Handle stream and parser errors
    parser.on("error", reject);
    stream.on("error", reject);

    stream.pipe(parser);
  });
}