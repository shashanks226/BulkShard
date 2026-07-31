import { processUpload } from "../services/upload.service.js";

export async function uploadOrders(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required.",
      });
    }

    const result = await processUpload(req.file);
    return res.status(200).json({
      success: true,
      message: "Orders processed successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}