import "./offline.css";
import type { Metadata } from "next";
import LegalFoot from "@/components/LegalFoot";
import OfflineScreen from "@/components/OfflineScreen";

export const metadata: Metadata = {
  title: "You're offline",
  description: "No connection right now — your saved history is still here.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <OfflineScreen />
      <LegalFoot />
    </>
  );
}
