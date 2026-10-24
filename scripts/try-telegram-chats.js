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

const env = { ...readEnv(".env"), ...readEnv(".env.local") };
const token = env.TELEGRAM_BOT_TOKEN;
const candidates = [
  "Hokkori Tea",
  "@HokkoriTea",
  "@hokkoritea",
  "@hokkori_tea",
  "@Hokkori_Tea",
  "@hokkoritea_group",
];

(async () => {
  for (const chat of candidates) {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/getChat?chat_id=${encodeURIComponent(chat)}`
    );
    const data = await res.json();
    if (data.ok) {
      const c = data.result;
      console.log("OK", c.type, c.id, c.title || "", c.username || "");
    } else {
      console.log("FAIL", chat, data.error_code, data.description);
    }
  }
})();
