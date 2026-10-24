const fs = require("fs");
const path = require("path");
const { createClient } = require("@libsql/client");

function readEnv(file) {
  const map = {};
  const raw = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const i = line.indexOf("=");
    map[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return map;
}

const env = { ...readEnv(".env"), ...readEnv(".env.local") };
const client = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

(async () => {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      comment TEXT,
      source TEXT,
      quiz TEXT
    )
  `);
  const count = await client.execute("SELECT COUNT(*) AS total FROM leads");
  console.log("turso_ok");
  console.log("leads_count", Number(count.rows[0].total));
})().catch((error) => {
  console.error("turso_fail", error.message);
  process.exit(1);
});
