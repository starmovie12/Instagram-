import { test } from "node:test";
import assert from "node:assert/strict";
import { translate, loadLocale, LANGS } from "./i18n";
import { HI } from "./i18n-hi";
import { REST } from "./i18n-rest";

test("English is inline and is the fallback before a locale loads", () => {
  assert.equal(translate("en", "ws.paste"), "Paste");
  assert.equal(translate("zz", "ws.paste"), "Paste");
});

test("loadLocale fetches the Hindi chunk once and translate switches over", async () => {
  await loadLocale("hi");
  assert.equal(translate("hi", "ws.paste"), HI["ws.paste"]);
  assert.equal(translate("hi", "res.views", { n: "1.2K" }), "1.2K व्यूज़");
});

test("every supported language except en/hi lives in the REST chunk", async () => {
  const codes = LANGS.map((l) => l.code).filter((c) => c !== "en" && c !== "hi").sort();
  assert.deepEqual(Object.keys(REST).sort(), codes);
  await loadLocale("de");
  assert.equal(translate("de", "language"), REST.de.language);
});

test("placeholders survive translation and unknown params stay visible", () => {
  assert.equal(translate("en", "ws.recent", { n: 3 }), "Recent (3)");
  assert.equal(translate("en", "ws.recent"), "Recent ({n})");
});
