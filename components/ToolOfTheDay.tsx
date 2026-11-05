"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import ToolIcon from "@/components/ToolIcon";
import { visibleTools, type ToolItem } from "@/lib/registry";
import { useI18n } from "@/lib/i18n";

const POOL = visibleTools.filter((t) => t.featured);

/** Daily spotlight (PRD §9.1 #5): same featured registry tool for everyone all day; height reserved before mount (CLS 0). */
export default function ToolOfTheDay() {
  const { t } = useI18n();
  const [tool, setTool] = useState<ToolItem | null>(null);
  useEffect(() => {
    const now = new Date();
    const day = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000);
    setTool(POOL[day % Math.max(POOL.length, 1)] ?? null);
  }, []);
  if (!tool) return <div className="tod tod--skel" aria-hidden="true" />;
  return (
    <Link href={tool.href} className="tod">
      <ToolIcon category={tool.category} size={48} />
      <span className="tod__body">
        <span className="tod__label"><Sparkles size={14} strokeWidth={2} aria-hidden="true" /> {t("tools.tod")}</span>
        <b className="tod__name">{tool.name}</b>
        <span className="tod__desc">{tool.description}</span>
      </span>
      <ArrowRight className="tod__arrow" size={20} strokeWidth={2} aria-hidden="true" />
    </Link>
  );
}
