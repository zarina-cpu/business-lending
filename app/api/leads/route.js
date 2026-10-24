import { addLead } from "@/lib/leads";
import { notifyTelegram } from "@/lib/telegram";
import { buildQuizComment } from "@/lib/parse-lead";
import { resolveTeaChoice } from "@/lib/teas";

export const runtime = "nodejs";

function validPhone(phone) {
  const digits = String(phone).replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Некорректные данные формы" }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const comment = String(body.comment || "").trim();
  const source = body.source === "quiz" ? "quiz" : "form";

  if (name.length < 2) {
    return Response.json({ error: "Укажите имя" }, { status: 400 });
  }
  if (!validPhone(phone)) {
    return Response.json({ error: "Укажите телефон с кодом страны" }, { status: 400 });
  }

  try {
    const history = Array.isArray(body.messages) ? body.messages : [];
    const userText = history
      .filter((item) => item.role === "user")
      .map((item) => item.content)
      .join("\n");
    const quiz = { ...(body.quiz || {}) };
    if (source === "quiz") {
      quiz.tea = resolveTeaChoice(userText, quiz.tea) || "не указан";
    }

    const savedComment =
      source === "quiz"
        ? buildQuizComment({ history, modelComment: comment, quiz })
        : comment;

    const lead = await addLead({
      name,
      phone,
      comment: savedComment,
      source,
      quiz: Object.keys(quiz).length ? quiz : null,
    });

    try {
      await notifyTelegram(lead);
    } catch (error) {
      console.error("Telegram notify failed", error);
    }
    return Response.json({ ok: true, id: lead.id });
  } catch (error) {
    console.error(error);
    const message =
      error?.message === "NO_TURSO"
        ? "База заявок не настроена. Добавьте TURSO_DATABASE_URL и TURSO_AUTH_TOKEN."
        : "Не удалось сохранить заявку. Попробуйте ещё раз.";
    return Response.json({ error: message }, { status: 500 });
  }
}
