import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { db } from "../db/pool.js";
import { findUserByEmail, hashPassword } from "../services/auth.service.js";

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function readPassword(): Promise<string> {
  if (!input.isTTY) {
    throw new Error("Run admin setup from an interactive terminal so the password is not exposed.");
  }

  output.write("Admin password: ");
  input.setRawMode(true);
  input.resume();

  return new Promise((resolve) => {
    let password = "";

    const onData = (chunk: Buffer): void => {
      const value = chunk.toString("utf8");

      for (const character of value) {
        if (character === "\r" || character === "\n") {
          input.off("data", onData);
          input.setRawMode(false);
          output.write("\n");
          resolve(password);
          return;
        }

        if (character === "\u0003") {
          input.off("data", onData);
          input.setRawMode(false);
          output.write("\n");
          resolve("");
          return;
        }

        if (character === "\b" || character === "\u007f") {
          password = password.slice(0, -1);
          continue;
        }

        password += character;
      }
    };

    input.on("data", onData);
  });
}

async function main(): Promise<void> {
  const terminal = createInterface({ input, output });

  try {
    const name = (await terminal.question("Admin name: ")).trim().replace(/\s+/g, " ");
    const email = normalizeEmail(await terminal.question("Admin email: "));
    terminal.close();
    const password = await readPassword();

    if (name.length < 2 || name.length > 255) {
      throw new Error("Admin name must be between 2 and 255 characters.");
    }
    if (!isValidEmail(email) || email.length > 255) {
      throw new Error("A valid admin email is required.");
    }
    if (password.length < 8 || password.length > 128) {
      throw new Error("Admin password must be between 8 and 128 characters.");
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      console.log(
        existingUser.role === 1
          ? "An admin account with this email already exists. No account was created."
          : "An account with this email already exists and is not an admin. No account was created.",
      );
      return;
    }

    const passwordHash = await hashPassword(password);
    await db.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 1)`,
      [name, email, passwordHash],
    );

    console.log("Admin account created. Sign in through POST /api/v1/auth/login.");
  } finally {
    terminal.close();
    input.pause();
    await db.end();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unable to create admin account.";
  console.error(`Admin setup failed: ${message}`);
  process.exitCode = 1;
});
