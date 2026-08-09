import "dotenv/config";
import http from "node:http";
import { logger } from "@repo/logger";
import { app as expressApplication } from "./server";

import { env } from "./env";

async function init() {
  try {
    const server = http.createServer(expressApplication);
    const PORT: number = Number(env.PORT ?? 8000);
    server.listen(PORT, "0.0.0.0", () => {
      logger.info(`http server is running on PORT ${PORT}`);
    });
    server.on("error", (err: NodeJS.ErrnoException) => {
      logger.error(`Error creating http server`, { err });
      process.exit(1);
    });
  } catch (err) {
    logger.error(`Error creating http server`, { err });
    process.exit(1);
  }
}

init();
