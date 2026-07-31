import fs from "fs";
import path from "path";

const logDir = "logs";

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Write log message to file
function write(file, level, message) {
  const log = `[${new Date().toISOString()}] [${level}] ${message}\n`;
  fs.appendFileSync(path.join(logDir, file), log);
  console.log(log.trim());
}

// Application logs
export function logInfo(message) {
  write("app.log", "INFO", message);
}
export function logWarn(message) {
  write("app.log", "WARN", message);
}
export function logError(message) {
  write("app.log", "ERROR", message);
}

// Failed record logs
export function logFailedRecord(rowNumber, row, reason) {
  write(
    "failed-records.log",
    "FAILED_RECORD",
    `Row ${rowNumber}: ${reason} | ${JSON.stringify(row)}`,
  );
}
