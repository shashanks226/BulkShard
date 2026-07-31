import { Router } from "express";

import { uploadOrders } from "../controllers/upload.controller.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

router.post(
  "/upload-orders",
  upload.single("file"),
  uploadOrders
);

export default router;