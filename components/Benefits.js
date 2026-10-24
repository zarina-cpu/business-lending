import Reveal from "./Reveal";

const items = [
  {
    title: "Дегустация до покупки",
    text: "Навеску сначала завариваем в зале. Если чай не отозвался — не настаиваем, ищем другой лист.",
  },
  {
    title: "Подбор под ваш вкус",
    text: "Цветочный, дымный, ореховый, ягодный. Сомелье спрашивает не «какой сорт», а как вы пьёте утро.",
  },
  {
    title: "Церемонии без спешки",
    text: "Стол на двоих или компанию до шести. Гунфу занимает час: вода, паузы, разговор тише чашки.",
  },
  {
    title: "Коробки, которые не стыдно дарить",
    text: "Три навески, деревянная щепа, короткая записка от сомелье — без бантиков из магазина у дома.",
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="px-5 py-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display max-w-lg text-4xl text-fg md:text-5xl">
            Лист, вода и время — без суеты торгового зала
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-x-16 gap-y-12 md:grid-cols-2">
          {items.map((item) => (
            <Reveal key={item.title}>
              <h3 className="font-display text-2xl text-fg">{item.title}</h3>
              <p className="mt-3 max-w-md leading-relaxed text-muted">
                {item.text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
