"use client";
import { useEffect, useState } from "react";
import ErrorScreen from "@/components/ui/ErrorScreen";
import { translate } from "@/lib/i18n";
import "./globals.css";
import "./shell.css";

/**
 * Last-resort boundary when the root layout itself fails. It replaces <html>,
 * so it reads the saved language/theme directly (no providers available).
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [lang, setLang] = useState("en");
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    try {
      setLang(localStorage.getItem("ig-lang") || "en");
      setTheme(localStorage.getItem("ig-theme") || "light");
    } catch { /* private mode: defaults */ }
    console.error(JSON.stringify({ level: "error", msg: "global_error", digest: error.digest ?? null }));
  }, [error.digest]);
  const rtl = ["ar", "ur", "fa"].includes(lang);
  return (
    <html lang={lang} dir={rtl ? "rtl" : "ltr"} data-theme={theme}>
      <body>
        <ErrorScreen
          title={translate(lang, "boundary.title")}
          body={translate(lang, "boundary.body")}
          retryLabel={translate(lang, "boundary.retry")}
          homeLabel={translate(lang, "boundary.home")}
          codeLabel={translate(lang, "boundary.code")}
          digest={error.digest}
          onRetry={reset}
        />
      </body>
    </html>
  );
}
