import type { NextFunction, Request, Response } from "express";

export function requestLogger(request: Request, response: Response, next: NextFunction): void {
  const startedAt = Date.now();

  response.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    console.info(`${request.method} ${request.path} ${response.statusCode} ${durationMs}ms`);
  });

  next();
}
