import { Storage } from "@google-cloud/storage";
import { env } from "../config/env.js";
import fs from "fs";

let bucket = null;

// Initializing Google Cloud Storage bucket
function getBucket() {
  if (!bucket) {
    const storage = new Storage();
    bucket = storage.bucket(env.GCS_BUCKET_NAME);
  }
  return bucket;
}

// Uploading file to Google Cloud Storage
export async function uploadFile(file) {
  const fileName = `${Date.now()}-${file.originalname}`;
  const gcsFile = getBucket().file(fileName);
  await new Promise((resolve, reject) => {
    fs.createReadStream(file.path)
      .pipe(gcsFile.createWriteStream())
      .on("finish", resolve)
      .on("error", reject);
  });

  return {
    name: fileName,
  };
}

// Reading file from Google Cloud Storage
export function createReadStream(fileName) {
  return getBucket().file(fileName).createReadStream();
}