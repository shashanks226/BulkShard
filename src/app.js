import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import uploadRoutes from "./routes/upload.routes.js";
import healthRoutes from "./routes/health.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// Security and logging middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Request parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register application routes
app.use("/api", uploadRoutes);
app.use("/api", healthRoutes);

// Handle application errors
app.use(errorHandler);

export default app;
