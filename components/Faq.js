"use client";

import { useState } from "react";
import Reveal from "./Reveal";

const items = [
  {
    q: "Нужно ли разбираться в чае, чтобы прийти?",
    a: "Нет. Достаточно сказать, пьёте ли вы крепкий чёрный по утрам или что-то мягкое вечером. Сомелье ведёт заварку.",
  },
  {
    q: "Можно купить чай без церемонии?",
    a: "Да. Магазин работает вместе с залом. Можно взять навеску после короткой пробы или сразу, если уже знаете лист.",
  },
  {
    q: "Как попасть на церемонию?",
    a: "Оставьте заявку или пройдите короткий подбор с ИИ-сомелье. Мы перезвоним, подтвердим время и состав стола.",
  },
  {
    q: "Есть ли чай без кофеина?",
    a: "Травяные сборы без кофеина: вечерний двор, кипрей, ройбуш с шиповником. Если нужен крепкий утренний — чёрный ассам или цейлон, из китайских красных — дяньхун. Сомелье подскажет.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="px-5 py-24 md:px-10">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="font-display text-4xl text-fg md:text-5xl">
            Частые вопросы до первой чашки
          </h2>
        </Reveal>
        <div className="mt-12 divide-y divide-line border-y border-line">
          {items.map((item, index) => {
            const active = open === index;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  className="flex w-full items-baseline justify-between gap-6 py-5 text-left"
                  onClick={() => setOpen(active ? -1 : index)}
                  aria-expanded={active}
                >
                  <span className="font-display text-2xl text-fg">{item.q}</span>
                  <span className="text-copper">{active ? "–" : "+"}</span>
                </button>
                {active ? (
                  <p className="pb-6 leading-relaxed text-muted">{item.a}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
