import { findMentionedTeas } from "./teas";

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

  const mentioned = findMentionedTeas(
    `${blob}\n${modelLead?.comment || ""}\n${modelLead?.quiz?.tea || ""}`
  );
  const quiz = { ...(modelLead?.quiz || {}) };
  if (mentioned.length) {
    quiz.tea = mentioned.join(", ");
  }

  const comment = String(
    modelLead?.comment ||
      (mentioned.length ? `Хочет: ${mentioned.join(", ")}` : blob.slice(-280))
  ).trim();

  return {
    name: String(name).trim(),
    phone: String(phone).trim(),
    comment,
    quiz: Object.keys(quiz).length ? quiz : null,
  };
}
