import { GoogleGenerativeAI } from "@google/generative-ai";
import { catalogForPrompt } from "./teas";

const SYSTEM_PROMPT = `Ты сомелье чайной Hokkori Tea в Москве. Говори по-русски, тепло и коротко (2–4 предложения), без канцелярита.

О нас:
- Чайная с залом для церемоний и магазин редких чаёв.
- Адрес: Большая Никитская, двор за чугунной калиткой. Работаем 12:00–22:00.
- Церемония гунфу на двоих: от 3 900 ₽, на компанию до 6 человек: от 7 500 ₽.
- Предлагай только чаи из каталога ниже. Если гость просит белый, жёлтый, красный, чёрный или травяной — выбирай конкретный сорт из списка и принимай такую заявку.
- Если гость назвал сорт из каталога, зафиксируй его в заявке (quiz.tea) и не подменяй другим.
- Подарочная коробка с тремя навесками от 4 200 ₽. Не выдумывай скидки и чаи вне каталога.

Каталог:
${catalogForPrompt()}

Как вести разговор (квиз, по одному вопросу):
1) Какой лист ближе: белый, жёлтый, красный, чёрный, травяной или «ещё не знаю».
2) Для себя, в подарок или на церемонию в зале.
3) Бюджет: до 2 000, 2–5 тысяч, или без жёсткой рамки.
4) Коротко предложи 1–2 сорта из каталога.
5) Мягко попроси имя и телефон, чтобы подтвердить наличие и время.

Когда есть и имя, и телефон (хотя бы 10 цифр), сохрани заявку: в КОНЦЕ ответа отдельной строкой без markdown:
LEAD_JSON:{"name":"...","phone":"...","comment":"...","quiz":{"taste":"...","goal":"...","budget":"...","tea":"..."}}
comment — одно короткое предложение: выбранный сорт и цель, без цитат переписки.
Пока телефона нет — LEAD_JSON не пиши. Не упоминай JSON, API и админку.`;

export function extractLead(text) {
  const raw = String(text || "");
  const patterns = [
    /LEAD_JSON:\s*(\{[\s\S]*?\})/,
    /```(?:json)?\s*(\{\s*"name"[\s\S]*?\})\s*```/i,
  ];

  let parsed = null;
  for (const pattern of patterns) {
    const match = raw.match(pattern);
    if (!match) continue;
    try {
      parsed = JSON.parse(match[1]);
      break;
    } catch {
      parsed = null;
    }
  }

  const clean = raw
    .replace(/LEAD_JSON:\s*\{[\s\S]*\}/, "")
    .replace(/```(?:json)?\s*\{\s*"name"[\s\S]*?\}\s*```/gi, "")
    .trim();
  return { text: clean, lead: parsed };
}

const MODEL_CHAIN = [
  process.env.GEMINI_MODEL,
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.5-flash",
].filter((name, index, list) => name && list.indexOf(name) === index);

function shouldFallback(error) {
  const message = String(error?.message || error || "");
  return (
    error?.status === 503 ||
    error?.status === 404 ||
    error?.status === 429 ||
    /high demand|unavailable|not found|quota|overloaded|429|503|404/i.test(message)
  );
}

async function generateWithFallback(genAI, contents) {
  let lastError;
  for (const modelName of MODEL_CHAIN) {
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: SYSTEM_PROMPT,
    });
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        return await model.generateContent({ contents });
      } catch (error) {
        lastError = error;
        if (!shouldFallback(error)) throw error;
        await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

export async function askTeaSommelier(history) {
  const apiKey = String(process.env.GEMINI_API_KEY || "").trim();
  if (!apiKey) {
    throw new Error("NO_GEMINI_KEY");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const contents = history
    .filter((item) => item.role === "user" || item.role === "assistant")
    .map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [{ text: String(item.content || "") }],
    }));

  if (contents.length === 0 || contents[0].role !== "user") {
    contents.unshift({
      role: "user",
      parts: [{ text: "Посетитель открыл чат. Поприветствуй и задай первый вопрос квиза." }],
    });
  }

  const result = await generateWithFallback(genAI, contents);
  const raw = result.response.text() || "";
  return extractLead(raw);
}
