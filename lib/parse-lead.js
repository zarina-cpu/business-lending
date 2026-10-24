import { resolveTeaChoice } from "./teas";

const QUIZ_SKIP = [
  "цветочный",
  "дымный",
  "ореховый",
  "ягодный",
  "белый чай",
  "жёлтый чай",
  "красный чай",
  "чёрный чай",
  "черный чай",
  "травяной",
  "для подарка",
  "церемонию",
  "не знаю",
];

export function validPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export function extractPhone(text) {
  const matches = String(text || "").match(/\+?\d[\d\s\-()]{8,16}\d/g) || [];
  for (const match of matches) {
    if (validPhone(match)) return match.replace(/\s+/g, " ").trim();
  }
  return null;
}

function looksLikeName(value) {
  const text = String(value || "").trim();
  if (text.length < 2 || text.length > 40) return false;
  if (/\d{4,}/.test(text)) return false;
  const lower = text.toLowerCase();
  if (QUIZ_SKIP.some((item) => lower.includes(item))) return false;
  return /^[A-Za-zА-Яа-яЁё]{2,}(?:[-\s][A-Za-zА-Яа-яЁё]{2,})?$/.test(text);
}

export function extractName(text) {
  const raw = String(text || "").trim();
  const labeled = raw.match(
    /(?:меня зовут|моё имя|мое имя|имя[:\s]+)[\s,]*([A-Za-zА-Яа-яЁё]{2,}(?:[-\s][A-Za-zА-Яа-яЁё]{2,})?)/i
  );
  if (labeled) return labeled[1];
  const withoutPhone = raw.replace(/\+?\d[\d\s\-()]{8,16}\d/g, "").trim();
  if (looksLikeName(withoutPhone)) return withoutPhone;
  return null;
}

export function leadFromHistory(history, modelLead) {
  const users = (history || []).filter((item) => item.role === "user");
  const blob = users.map((item) => item.content).join("\n");

  const name =
    (modelLead?.name && looksLikeName(modelLead.name) && modelLead.name) ||
    extractName(blob) ||
    [...users].reverse().map((item) => extractName(item.content)).find(Boolean);

  const phone =
    (modelLead?.phone && validPhone(modelLead.phone) && modelLead.phone) ||
    extractPhone(blob);

  if (!name || !phone) return null;

  const quiz = { ...(modelLead?.quiz || {}) };
  quiz.tea = resolveTeaChoice(blob, quiz.tea) || "не указан";

  return {
    name: String(name).trim(),
    phone: String(phone).trim(),
    comment: buildQuizComment({ history, modelComment: modelLead?.comment, quiz }),
    quiz: Object.keys(quiz).length ? quiz : null,
  };
}

function isChatDump(text) {
  const value = String(text || "");
  return (
    value.includes(" | ") ||
    /добро пожаловать|какой чай|какой из этих/i.test(value) ||
    value.length > 180
  );
}

export function buildQuizComment({ history = [], modelComment, quiz = {} }) {
  const users = history
    .filter((item) => item.role === "user")
    .map((item) => item.content)
    .join("\n");
  const teas =
    resolveTeaChoice(users, quiz.tea) ||
    quiz.taste ||
    "не указан";
  const parts = [`Чай: ${teas}`];
  if (quiz.goal) parts.push(`Цель: ${quiz.goal}`);
  if (quiz.budget) parts.push(`Бюджет: ${quiz.budget}`);
  const extra = String(modelComment || "").trim();
  if (extra && !isChatDump(extra)) {
    parts.push(extra);
  }
  return parts.join(". ");
}
