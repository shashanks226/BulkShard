import { Router } from "express";
import healthRoutes from "./health.routes.js";

const router = Router();

router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "BulkShard API is running.",
    });
});

router.use("/", healthRoutes);

export default router;