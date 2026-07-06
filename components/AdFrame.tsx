/** Ad Frame (§9.11) — every ad lives inside a labeled hairline frame with reserved height (CLS 0).
 *  Drop the Adsterra/Monetag script tag inside as children when you wire ads. */
export default function AdFrame({ slotH = 110, children }: { slotH?: number; children?: React.ReactNode }) {
  return (
    <div className="ad-frame" style={{ ["--slot-h" as string]: `${slotH}px` }}>
      {children}
    </div>
  );
}
