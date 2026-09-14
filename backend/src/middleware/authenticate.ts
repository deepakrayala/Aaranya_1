import type { NextFunction, Request, Response } from "express";
import { findAuthenticatedSession } from "../services/auth.service.js";

function readCookie(request: Request, name: string): string | undefined {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) return undefined;

  for (const cookie of cookieHeader.split(";")) {
    const [cookieName, ...valueParts] = cookie.trim().split("=");
    if (cookieName !== name) continue;

    try {
      return decodeURIComponent(valueParts.join("="));
    } catch {
      return undefined;
    }
  }

  return undefined;
}

export async function requireAuthentication(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const token = readCookie(request, "aranya_session");
  if (!token) {
    response.status(401).json({ error: "Authentication required" });
    return;
  }

  try {
    const session = await findAuthenticatedSession(token);
    if (!session) {
      response.status(401).json({ error: "Invalid or expired session" });
      return;
    }

    request.authUser = session.user;
    request.sessionId = session.sessionId;
    next();
  } catch (error) {
    next(error);
  }
}
