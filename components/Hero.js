"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TeaBowl from "./TeaBowl";

export default function Hero() {
  const root = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = root.current;
    if (!el) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.from(".hero-copy", {
        opacity: 0,
        y: 28,
        duration: 1.05,
        ease: "power2.out",
      });
      gsap.to(".leaf-a", {
        yPercent: 38,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".leaf-b", {
        yPercent: -24,
        rotate: 12,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-bowl", {
        yPercent: 16,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={root}
      className="relative isolate min-h-[100svh] overflow-hidden px-5 pb-16 pt-28 md:px-10 md:pt-32"
    >
      <div className="leaf-a pointer-events-none absolute -left-16 top-24 h-56 w-56 rounded-full bg-celadon/25 blur-2xl" />
      <div className="leaf-b pointer-events-none absolute -right-10 bottom-10 h-72 w-72 rounded-full bg-copper/20 blur-3xl" />
      <svg
        className="leaf-a pointer-events-none absolute left-[8%] top-[22%] w-16 text-celadon opacity-70"
        viewBox="0 0 80 80"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 48c22-28 40-36 56-36-4 22-16 40-40 48-8-4-14-8-16-12Z" />
      </svg>
      <svg
        className="leaf-b pointer-events-none absolute right-[18%] top-[18%] w-12 text-copper opacity-80"
        viewBox="0 0 80 80"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M68 28C44 8 22 10 8 22c18 18 38 24 52 22 6-4 8-10 8-16Z" />
      </svg>

      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <div className="hero-copy max-w-xl">
          <p className="mb-5 text-sm text-muted">Чайная и магазин на Никитской</p>
          <h1 className="font-display text-[2.7rem] leading-[1.05] text-fg md:text-6xl">
            Редкий чай, который пьют не залпом, а по ритуалу
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            Подберём белый, жёлтый, красный, чёрный или травяной сбор под ваш
            вкус и запишем на церемонию в зале с паром над гайванью.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#teas"
              className="rounded-full bg-copper px-6 py-3 text-steam"
            >
              Подобрать чай
            </a>
            <button
              type="button"
              className="rounded-full border border-line px-6 py-3 text-fg"
              onClick={() =>
                document.getElementById("ai-open")?.click()
              }
            >
              Спросить сомелье
            </button>
          </div>
        </div>
        <div className="hero-bowl relative mx-auto">
          <TeaBowl />
        </div>
      </div>
    </section>
  );
}
