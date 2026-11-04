#!/usr/bin/env python3
"""Check whether a font family lists a Devanagari subset in the bundled Google Fonts snapshot.

Usage:
  python3 scripts/check_devanagari.py "Inter" "Roboto" "Poppins"
  python3 scripts/check_devanagari.py --suggest

The snapshot (data/google-fonts.csv) is point-in-time. A missing subset means "not listed in
the snapshot", not "proven absent": verify with the font's own documentation or a render test.
Exit code is 0 even if a family lacks Devanagari (this is information, not an error).
"""
import csv, os, sys, difflib

HERE = os.path.dirname(os.path.abspath(__file__))
CSV = os.path.join(HERE, '..', 'data', 'google-fonts.csv')

def load():
    with open(CSV, encoding='utf-8', newline='') as f:
        return {r['Family']: r for r in csv.DictReader(f)}

def main(argv):
    rows = load()
    if not argv or argv[0] in ('-h', '--help'):
        print(__doc__); return 0
    if argv[0] == '--suggest':
        fams = sorted(f for f, r in rows.items() if 'devanagari' in r['Subsets'])
        print(f'{len(fams)} families list a devanagari subset in the snapshot:')
        print(', '.join(fams)); return 0
    fallback = ['Noto Sans Devanagari', 'Hind', 'Mukta', 'Poppins']
    for name in argv:
        r = rows.get(name)
        if r is None:
            close = difflib.get_close_matches(name, rows.keys(), n=3, cutoff=0.6)
            print(f'{name}: NOT IN SNAPSHOT (close: {", ".join(close) or "none"}); coverage unverified')
            continue
        subs = [s.strip() for s in r['Subsets'].split('|')]
        if 'devanagari' in subs:
            print(f'{name}: devanagari subset LISTED (subsets: {", ".join(subs)})')
        else:
            print(f'{name}: devanagari subset NOT LISTED in snapshot (subsets: {", ".join(subs)}); '
                  f'add a Devanagari companion, e.g. {", ".join(fallback)}; verify by render test')
    return 0

if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
