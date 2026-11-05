import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { allPairs } from "./contrast-pairs";
import { buildModule } from "../scripts/gen-tokens";

const css = readFileSync(resolve(__dirname, "../app/tokens.css"), "utf8");

test("every text pair ≥ 4.5:1 and every UI pair ≥ 3:1 in light AND dark (PRD §3.2.1, AC-53/76)", () => {
  const pairs = allPairs(css);
  assert.ok(pairs.length >= 71, `expected at least 71 audited pairs, got ${pairs.length}`);
  const failing = pairs.filter((p) => !(p.ratio >= p.min));
  assert.deepEqual(
    failing.map((p) => `${p.theme}: ${p.fg} on ${p.bg} = ${p.ratio.toFixed(2)} (< ${p.min})`),
    [],
  );
});

test("both themes define the same semantic tokens (no theme silently falls back)", () => {
  const pairs = allPairs(css);
  const light = pairs.filter((p) => p.theme === "light").length;
  const dark = pairs.filter((p) => p.theme === "dark").length;
  assert.equal(light, dark);
});

test("lib/design-tokens.generated.ts is in sync with app/tokens.css (run `npm run tokens`)", () => {
  const onDisk = readFileSync(resolve(__dirname, "design-tokens.generated.ts"), "utf8");
  assert.equal(onDisk, buildModule(css));
});
