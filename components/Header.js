"use client";

import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "#teas", label: "Чаи" },
  { href: "#benefits", label: "Как пьём" },
  { href: "#reviews", label: "Гости" },
  { href: "#faq", label: "Вопросы" },
  { href: "#lead", label: "Заявка" },
];

export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-6 md:px-10">
      <a href="#top" className="font-display text-2xl tracking-tight text-fg">
        Hokkori Tea
      </a>
      <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="hover:text-copper">
            {link.label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <a
          href="#lead"
          className="hidden rounded-full bg-copper px-4 py-2 text-sm text-steam md:inline-flex"
        >
          Записаться
        </a>
      </div>
    </header>
  );
}
