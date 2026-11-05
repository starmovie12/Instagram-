/**
 * Route transition skeleton (PRD PU-1: content-matched, no spinner wall).
 * Static pages are prerendered, so this only shows while a dynamic segment or
 * a slow client navigation is pending. Shimmer is static under reduced motion.
 */
export default function Loading() {
  return (
    <main className="route-skel" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      <div className="route-skel__hero skel" />
      <div className="route-skel__line skel" />
      <div className="route-skel__line route-skel__line--short skel" />
      <div className="route-skel__grid">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="route-skel__tile">
            <span className="route-skel__icon skel" />
            <span className="route-skel__label skel" />
          </div>
        ))}
      </div>
    </main>
  );
}
