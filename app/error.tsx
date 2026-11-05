"use client";
import { useEffect } from "react";
import ErrorScreen from "@/components/ui/ErrorScreen";
import { useI18n } from "@/lib/i18n";

/** Route-level error boundary for every page (PRD §4.4). Header / nav stay usable around it. */
export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useI18n();
  useEffect(() => {
    // Structured, PII-free log: only the digest Next assigns (no URL, no stack to the UI).
    console.error(JSON.stringify({ level: "error", msg: "route_error", digest: error.digest ?? null }));
  }, [error.digest]);
  return (
    <ErrorScreen
      title={t("boundary.title")}
      body={t("boundary.body")}
      retryLabel={t("boundary.retry")}
      homeLabel={t("boundary.home")}
      codeLabel={t("boundary.code")}
      digest={error.digest}
      onRetry={reset}
    />
  );
}
