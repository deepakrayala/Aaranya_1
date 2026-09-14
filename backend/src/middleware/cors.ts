import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";

export function corsMiddleware(request: Request, response: Response, next: NextFunction): void {
  const origin = request.headers.origin;

  if (origin === env.frontendOrigin) {
    response.setHeader("Vary", "Origin");
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }

  if (request.method === "OPTIONS") {
    response.sendStatus(204);
    return;
  }

  next();
}
