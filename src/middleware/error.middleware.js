import { logError } from "../utils/logger.js";

export function errorHandler(err, req, res, next) {
  logError(err.message);

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}