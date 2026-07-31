import { pool } from "../config/db.js";

export async function insertOrders(orders) {
  if (orders.length === 0) {
    return;
  }
  const client = await pool.connect();
  try {
    // Start database transaction
    await client.query("BEGIN");

    // Build bulk insert query
    const values = [];
    const placeholders = [];
    orders.forEach((order, index) => {
      const offset = index * 6;
      placeholders.push(
        `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6})`,
      );

      values.push(
        order.order_id,
        order.customer_id,
        order.order_date,
        order.order_amount,
        order.status,
        order.shard_key,
      );
    });

    const query = `
      INSERT INTO orders (
        order_id,
        customer_id,
        order_date,
        order_amount,
        status,
        shard_key
      )
      VALUES ${placeholders.join(",")}
    `;

    // Execute bulk insert
    await client.query(query, values);

    // Commit transaction
    await client.query("COMMIT");
  } catch (error) {
    // Roll back transaction if anything fails
    await client.query("ROLLBACK");
    throw error;
  } finally {
    // Release database connection
    client.release();
  }
}
