import type { Request, Response } from "express";
import type { PoolClient } from "pg";
import { env } from "../config/env.js";
import { db } from "../db/pool.js";
import {
  createSession,
  deleteSession,
  findUserByEmail,
  hashPassword,
  SESSION_COOKIE_NAME,
  SESSION_LIFETIME_MS,
  type AuthenticatedUser,
  verifyPassword,
} from "../services/auth.service.js";

type SignupInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type UserRow = AuthenticatedUser;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateSignup(body: unknown): { input?: SignupInput; error?: string } {
  if (!isObject(body)) return { error: "Request body must be an object" };
  if ("role" in body) return { error: "Role cannot be set during signup" };
  if (typeof body.name !== "string" || typeof body.email !== "string" || typeof body.password !== "string") {
    return { error: "Name, email, and password are required" };
  }

  const name = body.name.trim().replace(/\s+/g, " ");
  const email = normalizeEmail(body.email);

  if (name.length < 2 || name.length > 255) return { error: "Name must be between 2 and 255 characters" };
  if (!isValidEmail(email) || email.length > 255) return { error: "A valid email is required" };
  if (body.password.length < 8 || body.password.length > 128) {
    return { error: "Password must be between 8 and 128 characters" };
  }

  return { input: { name, email, password: body.password } };
}

function validateLogin(body: unknown): { input?: LoginInput; error?: string } {
  if (!isObject(body) || typeof body.email !== "string" || typeof body.password !== "string") {
    return { error: "Email and password are required" };
  }

  const email = normalizeEmail(body.email);
  if (!isValidEmail(email) || email.length > 255 || body.password.length === 0) {
    return { error: "Email and password are required" };
  }

  return { input: { email, password: body.password } };
}

function setSessionCookie(response: Response, token: string): void {
  response.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    maxAge: SESSION_LIFETIME_MS,
    path: "/",
  });
}

function clearSessionCookie(response: Response): void {
  response.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    path: "/",
  });
}

function isUniqueViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "23505";
}

async function rollback(client: PoolClient): Promise<void> {
  await client.query("ROLLBACK");
}

export async function signup(request: Request, response: Response): Promise<void> {
  const validation = validateSignup(request.body);
  if (validation.error || !validation.input) {
    response.status(400).json({ error: validation.error });
    return;
  }

  const passwordHash = await hashPassword(validation.input.password);
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const userResult = await client.query<UserRow>(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 2)
       RETURNING id, name, email, role`,
      [validation.input.name, validation.input.email, passwordHash],
    );
    const user = userResult.rows[0];
    const session = await createSession(client, user.id);

    await client.query("COMMIT");
    setSessionCookie(response, session.token);
    response.status(201).json({ user });
  } catch (error) {
    await rollback(client);

    if (isUniqueViolation(error)) {
      response.status(409).json({ error: "An account with that email already exists" });
      return;
    }

    throw error;
  } finally {
    client.release();
  }
}

export async function login(request: Request, response: Response): Promise<void> {
  const validation = validateLogin(request.body);
  if (validation.error || !validation.input) {
    response.status(400).json({ error: validation.error });
    return;
  }

  try {
    const user = await findUserByEmail(validation.input.email);
    const passwordMatches = user && (await verifyPassword(user.passwordHash, validation.input.password));

    if (!passwordMatches || !user) {
      response.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const client = await db.connect();
    try {
      const session = await createSession(client, user.id);
      setSessionCookie(response, session.token);
    } finally {
      client.release();
    }

    response.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login failed:", error);
    response.status(500).json({ error: "Unable to log in" });
  }
}

export async function logout(request: Request, response: Response): Promise<void> {
  if (!request.sessionId) {
    response.status(401).json({ error: "Authentication required" });
    return;
  }

  await deleteSession(request.sessionId);
  clearSessionCookie(response);
  response.status(200).json({ message: "Logged out" });
}

export function getCurrentUser(request: Request, response: Response): void {
  if (!request.authUser) {
    response.status(401).json({ error: "Authentication required" });
    return;
  }

  response.status(200).json({ user: request.authUser });
}
