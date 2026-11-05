import { Download, Wand2, BarChart3, Palette, Wrench, Flame, Globe2 } from "lucide-react";
import type { ToolItem } from "@/lib/registry";

/** Category ke hisaab se gradient tile + lucide vector icon (PRD §3.4) — emoji production UI me nahi. */
const CAT: Record<ToolItem["category"], { Icon: React.ElementType; g: string }> = {
  downloaders: { Icon: Download, g: "var(--tile-downloaders)" },
  platforms:   { Icon: Globe2,   g: "var(--tile-downloaders)" },
  ai:          { Icon: Wand2,    g: "var(--tile-ai)" },
  analytics:   { Icon: BarChart3, g: "var(--tile-analytics)" },
  visual:      { Icon: Palette,  g: "var(--tile-visual)" },
  utilities:   { Icon: Wrench,   g: "var(--tile-utilities)" },
  fun:         { Icon: Flame,    g: "var(--tile-fun)" },
};

export const CATEGORY_ICON = Object.fromEntries(Object.entries(CAT).map(([k, v]) => [k, v.Icon])) as Record<ToolItem["category"], React.ElementType>;

export default function ToolIcon({ category, size = 56 }: { category: ToolItem["category"]; size?: number }) {
  const { Icon, g } = CAT[category] ?? CAT.utilities;
  return (
    <span className="ticon" aria-hidden="true" style={{ width: size, height: size, background: g, borderRadius: Math.round(size * 0.29) }}>
      <Icon size={Math.round(size * 0.46)} strokeWidth={2} />
    </span>
  );
}
