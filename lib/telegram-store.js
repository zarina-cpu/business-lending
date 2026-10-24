import { promises as fs } from "fs";
import path from "path";
import { getDb } from "./db";

const filePath = path.join(process.cwd(), "data", "telegram-chat.json");

function normalizeChat(parsed) {
  if (!parsed?.chatId) return null;
  return {
    chatId: String(parsed.chatId),
    title: parsed.title || "",
    type: parsed.type || "",
  };
}

async function readFromFile() {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return normalizeChat(JSON.parse(raw));
  } catch {
    return null;
  }
}

async function readFromTurso() {
  try {
    const db = getDb();
    await db.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);
    const result = await db.execute({
      sql: "SELECT value FROM settings WHERE key = ?",
      args: ["telegram_chat"],
    });
    const raw = result.rows[0]?.value;
    return raw ? normalizeChat(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

async function writeToTurso(chat) {
  try {
    const db = getDb();
    await db.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);
    await db.execute({
      sql: `INSERT INTO settings (key, value) VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      args: ["telegram_chat", JSON.stringify(chat)],
    });
    return true;
  } catch {
    return false;
  }
}

export async function readStoredChat() {
  return (await readFromTurso()) || (await readFromFile());
}

export async function readStoredChatId() {
  const stored = await readStoredChat();
  return stored?.chatId || null;
}

export async function writeStoredChat(chat) {
  if (!chat?.chatId) return;
  const payload = {
    chatId: String(chat.chatId),
    title: chat.title || "",
    type: chat.type || "",
    savedAt: new Date().toISOString(),
  };
  await writeToTurso(payload);
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
  } catch {
    // Vercel filesystem is read-only; Turso is enough there.
  }
}

export async function writeStoredChatId(chatId) {
  await writeStoredChat({ chatId });
}
