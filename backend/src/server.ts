import { app } from "./app.js";
import { env } from "./config/env.js";
import { closeDatabaseConnection } from "./db/pool.js";

const server = app.listen(env.port, () => {
  console.info(`Aranya backend is listening on http://localhost:${env.port}`);
});

async function shutdown(signal: string): Promise<void> {
  console.info(`${signal} received. Shutting down gracefully.`);

  server.close(async () => {
    await closeDatabaseConnection();
    process.exit(0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
