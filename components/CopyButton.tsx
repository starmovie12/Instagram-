"use client";
import { useRef, useState } from "react";
import { Copy, Check } from "lucide-react";

/** Copy button with the Gold Tick (§8.6): copy→check coin pop + ring pulse + "Copied" for 1.4s. No toast. */
export default function CopyButton({ text, label = "Copy", copiedLabel = "Copied", className = "btn btn-secondary" }:
  { text: string; label?: string; copiedLabel?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function copy() {
    try { await navigator.clipboard.writeText(text); } catch { return; }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button className={`${className} ${copied ? "tick" : ""}`} onClick={copy}>
      {copied
        ? <Check size={16} strokeWidth={2} className="coin-in" style={{ color: "var(--gold-ink)" }} />
        : <Copy size={16} strokeWidth={1.5} />}
      {copied ? copiedLabel : label}
    </button>
  );
}
