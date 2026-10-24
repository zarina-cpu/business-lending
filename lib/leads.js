import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "leads.json");

export async function readLeads() {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addLead(payload) {
  const leads = await readLeads();
  const entry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: String(payload.name || "").trim(),
    phone: String(payload.phone || "").trim(),
    comment: String(payload.comment || "").trim(),
    source: payload.source === "quiz" ? "quiz" : "form",
    quiz: payload.quiz || null,
  };
  leads.unshift(entry);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(leads, null, 2), "utf8");
  return entry;
}
