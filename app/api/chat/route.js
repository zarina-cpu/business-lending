import { addLead } from "@/lib/leads";
import { notifyTelegram } from "@/lib/telegram";
import { askTeaSommelier } from "@/lib/gemini";
import { leadFromHistory } from "@/lib/parse-lead";

export const runtime = "nodejs";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const history = Array.isArray(body.messages) ? body.messages.slice(-16) : [];

  try {
    const { text, lead } = await askTeaSommelier(history);
    let leadSaved = false;
    const parsed = leadFromHistory(history, lead);

    if (parsed) {
      const saved = await addLead({
        name: parsed.name,
        phone: parsed.phone,
        comment: parsed.comment || "",
        source: "quiz",
        quiz: parsed.quiz || null,
      });
      try {
        await notifyTelegram(saved);
      } catch (error) {
        console.error("Telegram notify failed", error);
      }
      leadSaved = true;
    }

    return Response.json({ reply: text, leadSaved });
  } catch (error) {
    if (error?.message === "NO_GEMINI_KEY") {
      return Response.json(
        {
          error:
            "ИИ-помощник ещё не подключён. Добавьте GEMINI_API_KEY в .env.local или оставьте заявку в форме ниже.",
        },
        { status: 503 }
      );
    }
    console.error(error);
    return Response.json(
      { error: "Сейчас сомелье не отвечает. Напишите нам через форму заявки." },
      { status: 502 }
    );
  }
}
