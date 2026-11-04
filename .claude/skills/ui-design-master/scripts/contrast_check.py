#!/usr/bin/env python3
"""WCAG contrast ratio for colour pairs.

Usage:
  python3 scripts/contrast_check.py "#1A1A1A" "#FFFFFF"
  python3 scripts/contrast_check.py "#FFFFFF@0.72" "#0B0B0F"      # fg with alpha over bg
  python3 scripts/contrast_check.py --pairs "#111 #fff" "#777 #fff"

Prints the ratio and whether it meets 4.5:1 (normal text), 3:1 (large text / UI), 7:1 (AAA).
Thresholds are point-in-time WCAG 2.x values; re-verify against the current standard.
"""
import re, sys

def parse(h):
    alpha = 1.0
    if '@' in h:
        h, a = h.split('@', 1); alpha = float(a)
    h = h.strip().lstrip('#')
    if len(h) == 3: h = ''.join(c * 2 for c in h)
    if not re.fullmatch(r'[0-9a-fA-F]{6}', h): raise ValueError(f'bad colour: {h!r}')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4)), alpha

def lin(c):
    c = c / 255
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

def lum(rgb): return 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2])

def ratio(fg, bg):
    (f, a), (b, _) = parse(fg), parse(bg)
    comp = tuple(round(f[i] * a + b[i] * (1 - a)) for i in range(3))
    l1, l2 = lum(comp), lum(b)
    hi, lo = max(l1, l2), min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)

def report(fg, bg):
    r = ratio(fg, bg)
    print(f'{fg} on {bg}: {r:.2f}:1  text 4.5:1 {"PASS" if r >= 4.5 else "FAIL"} | '
          f'large/UI 3:1 {"PASS" if r >= 3 else "FAIL"} | AAA 7:1 {"PASS" if r >= 7 else "FAIL"}')
    return r

def main(a):
    if not a or a[0] in ('-h', '--help'): print(__doc__); return 0
    if a[0] == '--pairs':
        for p in a[1:]:
            fg, bg = p.split(); report(fg, bg)
        return 0
    if len(a) != 2: print('need exactly two colours'); return 2
    report(a[0], a[1]); return 0

if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
