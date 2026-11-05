import { test } from "node:test";
import assert from "node:assert/strict";
import { timeAgo } from "./time";
import { retryAfterSeconds } from "./api";

const NOW = Date.UTC(2026, 10, 5, 12, 0, 0);

test("timeAgo picks the largest whole unit", () => {
  assert.equal(timeAgo(NOW - 2 * 3_600_000, "en", NOW), "2 hr. ago");
  assert.equal(timeAgo(NOW - 3 * 86_400_000, "en", NOW), "3 days ago");
  assert.equal(timeAgo(NOW - 5_000, "en", NOW), "now");
});

test("timeAgo falls back to English for an unknown locale tag", () => {
  assert.match(timeAgo(NOW - 60_000, "zz-invalid-@@", NOW), /min/);
});

test("retryAfterSeconds reads delta-seconds and HTTP dates, capped at 24 h", () => {
  assert.equal(retryAfterSeconds("30"), 30);
  assert.equal(retryAfterSeconds(null), undefined);
  assert.equal(retryAfterSeconds("nonsense"), undefined);
  assert.equal(retryAfterSeconds(new Date(NOW + 90_000).toUTCString(), NOW), 90);
  assert.equal(retryAfterSeconds("999999"), 86_400);
});
