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

const env = readEnv(".env.local");
const endpoint = `${env.TURSO_DATABASE_URL.replace(/^libsql:\/\//, "https://")}/v2/pipeline`;

(async () => {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.TURSO_AUTH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [
        { type: "execute", stmt: { sql: "SELECT COUNT(*) AS total FROM leads" } },
        { type: "close" },
      ],
    }),
  });
  const data = await response.json();
  if (!response.ok || data.results?.[0]?.type === "error") {
    throw new Error(data.results?.[0]?.error?.message || "turso_fail");
  }
  console.log("turso_ok");
})().catch((error) => {
  console.error("turso_fail", error.message);
  process.exit(1);
});
