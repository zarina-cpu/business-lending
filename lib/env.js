import { existsSync, readFileSync } from "fs";
import path from "path";

function applyFile(fileName) {
  const filePath = path.join(process.cwd(), fileName);
  if (!existsSync(filePath)) return;
  const raw = readFileSync(filePath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const index = line.indexOf("=");
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    if (key && value && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

export function tursoConfig() {
  applyFile(".env.local");
  applyFile(".env");

  const url = String(
    process.env.TURSO_DATABASE_URL || process.env.LIBSQL_URL || ""
  ).trim();
  const authToken = String(
    process.env.TURSO_AUTH_TOKEN ||
      process.env.LIBSQL_AUTH_TOKEN ||
      process.env.LIBSQL_TOKEN ||
      ""
  ).trim();

  return { url, authToken };
}
