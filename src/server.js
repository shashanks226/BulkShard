import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/db.js";
import { logInfo, logError } from "./utils/logger.js";

async function startServer() {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      logInfo(
        `Server is running on port ${env.PORT} & http://localhost:${env.PORT}`,
      );
    });
  } catch (error) {
    logError(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

startServer();
