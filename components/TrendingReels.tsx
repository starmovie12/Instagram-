import { PlayIcon } from "./Icons";

/** Decorative animated marquee of trending reels (pure-CSS scroll). */
const REELS = [
  { user: "@nehal.jawed", title: "Dance Vibes", views: "2.3M", grad: "linear-gradient(160deg,#B98BD6,#E8A0C0 55%,#F2D2A0)" },
  { user: "@supercars.daily", title: "Luxury Life", views: "5.7M", grad: "linear-gradient(160deg,#3A3632,#6B5B3E 60%,#C9A75C)" },
  { user: "@travel.nature", title: "Paradise Found", views: "3.1M", grad: "linear-gradient(160deg,#7FB6C9,#A8D8CF 55%,#F0E3B8)" },
  { user: "@fashionista", title: "OOTD Goals", views: "1.8M", grad: "linear-gradient(160deg,#D9A845,#F0D08A 55%,#B8862F)" },
  { user: "@foodie.diaries", title: "Sweet Cravings", views: "4.2M", grad: "linear-gradient(160deg,#C97B5B,#E8B48A 55%,#F5E3C2)" },
  { user: "@luxury.vibes", title: "Golden Hour", views: "5.3M", grad: "linear-gradient(160deg,#8A6A32,#D9B45E 55%,#F5E8C8)" },
];

function ReelCard({ reel }: { reel: (typeof REELS)[number] }) {
  return (
    <div className="reel">
      <span className="glow" />
      <div className="art" style={{ background: reel.grad }}>
        <span className="play"><span><PlayIcon /></span></span>
        <span className="meta">
          <b>{reel.user}</b>
          <span>{reel.title}</span>
          <span className="views"><PlayIcon size={10} fill="#F0DCA8" />{reel.views}</span>
        </span>
      </div>
    </div>
  );
}

export default function TrendingReels() {
  return (
    <section id="trending" className="trending reveal">
      <div className="sect-head">
        <h2>Trending <span className="serif gold-text">right now.</span></h2>
        <span className="live"><span className="dot" /> LIVE</span>
      </div>
      <div className="marquee">
        <div className="mtrack">
          <div className="mgroup">{REELS.map((r) => <ReelCard key={r.user} reel={r} />)}</div>
          <div className="mgroup" aria-hidden="true">{REELS.map((r) => <ReelCard key={r.user + "2"} reel={r} />)}</div>
        </div>
      </div>
    </section>
  );
}
