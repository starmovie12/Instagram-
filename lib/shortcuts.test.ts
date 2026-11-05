import { test } from "node:test";
import assert from "node:assert/strict";
import { chordStep, CHORD_WINDOW_MS } from "./shortcuts";

test("G then H/T/R/S within 1 s navigates (PRD §6.1, AC-67)", () => {
  for (const [k, route] of [["h", "/"], ["t", "/tools"], ["r", "/history"], ["s", "/settings"]] as const) {
    const armed = chordStep({ armedAt: null }, "g", 1000);
    assert.equal(armed.route, null);
    assert.equal(chordStep({ armedAt: armed.armedAt }, k, 1500).route, route);
  }
});

test("chord expires after the window and ignores unrelated keys", () => {
  assert.equal(chordStep({ armedAt: 0 }, "h", CHORD_WINDOW_MS + 1).route, null);
  assert.equal(chordStep({ armedAt: 0 }, "x", 10).route, null);
  assert.equal(chordStep({ armedAt: null }, "h", 10).route, null, "H alone does nothing");
  assert.equal(chordStep({ armedAt: 0 }, "G", 10).armedAt, 10, "uppercase G re-arms");
});
