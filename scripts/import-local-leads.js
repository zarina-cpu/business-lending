const fs = require("fs");
const path = require("path");

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

function toArg(value) {
  if (value === null || value === undefined) return { type: "null" };
  return { type: "text", value: String(value) };
}

const env = readEnv(".env.local");
const endpoint = `${env.TURSO_DATABASE_URL.replace(/^libsql:\/\//, "https://")}/v2/pipeline`;

async function run(sql, args = []) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.TURSO_AUTH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [
        { type: "execute", stmt: { sql, args: args.map(toArg) } },
        { type: "close" },
      ],
    }),
  });
  const data = await response.json();
  if (!response.ok || data.results?.[0]?.type === "error") {
    throw new Error(data.results?.[0]?.error?.message || "import_fail");
  }
  return data;
}

(async () => {
  const parsed = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "data", "leads.json"), "utf8")
  );
  await run(`CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    comment TEXT,
    source TEXT,
    quiz TEXT
  )`);
  let imported = 0;
  for (const lead of parsed) {
    await run(
      `INSERT OR IGNORE INTO leads (id, created_at, name, phone, comment, source, quiz)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        lead.id,
        lead.createdAt,
        lead.name,
        lead.phone,
        lead.comment || "",
        lead.source || "form",
        lead.quiz ? JSON.stringify(lead.quiz) : null,
      ]
    );
    imported += 1;
  }
  console.log("imported", imported);
})().catch((error) => {
  console.error("import_fail", error.message);
  process.exit(1);
});
