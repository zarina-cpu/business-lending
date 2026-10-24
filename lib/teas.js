export const TEA_FAMILIES = [
  {
    title: "Белый чай",
    lead: "Слабая ферментация, светлый настой, вкус ближе к цветам и сухофруктам.",
    teas: [
      {
        name: "Бай Хао Инь Чжэнь",
        note: "Серебряные почки. Мёд, дыня, тёплый бархат.",
        price: "2 400 ₽ / 50 г",
      },
      {
        name: "Бай Му Дань",
        note: "Белый пион. Груша, сено, мягкая горечь в финале.",
        price: "1 650 ₽ / 50 г",
      },
      {
        name: "Шоу Мэй",
        note: "Брови долголетия. Сухофрукты, кора, вечерняя плотность.",
        price: "1 280 ₽ / 50 г",
      },
      {
        name: "Гун Мэй",
        note: "Почти как баймудань, но ярче по ягоде и корочке хлеба.",
        price: "1 420 ₽ / 50 г",
      },
    ],
  },
  {
    title: "Жёлтый чай",
    lead: "Редкий лист с томлением: мягче зелёного, теплее белого.",
    teas: [
      {
        name: "Цзюнь Шань Инь Чжэнь",
        note: "Иглы с горы Цзюньшань. Каштан, сливки, лёгкий дымок.",
        price: "3 100 ₽ / 50 г",
      },
      {
        name: "Хошань Хуан Я",
        note: "Жёлтые почки Аньхоя. Кукуруза, орех, тёплое сено.",
        price: "1 890 ₽ / 50 г",
      },
      {
        name: "Мэндин Хуан Я",
        note: "Сычуаньская почка. Цветок, масло, долгий сладкий хвост.",
        price: "2 250 ₽ / 50 г",
      },
      {
        name: "Хуан Да Ча",
        note: "Крупный жёлтый лист. Печёное яблоко, солома, мягкая густота.",
        price: "1 560 ₽ / 50 г",
      },
    ],
  },
  {
    title: "Красный чай",
    lead: "Китайский хун ча: полный настой, мёд, сухофрукты, без резкой горечи пакетика.",
    teas: [
      {
        name: "Дяньхун Золотые почки",
        note: "Юньнань. Карамель, какао, тёплый мёд.",
        price: "1 680 ₽ / 50 г",
      },
      {
        name: "Цимень Хао Я",
        note: "Аньхойский красный. Вишня, вино, лёгкий дым.",
        price: "1 540 ₽ / 50 г",
      },
      {
        name: "Цзинь Цзюнь Мэй",
        note: "Мелкие золотые нити. Сливки, цветок, долгая сладость.",
        price: "2 800 ₽ / 50 г",
      },
      {
        name: "Чжэншань Сяочжун",
        note: "Лапсанг. Костёр, смола, сухофрукты — для тех, кто любит дым.",
        price: "1 490 ₽ / 50 г",
      },
    ],
  },
  {
    title: "Чёрный чай",
    lead: "Классический крепкий лист к утру и к молоку: Индия, Цейлон, привычный характер.",
    teas: [
      {
        name: "Ассам TGFOP",
        note: "Плотный, солодовый, бодрит. Хорош с молоком.",
        price: "980 ₽ / 50 г",
      },
      {
        name: "Дарджилинг FTGFOP",
        note: "Второй сбор. Мускат, цветок, лёгкая терпкость.",
        price: "1 360 ₽ / 50 г",
      },
      {
        name: "Цейлон Ува",
        note: "Яркий, пряный, чистый. Завтрак без суеты.",
        price: "890 ₽ / 50 г",
      },
      {
        name: "Эрл Грей",
        note: "Цейлонский лист и бергамот. Цитрус поверх крепости.",
        price: "920 ₽ / 50 г",
      },
    ],
  },
  {
    title: "Травяные сборы",
    lead: "Без листа камелии или почти без него. Для вечера и тех, кто бережёт сон.",
    teas: [
      {
        name: "Вечерний двор",
        note: "Липа, ромашка, мелисса. Тихий настой перед сном.",
        price: "890 ₽ / 50 г",
      },
      {
        name: "Кипрей ферментированный",
        note: "Иван-чай. Сухофрукты, хлебная корка, почти как красный.",
        price: "720 ₽ / 50 г",
      },
      {
        name: "Ройбуш с шиповником",
        note: "Южная сладость, ягода, нет кофеина.",
        price: "780 ₽ / 50 г",
      },
      {
        name: "Мята, имбирь и лемонграсс",
        note: "Свежесть и тепло. После еды или вместо кофе днём.",
        price: "810 ₽ / 50 г",
      },
    ],
  },
];

export function catalogForPrompt() {
  return TEA_FAMILIES.map((family) => {
    const items = family.teas
      .map((tea) => `${tea.name} (${tea.price}) — ${tea.note}`)
      .join("; ");
    return `${family.title}: ${items}`;
  }).join("\n");
}

function fold(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/ё/g, "е");
}

const FAMILY_ALIASES = [
  {
    title: "Белый чай",
    pattern: /(бел(?:ый|ые|ого|ую|ых|ым)|бай\s*хао|бай\s*му\s*дань|шоу\s*мэй|гун\s*мэй)/,
  },
  {
    title: "Жёлтый чай",
    pattern: /(желт(?:ый|ые|ого|ую|ых|ым)|хуан\s*я|хуан\s*да\s*ча|цзюнь\s*шань)/,
  },
  {
    title: "Красный чай",
    pattern: /(красн(?:ый|ые|ого|ую|ых|ым)|хун\s*ча|дяньхун|цимень|цзинь\s*цзюнь|сяочжун|лапсанг)/,
  },
  {
    title: "Чёрный чай",
    pattern: /(черн(?:ый|ые|ого|ую|ых|ым)|ассам|дарджилинг|цейлон|эрл\s*грей)/,
  },
  {
    title: "Травяные сборы",
    pattern:
      /(травян(?:ой|ые|ого|ую|ых|ым)|трав(?:ы|яной)|иван-?чай|кипрей|ройбуш|мелисс|ромашк|лемонграсс)/,
  },
];

export function findNamedTeas(text) {
  const blob = fold(text);
  const names = [];
  for (const family of TEA_FAMILIES) {
    for (const tea of family.teas) {
      if (blob.includes(fold(tea.name))) names.push(tea.name);
    }
  }
  return [...new Set(names)];
}

export function detectTeaFamily(text) {
  const blob = fold(text);
  let found = null;
  let lastIndex = -1;
  for (const item of FAMILY_ALIASES) {
    const match = blob.match(item.pattern);
    if (!match) continue;
    const index = blob.lastIndexOf(match[0]);
    if (index >= lastIndex) {
      lastIndex = index;
      found = item.title;
    }
  }
  return found;
}

export function resolveTeaChoice(userText, modelTea = "") {
  const namedByUser = findNamedTeas(userText);
  if (namedByUser.length) return namedByUser.join(", ");

  const userFamily = detectTeaFamily(userText);
  if (userFamily) {
    const namedByModel = findNamedTeas(modelTea);
    const modelFamily = detectTeaFamily(modelTea);
    if (namedByModel.length && (!modelFamily || modelFamily === userFamily)) {
      return namedByModel.join(", ");
    }
    return userFamily;
  }

  const namedByModel = findNamedTeas(modelTea);
  if (namedByModel.length) return namedByModel.join(", ");
  return "";
}

export function findMentionedTeas(text, options = {}) {
  const includeFamilies = options.includeFamilies !== false;
  const named = findNamedTeas(text);
  if (!includeFamilies) return named;
  const family = detectTeaFamily(text);
  if (family && !named.length) return [family];
  return named;
}
