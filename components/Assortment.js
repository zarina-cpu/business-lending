import Reveal from "./Reveal";
import { TEA_FAMILIES } from "@/lib/teas";

export default function Assortment() {
  return (
    <section id="teas" className="bg-surface px-5 py-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display max-w-xl text-4xl text-fg md:text-5xl">
            Белый, жёлтый, красный, чёрный и травы — лист под разное утро
          </h2>
          <p className="mt-5 max-w-lg leading-relaxed text-muted">
            Навеска от 50 г. Можно попробовать в зале, затем взять домой или
            собрать коробку из трёх характеров.
          </p>
        </Reveal>
        <div className="mt-16 grid gap-14 md:grid-cols-2 xl:grid-cols-3">
          {TEA_FAMILIES.map((family) => (
            <Reveal key={family.title}>
              <h3 className="font-display text-3xl text-fg">{family.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {family.lead}
              </p>
              <ul className="mt-8 space-y-6">
                {family.teas.map((tea) => (
                  <li key={tea.name} className="border-t border-line pt-5">
                    <p className="font-display text-xl text-fg">{tea.name}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {tea.note}
                    </p>
                    <p className="mt-2 text-sm text-copper">{tea.price}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
