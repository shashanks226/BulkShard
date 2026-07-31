import dotenv from "dotenv";
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  GCS_BUCKET_NAME: process.env.GCS_BUCKET_NAME,
  USE_GCS: process.env.USE_GCS === "true",
};
