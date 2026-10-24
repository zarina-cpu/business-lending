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
if (!token) {
  console.error("NO_TOKEN");
  process.exit(1);
}

const target = (process.argv[2] || "Hokkori Tea").toLowerCase();

async function api(method) {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`);
  return res.json();
}

(async () => {
  const updates = await api("getUpdates?limit=100");
  if (!updates.ok) {
    console.error("UPDATES_FAIL", updates.description || "");
    process.exit(1);
  }

  const chats = new Map();
  for (const item of updates.result || []) {
    const chat =
      item.message?.chat ||
      item.my_chat_member?.chat ||
      item.channel_post?.chat;
    if (!chat?.id) continue;
    chats.set(String(chat.id), {
      id: chat.id,
      type: chat.type,
      title: chat.title || "",
      username: chat.username || "",
    });
  }

  const list = [...chats.values()];
  const match = list.find((chat) => {
    const title = String(chat.title || "").toLowerCase();
    const username = String(chat.username || "").toLowerCase();
    return (
      title.includes(target) ||
      username.includes(target.replace(/\s+/g, "")) ||
      title.includes("hokkori")
    );
  });

  console.log("chats_found", list.length);
  for (const chat of list) {
    console.log(
      [chat.type, chat.id, chat.title || "-", chat.username || "-"].join(" | ")
    );
  }
  if (match) {
    console.log("MATCH_ID", match.id);
    console.log("MATCH_TYPE", match.type);
    console.log("MATCH_TITLE", match.title);
  } else {
    console.log("NO_MATCH");
  }
})();
