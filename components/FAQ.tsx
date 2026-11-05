import { ChevronDown } from "lucide-react";
import { DEFAULT_FAQ, type QA } from "@/lib/seo";

export type { QA };

/**
 * FAQ — native <details>/<summary>: works without JS, keyboard + screen-reader friendly,
 * and every answer is in the server HTML (matches the FAQPage JSON-LD on the page).
 */
export default function FAQ({ items = DEFAULT_FAQ, title = "Frequently asked questions" }: { items?: QA[]; title?: string }) {
  return (
    <section id="faq" className="faq" aria-labelledby="faq-title">
      <h2 id="faq-title" className="faq__title">{title}</h2>
      <div className="faq__list">
        {items.map((item, i) => (
          <details key={i} className="faq__item">
            <summary className="faq__q">
              <span>{item.q}</span>
              <ChevronDown className="faq__chev" size={20} strokeWidth={2} aria-hidden="true" />
            </summary>
            <p className="faq__a">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
