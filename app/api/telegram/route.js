import {
  matchesLeadGroup,
  rememberTelegramChat,
  targetGroupTitle,
  telegramRequest,
} from "@/lib/telegram";

export const runtime = "nodejs";

const WELCOME =
  "Здравствуйте! Я бот чайной Hokkori Tea. Заявки с сайта уходят в группу Hokkori Tea.";

const GROUP_READY = "Группа подключена. Новые заявки с сайта будут приходить сюда.";

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

export async function POST(request) {
  const token = String(process.env.TELEGRAM_BOT_TOKEN || "").trim();
  if (!token) {
    return Response.json({ error: "no bot" }, { status: 503 });
  }

  const secret = String(process.env.TELEGRAM_WEBHOOK_SECRET || "").trim();
  if (secret) {
    const header = request.headers.get("x-telegram-bot-api-secret-token");
    if (header !== secret) {
      return Response.json({ error: "forbidden" }, { status: 403 });
    }
  }

  let update;
  try {
    update = await request.json();
  } catch {
    return Response.json({ error: "bad json" }, { status: 400 });
  }

  try {
    await handleUpdate(token, update);
  } catch (error) {
    console.error("Telegram webhook failed", error);
  }

  return Response.json({ ok: true });
}
