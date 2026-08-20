"use client";

import { useEffect } from "react";

/**
 * Lightweight scroll-reveal: observes top-level entry-content children
 * (and hero sections) and toggles a class that CSS animates in.
 * No dependency needed — a small IntersectionObserver utility.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      ".entry-content > *, .reveal-on-scroll"
    );

    if (!targets.length) return;

    targets.forEach((el) => el.classList.add("reveal-init"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    targets.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
}
