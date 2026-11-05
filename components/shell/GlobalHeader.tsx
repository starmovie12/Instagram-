"use client";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import ThemeToggle from "@/components/ThemeToggle";
import LanguagePicker from "@/components/LanguagePicker";

/**
 * PRD §5 / §24 — left: Logo + name · right: Language + Light/Dark. Nothing else
 * (no avatar, streak, crown or links — AC-1, AC-63). 64 px (72 px ≥ 1024 px) +
 * safe-area; hairline appears after 8 px of scroll via an IntersectionObserver
 * sentinel (M11, no scroll listener). Quick Return on long screens.
 */
export default function GlobalHeader({ hidden }: { hidden: boolean }) {
  const sentinel = useRef<HTMLSpanElement>(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const el = sentinel.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setScrolled(!(e?.isIntersecting ?? true)));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <>
      <span ref={sentinel} className="gh-sentinel" aria-hidden="true" />
      <header className="gh" data-scrolled={scrolled ? "true" : "false"} data-hidden={hidden ? "true" : "false"}>
        <div className="gh__in">
          <Logo />
          <div className="gh__right">
            <span className="gh__lang"><LanguagePicker /></span>
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  );
}
