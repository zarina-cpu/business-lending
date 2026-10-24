"use client";

import { useEffect, useRef, useState } from "react";

const starters = [
  "Белый чай",
  "Жёлтый чай",
  "Красный чай",
  "Чёрный чай",
  "Травяной сбор",
];

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [contact, setContact] = useState({ name: "", phone: "" });
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  async function send(content) {
    const text = content.trim();
    if (!text || busy) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setNotice("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Нет ответа");
      }
      setMessages([
        ...next,
        { role: "assistant", content: data.reply || "Давайте подберём чай." },
      ]);
      if (data.leadSaved) {
        setNotice("Заявку записали. Сомелье перезвонит, и она уже в /admin и в Telegram.");
      }
    } catch (error) {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: error.message,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  async function greet() {
    if (messages.length > 0 || busy) return;
    setBusy(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [] }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setMessages([{ role: "assistant", content: data.reply }]);
    } catch (error) {
      setMessages([{ role: "assistant", content: error.message }]);
    } finally {
      setBusy(false);
    }
  }

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && messages.length === 0) {
      greet();
    }
  }

  return (
    <>
      <button
        id="ai-open"
        type="button"
        onClick={toggle}
        className="fixed bottom-5 right-5 z-40 rounded-full bg-celadon px-4 py-3 text-sm text-steam shadow-lg"
      >
        {open ? "Закрыть" : "Сомелье"}
      </button>
      {open ? (
        <div className="fixed bottom-20 right-5 z-40 flex h-[min(32rem,70vh)] w-[min(24rem,calc(100vw-2rem))] flex-col border border-line bg-bg shadow-2xl">
          <div className="border-b border-line px-4 py-3">
            <p className="font-display text-xl text-fg">Сомелье в чате</p>
            <p className="text-xs text-muted">
              Короткий квиз: вкус, цель, бюджет — и заявка, если захотите.
            </p>
          </div>
          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((message, index) => (
              <p
                key={`${message.role}-${index}`}
                className={
                  message.role === "user"
                    ? "ml-8 rounded-2xl bg-surface px-3 py-2 text-sm text-fg"
                    : "mr-8 text-sm leading-relaxed text-fg"
                }
              >
                {message.content}
              </p>
            ))}
            {busy ? <p className="text-sm text-muted">Завариваю ответ…</p> : null}
          </div>
          {notice ? (
            <p className="px-4 text-xs text-celadon">{notice}</p>
          ) : null}
          <form
            className="grid grid-cols-2 gap-2 border-t border-line px-3 py-2"
            onSubmit={async (event) => {
              event.preventDefault();
              if (busy) return;
              setBusy(true);
              setNotice("");
              try {
                const response = await fetch("/api/leads", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: contact.name,
                    phone: contact.phone,
                    comment: messages.map((item) => item.content).join(" | ").slice(0, 400),
                    source: "quiz",
                  }),
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Не удалось записать");
                setNotice("Заявку записали. Сомелье перезвонит, и она уже в /admin и в Telegram.");
                setContact({ name: "", phone: "" });
              } catch (error) {
                setNotice(error.message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <input
              value={contact.name}
              onChange={(event) =>
                setContact((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="Имя"
              className="bg-transparent text-sm text-fg outline-none"
              required
              minLength={2}
            />
            <input
              value={contact.phone}
              onChange={(event) =>
                setContact((prev) => ({ ...prev, phone: event.target.value }))
              }
              placeholder="Телефон"
              type="tel"
              className="bg-transparent text-sm text-fg outline-none"
              required
            />
            <button
              type="submit"
              disabled={busy}
              className="col-span-2 text-left text-xs text-copper disabled:opacity-50"
            >
              Записать заявку
            </button>
          </form>
          <div className="flex flex-wrap gap-2 px-4 pb-2">
            {starters.map((chip) => (
              <button
                key={chip}
                type="button"
                className="rounded-full border border-line px-3 py-1 text-xs text-muted hover:border-copper hover:text-copper"
                onClick={() => send(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
          <form
            className="flex gap-2 border-t border-line p-3"
            onSubmit={(event) => {
              event.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Напишите вкус или телефон"
              className="flex-1 bg-transparent text-sm text-fg outline-none"
            />
            <button
              type="submit"
              disabled={busy}
              className="text-sm text-copper disabled:opacity-50"
            >
              Отправить
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
