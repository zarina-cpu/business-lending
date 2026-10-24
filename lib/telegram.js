import { readStoredChat, writeStoredChat } from "./telegram-store";

export function targetGroupTitle() {
  return String(process.env.TELEGRAM_GROUP_TITLE || "Hokkori Tea").trim();
}

export function matchesLeadGroup(chat) {
  if (!chat) return false;
  const type = chat.type || "";
  if (type !== "group" && type !== "supergroup") return false;
  const title = String(chat.title || "").toLowerCase();
  const wanted = targetGroupTitle().toLowerCase();
  return title === wanted || title.includes("hokkori");
}

export async function telegramRequest(token, method, body) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json; charset=utf-8" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok && data.ok !== false, data };
}

export async function resolveChatId(token, configured) {
  const stored = await readStoredChat();
  if (stored?.chatId && stored.type !== "private") {
    return stored.chatId;
  }

  const chatId = String(configured || "").trim();
  if (/^-\d+$/.test(chatId)) return chatId;
  if (/^\d+$/.test(chatId)) return null;

  if (chatId.startsWith("@")) {
    const username = chatId.replace(/^@/, "").toLowerCase();
    const me = await telegramRequest(token, "getMe");
    const botName = String(me.data?.result?.username || "").toLowerCase();
    if (username && username !== botName) return chatId;
  }

  return null;
}

export async function rememberTelegramChat(chat) {
  if (!matchesLeadGroup(chat)) return false;
  await writeStoredChat({
    chatId: chat.id,
    title: chat.title,
    type: chat.type,
  });
  return true;
}

export async function notifyTelegram(lead) {
  const token = String(process.env.TELEGRAM_BOT_TOKEN || "").trim();
  const configured = String(process.env.TELEGRAM_CHAT_ID || "").trim();
  if (!token) {
    return { skipped: true };
  }

  const chatId = await resolveChatId(token, configured);
  if (!chatId) {
    console.error(
      `Telegram: группа «${targetGroupTitle()}» ещё не подключена. Добавьте бота в эту группу и напишите там /start.`
    );
    return { skipped: false, ok: false };
  }

  const quizLines = lead.quiz
    ? Object.entries(lead.quiz)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n")
    : "";

  const text = [
    "Новая заявка — Hokkori Tea",
    `Источник: ${lead.source === "quiz" ? "ИИ-квиз" : "форма на сайте"}`,
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    lead.comment ? `Комментарий: ${lead.comment}` : "",
    quizLines ? `Подбор:\n${quizLines}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const { ok, data } = await telegramRequest(token, "sendMessage", {
      chat_id: chatId,
      text,
    });

    if (!ok) {
      console.error("Telegram notify failed", data?.description || data);
      return { skipped: false, ok: false };
    }

    return { skipped: false, ok: true };
  } catch (error) {
    console.error("Telegram notify failed", error);
    return { skipped: false, ok: false };
  }
}
