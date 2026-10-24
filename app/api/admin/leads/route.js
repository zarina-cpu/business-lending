import { isAdmin } from "@/lib/auth";
import { readLeads } from "@/lib/leads";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) {
    return Response.json({ error: "Нужен вход" }, { status: 401 });
  }
  try {
    const leads = await readLeads();
    return Response.json({ leads });
  } catch (error) {
    if (error?.message === "NO_TURSO") {
      return Response.json(
        { error: "Задайте TURSO_DATABASE_URL и TURSO_AUTH_TOKEN в .env.local" },
        { status: 500 }
      );
    }
    console.error(error);
    return Response.json({ error: "Не удалось прочитать заявки" }, { status: 500 });
  }
}
