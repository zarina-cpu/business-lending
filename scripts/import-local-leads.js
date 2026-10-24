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
  const file = path.join(process.cwd(), "data", "leads.json");
  const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  let imported = 0;
  for (const lead of parsed) {
    const result = await client.execute({
      sql: `INSERT OR IGNORE INTO leads (id, created_at, name, phone, comment, source, quiz)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        lead.id,
        lead.createdAt,
        lead.name,
        lead.phone,
        lead.comment || "",
        lead.source || "form",
        lead.quiz ? JSON.stringify(lead.quiz) : null,
      ],
    });
    imported += Number(result.rowsAffected || 0);
  }
  const count = await client.execute("SELECT COUNT(*) AS total FROM leads");
  console.log("imported", imported);
  console.log("leads_count", Number(count.rows[0].total));
})().catch((error) => {
  console.error("import_fail", error.message);
  process.exit(1);
});
