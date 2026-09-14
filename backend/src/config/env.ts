import "dotenv/config";

type NodeEnvironment = "development" | "test" | "production";

function readPort(value: string | undefined): number {
  if (value === undefined) return 4000;

  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("PORT must be a valid port number.");
  }

  return port;
}

function readNodeEnv(value: string | undefined): NodeEnvironment {
  if (value === undefined) return "development";

  if (value === "development" || value === "test" || value === "production") {
    return value;
  }

  throw new Error("NODE_ENV must be development, test, or production.");
}

function readDatabaseUrl(value: string | undefined): string {
  if (!value) {
    throw new Error("DATABASE_URL is required. Copy .env.example to .env and set it.");
  }

  return value;
}

function readFrontendOrigin(value: string | undefined, nodeEnv: NodeEnvironment): string {
  const origin = value ?? (nodeEnv === "production" ? undefined : "http://localhost:3737");
  if (!origin) {
    throw new Error("FRONTEND_ORIGIN is required in production.");
  }

  let parsed: URL;
  try {
    parsed = new URL(origin);
  } catch {
    throw new Error("FRONTEND_ORIGIN must be a valid HTTP(S) origin.");
  }

  if (!/^https?:$/.test(parsed.protocol) || parsed.pathname !== "/" || parsed.search || parsed.hash) {
    throw new Error("FRONTEND_ORIGIN must be a valid HTTP(S) origin.");
  }

  return parsed.origin;
}

const nodeEnv = readNodeEnv(process.env.NODE_ENV);

export const env = {
  port: readPort(process.env.PORT),
  nodeEnv,
  databaseUrl: readDatabaseUrl(process.env.DATABASE_URL),
  frontendOrigin: readFrontendOrigin(process.env.FRONTEND_ORIGIN, nodeEnv),
};
