"use client";
/**
 * Lightweight client-side i18n for the interactive tool UI (PRD roadmap:
 * multi-language support — competitors' biggest traffic is non-English).
 * SEO prose stays English-first by design; these strings cover the golden
 * bar, result card, errors and username tools. Missing keys fall back to
 * English, so partial translations never break the UI.
 */
import { createContext, useContext, useEffect, useState } from "react";

import { LANGS, RTL_LANGS } from "./locales";
export { LANGS, RTL_LANGS };

export type Locale = (typeof LANGS)[number]["code"];

type Keys =
  | "linkPlaceholder" | "userPlaceholder"
  | "download" | "fetching" | "paste" | "search" | "view"
  | "invalidLink" | "trust"
  | "errPrivateT" | "errPrivateB" | "errInvalidT" | "errInvalidB"
  | "errDownT" | "errDownB" | "errRateT" | "errRateB"
  | "errStoryT" | "errStoryB" | "errNotFoundT" | "errNotFoundB"
  | "errOfflineT" | "errOfflineB"
  | "dlLabel" | "caption" | "hashtags" | "mentions" | "slides"
  | "copy" | "copied" | "copyAll" | "thumbnail" | "audio"
  | "activeStories" | "dpDownload" | "cover" | "loadStories" | "bio"
  | "highlights" | "language"
  | "posts" | "followers" | "following" | "recentPosts" | "pinned" | "noPosts"
  | "smartPlaceholder" | "downloadAllZip" | "resolving" | "copyLink"
  | "boundary.title" | "boundary.body" | "boundary.retry" | "boundary.home" | "boundary.code" | "loading"
  | "nav.primary" | "nav.home" | "nav.tools" | "nav.history" | "nav.settings" | "nav.back" | "theme.toggle" | "theme.dark" | "theme.light" | "offline.pill" | "offline.back" | "sheet.close" | "toast.dismiss" | "shortcuts.title" | "shortcuts.search" | "shortcuts.goto"
  | "skip.content"
  | "router.chip.detected" | "router.chip.cancel" | "router.err.empty" | "router.err.notlink" | "router.err.unsupported" | "router.err.request" | "router.err.self" | "router.err.scheme" | "router.err.incomplete" | "router.err.fbStory" | "router.hint.longpress" | "router.notice.extra" | "router.notice.first" | "router.notice.capped" | "router.soon.title" | "router.soon.body" | "router.soon.cta" | "router.batch" | "app.banner.youtube" | "app.err.private" | "home.placeholder" | "home.inputLabel" | "home.paste" | "home.grab" | "home.clear" | "home.howto" | "home.tools" | "home.viewAll" | "home.allTools" | "home.allToolsSub" | "home.drop" | "home.howtoCopy" | "home.howtoStep1" | "home.howtoStep2" | "home.howtoStep3" | "platform.tag.instagram" | "platform.tag.facebook" | "platform.tag.youtube" | "platform.tag.tiktok" | "platform.tag.pinterest" | "platform.tag.x" | "platform.tag.threads"
  | "tools.title" | "tools.count" | "tools.search" | "tools.searchLabel" | "tools.clear" | "tools.cats" | "tools.more" | "tools.moreTitle" | "tools.recent" | "tools.apps" | "tools.tod" | "tools.empty" | "tools.emptyBody" | "tools.request" | "tools.results" | "cat.popular" | "cat.all" | "cat.downloaders" | "cat.ai" | "cat.analytics" | "cat.visual" | "cat.utilities" | "cat.fun"
  | "ws.paste" | "ws.download" | "ws.fetching" | "ws.inputLabel" | "ws.types" | "ws.more" | "ws.moreTitle" | "ws.autoSelected" | "ws.detected" | "ws.change" | "ws.recent" | "ws.recentTitle" | "ws.regrab" | "ws.delete" | "ws.removed" | "ws.undo" | "ws.redirect" | "ws.mismatch" | "ws.mismatchGo" | "ws.kindMismatch" | "ws.switchTo" | "ws.useAuto" | "ws.wrongLink" | "ws.findOn" | "ws.extra" | "ws.started" | "ws.ready" | "ws.offline" | "ws.offlineRetry" | "ws.offlineCancel" | "ws.offlineHistory" | "ws.hintTitle" | "ws.hint1" | "ws.hint2" | "ws.hint3" | "res.ready" | "res.downloadHd" | "res.downloadAll" | "res.downloadItem" | "res.dp" | "res.quality" | "res.qualityTitle" | "res.more" | "res.thumb" | "res.audio" | "res.share" | "res.caption" | "res.copyCaption" | "res.copyTags" | "res.copied" | "res.readMore" | "res.readLess" | "res.mentions" | "res.another" | "res.packing" | "res.zipFailed" | "res.iosHint" | "res.views" | "res.likes" | "err.private.t" | "err.private.b" | "err.invalid.t" | "err.invalid.b" | "err.rate.t" | "err.rate.b" | "err.story.t" | "err.story.b" | "err.down.t" | "err.down.b" | "err.notfound.t" | "err.notfound.b" | "err.banned.t" | "err.banned.b" | "err.contact" | "err.pasteAnother" | "err.retry" | "err.viewProfile"
  | "ws.ph.story" | "ws.ph.profile" | "ws.ph.highlights" | "ws.ph.audio" | "ws.features" | "ws.result" | "ws.loading" | "res.tooBig" | "res.verified" | "res.itemAlt" | "res.dpAlt" | "res.followers" | "res.following" | "res.posts" | "res.saved" | "pe.stories" | "pe.highlights" | "pe.noHighlights" | "pe.nothing" | "pe.highlight" | "pe.storyAlt" | "pe.label"
  | "err.retryIn" | "err.offline.t";

export type Dict = Partial<Record<Keys, string>>;

const EN: Record<Keys, string> = {
  linkPlaceholder: "Paste an Instagram link — reel, post, story…",
  userPlaceholder: "Enter @username or profile URL",
  download: "Download", fetching: "Fetching…", paste: "Paste", search: "Search", view: "View",
  invalidLink: "That doesn't look like an Instagram link. Paste one like instagram.com/reel/…",
  trust: "No login · Public content only · Links are never stored",
  errPrivateT: "This account is private.", errPrivateB: "InstaGrab fetches public content only.",
  errInvalidT: "That's not an Instagram link.", errInvalidB: "Paste one like instagram.com/reel/…",
  errDownT: "Instagram changed something on their side.", errDownB: "We're patching it — usually done within hours. Try again soon.",
  errRateT: "Too many requests.", errRateB: "Wait a minute, then try again.",
  errStoryT: "This story has expired or doesn't exist.", errStoryB: "Stories vanish after 24 hours.",
  errNotFoundT: "This post doesn't exist.", errNotFoundB: "Check the link and try again.",
  errOfflineT: "You're offline.", errOfflineB: "Reconnect and try again.",
  dlLabel: "Download", caption: "Caption", hashtags: "Hashtags", mentions: "Mentions", slides: "Slides",
  copy: "Copy", copied: "Copied", copyAll: "Copy all", thumbnail: "Thumbnail JPG", audio: "Audio M4A",
  activeStories: "active stories", dpDownload: "Download HD profile picture", cover: "Cover",
  loadStories: "Load stories", bio: "Bio", highlights: "highlights", language: "Language",
  posts: "posts", followers: "followers", following: "following",
  recentPosts: "Recent posts", pinned: "Pinned", noPosts: "No public posts to show.",
  smartPlaceholder: "Paste a link or @username — reel, post, story, profile…",
  downloadAllZip: "Download all (ZIP)", resolving: "Reading…", copyLink: "Copy link",
  "boundary.title": "This page didn't load",
  "boundary.body": "A hiccup on our side or your connection. Your history and settings are safe.",
  "boundary.retry": "Try again",
  "boundary.home": "Go to Home",
  "boundary.code": "Reference",
  loading: "Loading",
  "nav.primary": "Primary",
  "nav.home": "Home",
  "nav.tools": "Tools",
  "nav.history": "History",
  "nav.settings": "Settings",
  "nav.back": "Back",
  "theme.toggle": "Toggle theme",
  "theme.dark": "Dark mode",
  "theme.light": "Light mode",
  "offline.pill": "Offline",
  "offline.back": "Back online",
  "sheet.close": "Close",
  "toast.dismiss": "Dismiss",
  "shortcuts.title": "Keyboard shortcuts",
  "shortcuts.search": "Search tools",
  "shortcuts.goto": "Go to Home / Tools / History / Settings",
  "skip.content": "Skip to content",
  "router.chip.detected": "✓ {app} {kind} recognised · Opening…",
  "router.chip.cancel": "Cancel",
  "router.err.empty": "Enter a link or @username",
  "router.err.notlink": "This doesn't look like a link — paste a post or reel link",
  "router.err.unsupported": "This link isn't supported yet",
  "router.err.request": "Request this app",
  "router.err.self": "This is a link to our own site",
  "router.err.scheme": "This link isn't valid",
  "router.err.incomplete": "This link looks incomplete — paste the full post, reel or @username link",
  "router.err.fbStory": "Facebook Stories and Albums aren't supported yet — paste a video, reel or photo link",
  "router.hint.longpress": "Long-press the box → Paste",
  "router.notice.extra": "{n} more links found — paste them separately",
  "router.notice.first": "Opened the first link; paste the others separately",
  "router.notice.capped": "Took the first 20 links",
  "router.soon.title": "{app} support is coming soon",
  "router.soon.body": "Right now we work with these apps:",
  "router.soon.cta": "Tell us to prioritise this app",
  "router.batch": "{n} Instagram links recognised · Opening batch…",
  "app.banner.youtube": "YouTube video download isn't available — here's the thumbnail",
  "app.err.private": "This account is private — only public content can be downloaded",
  "home.placeholder": "Paste Instagram, Facebook, or any link…",
  "home.inputLabel": "Paste a link or @username",
  "home.paste": "Paste Link",
  "home.grab": "Grab Media",
  "home.clear": "Clear",
  "home.howto": "How to Download",
  "home.tools": "Tools & Platforms",
  "home.viewAll": "View All",
  "home.allTools": "All Tools",
  "home.allToolsSub": "Everything in one place",
  "home.drop": "Drop the link to open it",
  "home.howtoCopy": "How to copy a link?",
  "home.howtoStep1": "Open the post, reel or video in the app.",
  "home.howtoStep2": "Tap Share → Copy link.",
  "home.howtoStep3": "Come back here and tap Paste Link.",
  "platform.tag.instagram": "Reels · Stories · Photos",
  "platform.tag.facebook": "Videos · Reels",
  "platform.tag.youtube": "Thumbnails",
  "platform.tag.tiktok": "Videos",
  "platform.tag.pinterest": "Images · Videos",
  "platform.tag.x": "Videos · Photos",
  "platform.tag.threads": "Posts · Media",
  "tools.title": "All Tools",
  "tools.count": "{n} tools",
  "tools.search": "Search {n} tools…",
  "tools.searchLabel": "Search tools",
  "tools.clear": "Clear search",
  "tools.cats": "Categories",
  "tools.more": "+{n} More",
  "tools.moreTitle": "More categories",
  "tools.recent": "Recently used",
  "tools.apps": "Apps",
  "tools.tod": "Tool of the day",
  "tools.empty": "Nothing found",
  "tools.emptyBody": "No tool matches “{q}”.",
  "tools.request": "Request a tool",
  "tools.results": "{n} results",
  "cat.popular": "Popular",
  "cat.all": "All",
  "cat.downloaders": "Downloaders",
  "cat.ai": "AI & Creator",
  "cat.analytics": "Analytics",
  "cat.visual": "Visual Studio",
  "cat.utilities": "Utilities",
  "cat.fun": "Fun",
  "ws.paste": "Paste",
  "ws.download": "Download",
  "ws.fetching": "Fetching…",
  "ws.inputLabel": "{app} link",
  "ws.types": "Download type",
  "ws.more": "+{n} More",
  "ws.moreTitle": "More types",
  "ws.autoSelected": "Auto-selected",
  "ws.detected": "{what} recognised",
  "ws.change": "Change?",
  "ws.recent": "Recent ({n})",
  "ws.recentTitle": "Recent {app} grabs",
  "ws.regrab": "Grab again",
  "ws.delete": "Delete",
  "ws.removed": "Removed from history",
  "ws.undo": "Undo",
  "ws.redirect": "{app} link found — opening the {app} page",
  "ws.mismatch": "This is a {app} link.",
  "ws.mismatchGo": "Open {app}",
  "ws.kindMismatch": "This looks like a {kind} link.",
  "ws.switchTo": "Switch to {kind}",
  "ws.useAuto": "Use Auto",
  "ws.wrongLink": "This doesn't look like a {app} link — paste the right one",
  "ws.findOn": "Look for @{user} on",
  "ws.extra": "{n} more links found — paste them separately",
  "ws.started": "Download started ✓",
  "ws.ready": "This media is ready below",
  "ws.offline": "You seem to be offline — the link is queued and will download when you're back online",
  "ws.offlineRetry": "Try again now",
  "ws.offlineCancel": "Cancel",
  "ws.offlineHistory": "Open History",
  "ws.hintTitle": "Your download appears here",
  "ws.hint1": "Copy the link in the {app} app (Share → Copy link)",
  "ws.hint2": "Paste it above — the type is detected for you",
  "ws.hint3": "Save the file in original quality",
  "res.ready": "Result ready",
  "res.downloadHd": "Download HD",
  "res.downloadAll": "Download All (ZIP · {n})",
  "res.downloadItem": "Download {n}",
  "res.dp": "Download HD DP",
  "res.quality": "Quality: {q}",
  "res.qualityTitle": "Choose quality",
  "res.more": "More",
  "res.thumb": "Save Thumbnail",
  "res.audio": "Download Audio",
  "res.share": "Save to Photos",
  "res.caption": "Caption",
  "res.copyCaption": "Copy Caption",
  "res.copyTags": "Copy Hashtags",
  "res.copied": "Copied ✓",
  "res.readMore": "Read more",
  "res.readLess": "Show less",
  "res.mentions": "Mentions",
  "res.another": "Download another",
  "res.packing": "Packing {p}%…",
  "res.zipFailed": "ZIP failed — save the files one by one",
  "res.iosHint": "On iPhone/iPad tap Download once to save.",
  "res.views": "{n} views",
  "res.likes": "{n} likes",
  "err.private.t": "This account is private",
  "err.private.b": "Only public content can be downloaded.",
  "err.invalid.t": "This link didn't work",
  "err.invalid.b": "Copy the link again with Share → Copy link and paste it here.",
  "err.rate.t": "Too many requests right now",
  "err.rate.b": "Wait a moment — the button unlocks by itself.",
  "err.story.t": "This story is gone",
  "err.story.b": "Stories disappear after 24 hours, or the link changed.",
  "err.down.t": "{app} didn't answer",
  "err.down.b": "Their servers are busy or changed something. Try again in a moment.",
  "err.notfound.t": "Nothing to download here",
  "err.notfound.b": "The post may be deleted or not public.",
  "err.banned.t": "Temporarily blocked",
  "err.banned.b": "Unusual traffic from your network. This lifts automatically within {h} h.",
  "err.contact": "Contact us",
  "err.pasteAnother": "Paste another link",
  "err.retry": "Try again",
  "err.viewProfile": "See @{user}'s profile",
  "ws.ph.story": "Paste a Story link or @username…",
  "ws.ph.profile": "Enter @username or profile link…",
  "ws.ph.highlights": "Paste a Highlights link or @username…",
  "ws.ph.audio": "Paste a Reel link to get its audio…",
  "ws.features": "Features",
  "ws.result": "Result",
  "ws.loading": "Fetching media…",
  "res.tooBig": "Larger than 150 MB — save the files one by one below",
  "res.verified": "Verified",
  "res.itemAlt": "{app} media {n}",
  "res.dpAlt": "@{user} profile picture",
  "res.followers": "Followers",
  "res.following": "Following",
  "res.posts": "Posts",
  "res.saved": "Saved ✓",
  "pe.stories": "Stories",
  "pe.highlights": "Highlights",
  "pe.noHighlights": "No highlights found.",
  "pe.nothing": "Nothing found.",
  "pe.highlight": "Highlight",
  "pe.storyAlt": "Story {n}",
  "pe.label": "More from this profile",
  "err.retryIn": "Try again in {s}s",
  "err.offline.t": "You're offline",
};


const CODES = new Set<string>(LANGS.map((l) => l.code));

/* Locale dictionaries are lazy chunks (PRD §22.1 budget): EN ships inline as the fallback,
   Hindi and the other 19 load on demand the first time that language is chosen. */
const LOADED: Partial<Record<Locale, Dict>> = { en: EN };
const inflight = new Map<string, Promise<void>>();

/** Load a locale dictionary once; resolves immediately for English / already-loaded locales. */
export function loadLocale(lang: string): Promise<void> {
  if (!CODES.has(lang) || LOADED[lang as Locale]) return Promise.resolve();
  const key = lang === "hi" ? "hi" : "rest";
  let p = inflight.get(key);
  if (!p) {
    p = (key === "hi"
      ? import("./i18n-hi").then((m) => { LOADED.hi = m.HI; })
      : import("./i18n-rest").then((m) => { for (const [code, d] of Object.entries(m.REST)) LOADED[code as Locale] = d; })
    ).catch(() => { inflight.delete(key); });
    inflight.set(key, p);
  }
  return p;
}

export type I18nKey = Keys;
export type I18nParams = Record<string, string | number>;

/**
 * Translate outside React (e.g. app/global-error.tsx, which renders without providers).
 * @param lang    locale code; unknown codes fall back to English
 * @param k       message key
 * @param params  `{name}` placeholders — never concatenate translated strings
 */
export function translate(lang: string, k: Keys, params?: I18nParams): string {
  const raw = (CODES.has(lang) ? LOADED[lang as Locale]?.[k] : undefined) ?? EN[k];
  return params ? raw.replace(/\{(\w+)\}/g, (m, name: string) => (params[name] !== undefined ? String(params[name]) : m)) : raw;
}

type I18n = { lang: Locale; setLang: (l: Locale) => void; t: (k: Keys, params?: I18nParams) => string };
const Ctx = createContext<I18n>({ lang: "en", setLang: () => {}, t: (k, p) => translate("en", k, p) });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Locale>("en");

  /** Switch only once the dictionary is in memory — no English flash mid-switch. */
  const apply = (l: Locale) => { void loadLocale(l).then(() => setLangState(l)); };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ig-lang");
      if (stored && CODES.has(stored)) {
        apply(stored as Locale);
      } else {
        const nav = navigator.language?.slice(0, 2).toLowerCase();
        if (nav && nav !== "en" && CODES.has(nav)) apply(nav as Locale);
      }
    } catch { /* default en */ }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function setLang(l: Locale) {
    apply(l);
    try { localStorage.setItem("ig-lang", l); } catch {}
  }

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = (RTL_LANGS as readonly string[]).includes(lang) ? "rtl" : "ltr"; // PRD A15
  }, [lang]);

  const t = (k: Keys, params?: I18nParams) => translate(lang, k, params);

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n(): I18n {
  return useContext(Ctx);
}
