"use client";

import { useCallback, useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState([]);
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadLeads = useCallback(async () => {
    const response = await fetch("/api/admin/leads");
    if (response.status === 401) {
      setAuthed(false);
      setLeads([]);
      return;
    }
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Не удалось загрузить заявки");
      return;
    }
    setAuthed(true);
    setLeads(data.leads || []);
  }, []);

  useEffect(() => {
    loadLeads().finally(() => setLoading(false));
  }, [loadLeads]);

  async function login(event) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Ошибка входа");
      return;
    }
    setPassword("");
    await loadLeads();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setLeads([]);
  }

  return (
    <div className="min-h-screen bg-bg px-5 py-10 text-fg md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <a href="/" className="text-sm text-muted hover:text-copper">
              На сайт
            </a>
            <h1 className="font-display mt-2 text-4xl">Заявки</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {authed ? (
              <button
                type="button"
                onClick={logout}
                className="text-sm text-muted hover:text-copper"
              >
                Выйти
              </button>
            ) : null}
          </div>
        </div>

        {loading ? <p className="text-muted">Загружаем…</p> : null}

        {!loading && !authed ? (
          <form onSubmit={login} className="max-w-sm">
            <label className="text-sm text-muted">
              Пароль администратора
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 w-full border-b border-line bg-transparent py-2 outline-none focus:border-copper"
              />
            </label>
            {error ? <p className="mt-3 text-sm text-copper">{error}</p> : null}
            <button
              type="submit"
              className="mt-6 rounded-full bg-copper px-5 py-2 text-steam"
            >
              Войти
            </button>
          </form>
        ) : null}

        {authed ? (
          leads.length === 0 ? (
            <p className="text-muted">
              Заявок пока нет. Они появятся из формы на сайте или из квиза сомелье.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead className="border-b border-line text-muted">
                  <tr>
                    <th className="py-3 pr-4 font-medium">Когда</th>
                    <th className="py-3 pr-4 font-medium">Имя</th>
                    <th className="py-3 pr-4 font-medium">Телефон</th>
                    <th className="py-3 pr-4 font-medium">Откуда</th>
                    <th className="py-3 font-medium">Комментарий</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-line/70 align-top">
                      <td className="py-4 pr-4 text-muted">
                        {formatDate(lead.createdAt)}
                      </td>
                      <td className="py-4 pr-4">{lead.name}</td>
                      <td className="py-4 pr-4">{lead.phone}</td>
                      <td className="py-4 pr-4 text-muted">
                        {lead.source === "quiz" ? "ИИ-квиз" : "форма"}
                      </td>
                      <td className="py-4">
                        <p>{lead.comment || "—"}</p>
                        {lead.quiz ? (
                          <p className="mt-1 text-xs text-muted">
                            {Object.entries(lead.quiz)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(" · ")}
                          </p>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}
