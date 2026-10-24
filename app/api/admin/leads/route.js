import { isAdmin } from "@/lib/auth";
import { readLeads } from "@/lib/leads";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) {
    return Response.json({ error: "Нужен вход" }, { status: 401 });
  }
  const leads = await readLeads();
  return Response.json({ leads });
}
