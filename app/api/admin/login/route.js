import { checkPassword, setAdminCookie } from "@/lib/auth";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  if (!process.env.ADMIN_PASSWORD) {
    return Response.json(
      { error: "Задайте ADMIN_PASSWORD в .env.local" },
      { status: 500 }
    );
  }

  if (!checkPassword(body.password)) {
    return Response.json({ error: "Неверный пароль" }, { status: 401 });
  }

  await setAdminCookie();
  return Response.json({ ok: true });
}
