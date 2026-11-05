"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { RefreshCw, CloudOff } from "lucide-react";

type Props = {
  title: string;
  body: string;
  retryLabel: string;
  homeLabel: string;
  codeLabel: string;
  digest?: string;
  onRetry: () => void;
};

/**
 * Friendly retry screen used by app/error.tsx and app/global-error.tsx
 * (PRD §4.4: `role="alert"`, Retry button; S8: illustration + 1 line + 1 action).
 * Focus moves to the heading so screen-reader and keyboard users land on it.
 */
export default function ErrorScreen({ title, body, retryLabel, homeLabel, codeLabel, digest, onRetry }: Props) {
  const h = useRef<HTMLHeadingElement>(null);
  useEffect(() => { h.current?.focus(); }, []);
  return (
    <main className="boundary" role="alert" aria-live="assertive">
      <span className="boundary__art" aria-hidden="true"><CloudOff size={32} strokeWidth={2} /></span>
      <h1 ref={h} tabIndex={-1} className="boundary__title">{title}</h1>
      <p className="boundary__body">{body}</p>
      <button type="button" className="boundary__retry" onClick={onRetry}>
        <RefreshCw size={20} strokeWidth={2} aria-hidden="true" /> {retryLabel}
      </button>
      <Link href="/" className="boundary__home">{homeLabel}</Link>
      {digest && <p className="boundary__code">{codeLabel}: <code>{digest}</code></p>}
    </main>
  );
}
