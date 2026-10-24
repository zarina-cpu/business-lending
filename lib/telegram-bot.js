import {
  matchesLeadGroup,
  rememberTelegramChat,
  targetGroupTitle,
  telegramRequest,
} from "./telegram";

const WELCOME =
  "Здравствуйте! Я бот чайной Hokkori Tea. Заявки с сайта уходят в группу Hokkori Tea.";

const GROUP_READY = "Группа подключена. Новые заявки с сайта будут приходить сюда.";

let started = false;
let offset = 0;
let stopped = false;

async function handleUpdate(token, update) {
  const message = update.message || update.edited_message;
  const chat = message?.chat || update.my_chat_member?.chat;
  if (!chat?.id) return;

  const linked = await rememberTelegramChat(chat);
  if (linked) {
    await telegramRequest(token, "sendMessage", {
      chat_id: chat.id,
      text: GROUP_READY,
    });
    return;
  }

  if (!message || chat.type !== "private") return;

  const text = String(message.text || "").trim();
  const reply = text.startsWith("/start")
    ? `${WELCOME} Добавьте меня в группу «${targetGroupTitle()}».`
    : `Связь есть. Заявки приходят в группу «${targetGroupTitle()}», не в личку.`;

  await telegramRequest(token, "sendMessage", {
    chat_id: chat.id,
    text: reply,
  });
}

async function pollLoop() {
  while (!stopped) {
    const token = String(process.env.TELEGRAM_BOT_TOKEN || "").trim();
    if (!token) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      continue;
    }
    try {
      const query = new URLSearchParams({
        timeout: "20",
        offset: String(offset),
        allowed_updates: JSON.stringify(["message", "my_chat_member"]),
      });
      const { ok, data } = await telegramRequest(
        token,
        `getUpdates?${query.toString()}`
      );
      if (!ok) {
        console.error("Telegram polling failed", data?.description || data);
        await new Promise((resolve) => setTimeout(resolve, 4000));
        continue;
      }
      const updates = data.result || [];
      for (const update of updates) {
        offset = update.update_id + 1;
        await handleUpdate(token, update);
      }
    } catch (error) {
      console.error("Telegram polling error", error);
      await new Promise((resolve) => setTimeout(resolve, 4000));
    }
  }
}

export function startTelegramPolling() {
  if (started) return;
  started = true;
  pollLoop();
}
