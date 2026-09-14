import type { NextFunction, Request, Response } from "express";

export function requireAdmin(request: Request, response: Response, next: NextFunction): void {
  if (!request.authUser) {
    response.status(401).json({ error: "Authentication required" });
    return;
  }

  if (request.authUser.role !== 1) {
    response.status(403).json({ error: "Admin access required" });
    return;
  }

  next();
}
