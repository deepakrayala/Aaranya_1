import type { Request, Response } from "express";
import { checkDatabaseConnection } from "../db/pool.js";

export async function getHealth(_request: Request, response: Response): Promise<void> {
  try {
    await checkDatabaseConnection();

    response.status(200).json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    response.status(503).json({
      status: "unavailable",
      database: "disconnected",
    });
  }
}
