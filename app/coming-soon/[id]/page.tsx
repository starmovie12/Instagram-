import type { Metadata } from "next";
import "./soon.css";
import { notFound } from "next/navigation";
import ComingSoon from "@/components/soon/ComingSoon";
import LegalFoot from "@/components/LegalFoot";
import { SOON_PLATFORMS, soonById } from "@/lib/platforms";

export const dynamicParams = false;
export function generateStaticParams() { return SOON_PLATFORMS.map((p) => ({ id: p.id })); }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = soonById(id);
  return { title: p ? `${p.name} support coming soon` : "Coming soon", robots: { index: false, follow: false } };
}

/** PRD §7.6.9 — backend nahi wale apps ka link paste karne par: kabhi dead-end nahi. Link yahan save/show nahi hota. */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = soonById(id);
  if (!p) notFound();
  return (
    <>
      <ComingSoon app={{ name: p.name, iconKey: p.iconKey }} />
      <LegalFoot />
    </>
  );
}
