import fs from "fs";
import { promises as fsPromises } from "fs";

import { env } from "../config/env.js";
import { uploadFile, createReadStream } from "./gcs.service.js";
import { processCSV } from "./csv.service.js";

export async function processUpload(file) {
  let stream;
  let fileName = file.originalname;

  try {
    // Processing file using Google Cloud Storage
    if (env.USE_GCS) {
      const uploadedFile = await uploadFile(file);

      fileName = uploadedFile.name;

      stream = createReadStream(fileName);
    }

    // Processing file using local storage
    else {
      stream = fs.createReadStream(file.path);
    }

    // Processing CSV records
    const statistics = await processCSV(stream);
    return {
      fileName,
      ...statistics,
    };
  } finally {
    // Removing temporary local file
    if (file.path) {
      await fsPromises.unlink(file.path).catch(() => {});
    }
  }
}