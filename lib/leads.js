import { promises as fs } from "fs";
import path from "path";
import { getDb } from "./db";

const localFile = path.join(process.cwd(), "data", "leads.json");
let ready = false;

function rowToLead(row) {
  let quiz = null;
  if (row.quiz) {
    try {
      quiz = JSON.parse(row.quiz);
    } catch {
      quiz = null;
    }
  }
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    phone: row.phone,
    comment: row.comment || "",
    source: row.source || "form",
    quiz,
  };
}

async function ensureTable() {
  if (ready) return;
  const db = getDb();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      comment TEXT,
      source TEXT,
      quiz TEXT
    )
  `);

  const count = await db.execute("SELECT COUNT(*) AS total FROM leads");
  const total = Number(count.rows[0]?.total || 0);
  if (total === 0) {
    try {
      const raw = await fs.readFile(localFile, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) {
        for (const lead of parsed) {
          await db.execute({
            sql: `INSERT OR IGNORE INTO leads (id, created_at, name, phone, comment, source, quiz)
                  VALUES (?, ?, ?, ?, ?, ?, ?)`,
            args: [
              lead.id,
              lead.createdAt,
              lead.name,
              lead.phone,
              lead.comment || "",
              lead.source || "form",
              lead.quiz ? JSON.stringify(lead.quiz) : null,
            ],
          });
        }
      }
    } catch {
      // no local file to import
    }
  }

  ready = true;
}

export async function readLeads() {
  await ensureTable();
  const result = await getDb().execute(
    "SELECT id, created_at, name, phone, comment, source, quiz FROM leads ORDER BY created_at DESC"
  );
  return result.rows.map(rowToLead);
}

export async function addLead(payload) {
  await ensureTable();
  const entry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: String(payload.name || "").trim(),
    phone: String(payload.phone || "").trim(),
    comment: String(payload.comment || "").trim(),
    source: payload.source === "quiz" ? "quiz" : "form",
    quiz: payload.quiz || null,
  };

  await getDb().execute({
    sql: `INSERT INTO leads (id, created_at, name, phone, comment, source, quiz)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      entry.id,
      entry.createdAt,
      entry.name,
      entry.phone,
      entry.comment,
      entry.source,
      entry.quiz ? JSON.stringify(entry.quiz) : null,
    ],
  });

  return entry;
}
