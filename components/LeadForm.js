"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { readResponseJson } from "@/lib/http";

export default function LeadForm() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    const formEl = event.currentTarget;
    setError("");
    setStatus("loading");
    const form = new FormData(formEl);
    const payload = {
      name: form.get("name"),
      phone: form.get("phone"),
      comment: form.get("comment"),
      source: "form",
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await readResponseJson(response);
      if (!response.ok) {
        throw new Error(data.error || "Не удалось отправить");
      }
      setStatus("done");
      formEl.reset();
    } catch (err) {
      setStatus("idle");
      setError(err.message);
    }
  }

  return (
    <section id="lead" className="bg-surface px-5 py-24 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <h2 className="font-display text-4xl text-fg md:text-5xl">
            Оставьте номер — подберём лист или стол
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-muted">
            Перезвоним в течение дня, уточним вкус и свободные часы в зале.
            Если удобнее в чате, откройте сомелье справа внизу.
          </p>
        </Reveal>
        <Reveal>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <label className="text-sm text-muted">
              Имя
              <input
                name="name"
                required
                minLength={2}
                className="mt-1 w-full border-b border-line bg-transparent py-2 text-fg outline-none focus:border-copper"
              />
            </label>
            <label className="text-sm text-muted">
              Телефон
              <input
                name="phone"
                required
                type="tel"
                placeholder="+7"
                className="mt-1 w-full border-b border-line bg-transparent py-2 text-fg outline-none focus:border-copper"
              />
            </label>
            <label className="text-sm text-muted">
              Что подобрать
              <textarea
                name="comment"
                rows={3}
                placeholder="Белый, жёлтый, красный, чёрный, травяной…"
                className="mt-1 w-full border-b border-line bg-transparent py-2 text-fg outline-none focus:border-copper"
              />
            </label>
            {error ? <p className="text-sm text-copper">{error}</p> : null}
            {status === "done" ? (
              <p className="text-sm text-celadon">
                Заявка принята. Сомелье свяжется с вами.
              </p>
            ) : null}
            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-2 self-start rounded-full bg-copper px-6 py-3 text-steam disabled:opacity-60"
            >
              {status === "loading" ? "Отправляем…" : "Отправить заявку"}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
