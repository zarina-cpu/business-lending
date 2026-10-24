import Reveal from "./Reveal";

const reviews = [
  {
    name: "Марина",
    text: "Пришла за «каким-нибудь зелёным». Ушла с тайваньским улуном и записью на субботу. Чай дома пьётся иначе, чем в зале — но лист тот же, и это приятно.",
  },
  {
    name: "Артём",
    text: "Дарили родителям коробку: белый Бай Му Дань, жёлтые почки Хошань и вечерний травяной. Не набор из трёх пакетиков, а три разных характера.",
  },
  {
    name: "Лена и Илья",
    text: "Церемония на годовщину. Никто не читал лекцию про династии. Просто наливали, пауза, ещё круг. За час стало тихо даже у нас.",
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="bg-surface px-5 py-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-4xl text-fg md:text-5xl">
            Что говорят после третьей проливки
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {reviews.map((review) => (
            <Reveal key={review.name}>
              <blockquote className="border-l border-copper pl-5">
                <p className="leading-relaxed text-fg">{review.text}</p>
                <footer className="mt-5 text-sm text-muted">{review.name}</footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
