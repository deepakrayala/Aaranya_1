import argon2 from "argon2";
import { createHash, randomBytes } from "node:crypto";
import type { PoolClient } from "pg";
import { db } from "../db/pool.js";

export type UserRole = 1 | 2;

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type UserWithPassword = AuthenticatedUser & {
  passwordHash: string;
};

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password_hash: string;
};

type SessionUserRow = {
  session_id: string;
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export const SESSION_COOKIE_NAME = "aranya_session";
export const SESSION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, { type: argon2.argon2id });
}

export async function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
  return argon2.verify(passwordHash, password);
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(
  client: PoolClient,
  userId: string,
): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_LIFETIME_MS);

  await client.query(
    `INSERT INTO sessions (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, hashSessionToken(token), expiresAt],
  );

  return { token, expiresAt };
}

export async function findUserByEmail(email: string): Promise<UserWithPassword | null> {
  const result = await db.query<UserRow>(
    `SELECT id, name, email, role, password_hash
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [email],
  );

  const user = result.rows[0];
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    passwordHash: user.password_hash,
  };
}

export async function findAuthenticatedSession(
  token: string,
): Promise<{ sessionId: string; user: AuthenticatedUser } | null> {
  const result = await db.query<SessionUserRow>(
    `SELECT
       sessions.id AS session_id,
       users.id,
       users.name,
       users.email,
       users.role
     FROM sessions
     INNER JOIN users ON users.id = sessions.user_id
     WHERE sessions.token_hash = $1
       AND sessions.expires_at > NOW()
     LIMIT 1`,
    [hashSessionToken(token)],
  );

  const session = result.rows[0];
  if (!session) return null;

  await db.query("UPDATE sessions SET last_used_at = NOW() WHERE id = $1", [session.session_id]);

  return {
    sessionId: session.session_id,
    user: {
      id: session.id,
      name: session.name,
      email: session.email,
      role: session.role,
    },
  };
}

export async function deleteSession(sessionId: string): Promise<void> {
  await db.query("DELETE FROM sessions WHERE id = $1", [sessionId]);
}
