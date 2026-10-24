import { createClient } from "@libsql/client";

let client;

export function getDb() {
  const url = String(process.env.TURSO_DATABASE_URL || "").trim();
  const authToken = String(process.env.TURSO_AUTH_TOKEN || "").trim();
  if (!url || !authToken) {
    throw new Error("NO_TURSO");
  }
  if (!client) {
    client = createClient({ url, authToken });
  }
  return client;
}
