"use client";

import { useEffect } from "react";

const revealSelectors = [
  ".section",
  ".trust-strip",
  ".search-band",
  ".consultation-proof",
  ".section-title",
  ".feature-card",
  ".university-card",
  ".plan-card",
  ".benefit-card",
  ".metric-card",
  ".faq-item",
  ".logic-card",
  ".insight-card",
  ".article-card",
  ".consultation-strip",
  ".consultation-proof div",
  ".assurance-grid p",
  ".filter-bar",
  ".calculator-shell",
  ".apply-layout",
  ".detail-hero",
  ".program-list article",
  ".student-application-card",
  ".steps li",
].join(",");

export default function ScrollMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>(revealSelectors));

    document.body.classList.add("motion-ready");

    elements.forEach((element, index) => {
      element.classList.add("reveal-item");
      element.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 85}ms`);
    });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -18% 0px", threshold: 0.12 },
    );

    elements.forEach(element => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return null;
}
