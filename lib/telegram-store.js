import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "telegram-chat.json");

export async function readStoredChat() {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed?.chatId) return null;
    return {
      chatId: String(parsed.chatId),
      title: parsed.title || "",
      type: parsed.type || "",
    };
  } catch {
    return null;
  }
}

export async function readStoredChatId() {
  const stored = await readStoredChat();
  return stored?.chatId || null;
}

export async function writeStoredChat(chat) {
  if (!chat?.chatId) return;
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(
    filePath,
    JSON.stringify(
      {
        chatId: String(chat.chatId),
        title: chat.title || "",
        type: chat.type || "",
        savedAt: new Date().toISOString(),
      },
      null,
      2
    ),
    "utf8"
  );
}

export async function writeStoredChatId(chatId) {
  await writeStoredChat({ chatId });
}
