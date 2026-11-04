#!/usr/bin/env python3
"""Validate the brain (master-prompt.xml) against the tool kit contract.

Usage: python3 scripts/validate_brain.py [path/to/brain.xml]
Default path: references/master-prompt.xml (the bundled copy).

Checks (mechanical only; this does NOT prove the prompt produces good designs):
  1. XML is well-formed, root is prompt_a, version and requires_toolkit are set.
  2. Toolkit version in TOOLKIT-INDEX.md matches requires_toolkit.
  3. Every [TOOLKIT: key] tag in the brain names a capability that exists in TOOLKIT-INDEX.md,
     and every file that capability lists exists on disk.
  4. The capability list written inside the brain equals the index's capability keys.
  5. The brain contains no tool-kit material (hex colours, BANK refs, copy-ledger word lists,
     style/pairing tables, recipe rows) and stays under a size cap.
  6. Internal cross references resolve (STEP 6.N, VETO N, named sections).
  7. Bundled brain copy equals the given brain file (if both exist).
  8. Every reference file path mentioned in SKILL.md exists.
  9. (rev 3) No stray Devanagari characters outside `backticks` in the Roman-Hinglish files
     (intentional Devanagari samples must be backticked).
 10. (rev 3) Every `TK-nn Section X` reference in the brain and references resolves to a heading.
 11. (rev 3) Every backticked *.md / *.py / *.csv file name in references exists in the kit.
 12. (rev 3) Every `contrast_check.py '#fg' '#bg'` example that quotes an `N:1` ratio matches the
     script's real result.
 13. (rev 3) Every L<n> tag (n >= 5) used anywhere is defined in the L-ID Legend (visual-craft.md);
     SKILL.md, TOOLKIT-INDEX.md and the brain agree on the `rev N` label.
"""
import hashlib, os, re, sys
import xml.etree.ElementTree as ET

HERE = os.path.dirname(os.path.abspath(__file__))
KIT = os.path.abspath(os.path.join(HERE, '..'))
REF = os.path.join(KIT, 'references')
SIZE_CAP = 100_000
fails, passes = [], []

def ok(msg): passes.append(msg); print('PASS', msg)
def bad(msg): fails.append(msg); print('FAIL', msg)
def check(cond, msg_ok, msg_bad):
    ok(msg_ok) if cond else bad(msg_bad)

def main(argv):
    path = argv[0] if argv else os.path.join(REF, 'master-prompt.xml')
    raw = open(path, encoding='utf-8').read()
    try:
        root = ET.fromstring(raw.encode('utf-8'))
    except ET.ParseError as e:
        bad(f'XML parse error: {e}'); return 1
    check(root.tag == 'prompt_a', 'root element is prompt_a', f'root is {root.tag}')
    ver = (root.findtext('header/version') or '').strip()
    req = (root.findtext('header/requires_toolkit') or '').strip()
    check(bool(ver) and bool(req), f'brain version {ver}, requires_toolkit {req}', 'version or requires_toolkit missing')

    # index
    idx_path = os.path.join(REF, 'TOOLKIT-INDEX.md')
    idx = open(idx_path, encoding='utf-8').read()
    m = re.search(r'toolkit_version:\s*(\S+)', idx)
    check(m and m.group(1) == req, f'toolkit_version matches requires_toolkit ({req})',
          f'toolkit_version {m.group(1) if m else None} != requires_toolkit {req}')
    caps = {}
    for line in idx.splitlines():
        mm = re.match(r'\|\s*`([a-z-]+)`\s*\|\s*(.+?)\s*\|', line)
        if mm:
            caps[mm.group(1)] = re.findall(r'`([^`]+)`', mm.group(2))
    check(len(caps) >= 10, f'{len(caps)} capabilities in index', 'index has too few capabilities')
    for k, files in caps.items():
        for f in files:
            if '*' in f:
                import glob
                good = bool(glob.glob(os.path.join(KIT, f if f.startswith(('data', 'scripts')) else 'references/' + f)))
            elif f.startswith(('scripts/', 'data/')):
                good = os.path.exists(os.path.join(KIT, f))
            else:
                good = os.path.exists(os.path.join(REF, f))
            check(good, f'capability {k}: {f} exists', f'capability {k}: {f} MISSING')

    # tags
    PLACEHOLDER_TAGS = {'naam', 'file'}  # used in format examples, not real capabilities
    tags = set(re.findall(r'\[TOOLKIT:\s*([a-z-]+)\]', raw)) - PLACEHOLDER_TAGS
    unknown = sorted(t for t in tags if t not in caps)
    check(not unknown, f'all {len(tags)} [TOOLKIT: key] tags resolve', f'unknown capability tags: {unknown}')
    unused = sorted(set(caps) - tags - {'examples', 'page-patterns', 'motion-charts', 'changelog'})
    if unused: print('NOTE capabilities never tagged in brain:', unused)

    # capability list inside brain
    mcap = re.search(r'Capability ke naam[^:]*:\s*([^.]+)\.', raw)
    if mcap:
        listed = {x.strip() for x in mcap.group(1).split(',')}
        check(listed == set(caps) - {'changelog'}, 'capability list in brain equals index keys',
              f'capability list mismatch: brain-only {sorted(listed - set(caps))}, index-only {sorted(set(caps) - listed - {"changelog"})}')
    else:
        bad('capability list not found in brain')

    # no tool-kit material in brain
    body = re.sub(r'<header>.*?</header>', '', raw, flags=re.S)
    check(not re.search(r'#[0-9A-Fa-f]{6}\b', body), 'no hex colours in brain', 'hex colour found in brain')
    check(not re.search(r'\bBANK [A-J]\b', body), 'no BANK references in brain', 'BANK reference found in brain')
    ledger = [w for w in ('Supercharge', 'Revolutionary', 'Seamless', 'Unlock') if w in body]
    check(len(ledger) < 3, 'no copy-ledger word list in brain', f'copy ledger words in brain: {ledger}')
    check('kaam ke liye =' not in body and 'mat lagao =' not in body, 'no style/recipe table rows in brain', 'table rows found in brain')
    check(not re.search(r'Inter \+ Inter|Playfair Display \+|Space Grotesk \+', body), 'no font pairing table in brain', 'font pairing found in brain')
    check(len(raw.encode('utf-8')) <= SIZE_CAP, f'brain size {len(raw.encode("utf-8"))} bytes <= {SIZE_CAP}', 'brain exceeds size cap')

    # cross references
    items = [(i.text or '').strip() for i in root.iter('item')]
    for n in sorted(set(re.findall(r'STEP 6\.(\d+)', raw)), key=int):
        check(any(t.startswith(f'6.{n} ') for t in items), f'STEP 6.{n} exists', f'STEP 6.{n} referenced but missing')
    veto_nums = [int(re.match(r'(\d+)\.', t).group(1)) for t in items if re.match(r'\d+\. Kya', t)]
    check(len(veto_nums) >= 25, f'VETO has {len(veto_nums)} questions', 'VETO list too short')
    for f in os.listdir(REF):
        if f.endswith('.md'):
            for n in re.findall(r'VETO (\d+)', open(os.path.join(REF, f), encoding='utf-8').read()):
                check(int(n) in veto_nums, f'{f}: VETO {n} exists', f'{f}: VETO {n} does not exist')
    names = [s.get('name', '') for s in root.findall('section')]
    for need in ('AAKAR', 'EVIDENCE', 'DIMAG AUR TOOL KIT', 'VISUAL CRAFT', '7 LOHE', 'SURAKSHA KI ZAMEEN', 'ZERO-TRUST PADHAI', 'VETO SOOCHI', 'Output ka order'):
        check(any(n.startswith(need) for n in names), f'section {need} present', f'section {need} missing')

    # bundled copy equality
    bundled = os.path.join(REF, 'master-prompt.xml')
    if os.path.exists(bundled) and os.path.abspath(bundled) != os.path.abspath(path):
        same = hashlib.sha256(open(bundled, 'rb').read()).hexdigest() == hashlib.sha256(open(path, 'rb').read()).hexdigest()
        check(same, 'bundled brain copy identical to given brain', 'bundled brain copy DIFFERS from given brain')

    # SKILL.md refs
    sk = os.path.join(KIT, 'SKILL.md')
    if os.path.exists(sk):
        t = open(sk, encoding='utf-8').read()
        for f in sorted(set(re.findall(r'`((?:references|scripts|data)/[A-Za-z0-9_./*-]+)`', t))):
            if '*' in f or f.endswith('/'): continue
            check(os.path.exists(os.path.join(KIT, f)), f'SKILL.md ref {f} exists', f'SKILL.md ref {f} MISSING')

    extra_checks(raw, caps, root)

    print(f'\n{len(passes)} passed, {len(fails)} failed')
    return 1 if fails else 0

# ---------------------------------------------------------------- rev 3 checks
def _ref_files():
    out = [os.path.join(REF, f) for f in sorted(os.listdir(REF)) if f.endswith(('.md', '.xml'))]
    sk = os.path.join(KIT, 'SKILL.md')
    if os.path.exists(sk): out.append(sk)
    return out

def extra_checks(raw, caps, root):
    import importlib.util
    files = _ref_files()
    texts = {f: open(f, encoding='utf-8').read() for f in files}
    texts_brain = {f: (raw if f.endswith('master-prompt.xml') else t) for f, t in texts.items()}
    names = {f: os.path.relpath(f, KIT) for f in files}

    # 9. stray Devanagari outside backticks
    dev = re.compile(r'[\u0900-\u097F]+')
    stray = []
    for f, t in texts_brain.items():
        for i, line in enumerate(t.splitlines(), 1):
            bare = re.sub(r'`[^`]*`', '', line)
            m = dev.findall(bare)
            if m: stray.append(f'{names[f]}:{i} {m[:3]}')
    check(not stray, 'no stray Devanagari outside backticks', f'stray Devanagari: {stray[:8]}')

    # 10. TK-nn Section X references resolve
    tk_files = {}
    idx = open(os.path.join(REF, 'TOOLKIT-INDEX.md'), encoding='utf-8').read()
    for line in idx.splitlines():
        mm = re.match(r'\|\s*`[a-z-]+`\s*\|\s*(.+?)\s*\|\s*(TK-\d\d)\s*\|', line)
        if mm:
            tk_files[mm.group(2)] = [f for f in re.findall(r'`([^`]+\.md)`', mm.group(1)) if '/' not in f]
    def headings(tk):
        hs = []
        for fn in tk_files.get(tk, []):
            p = os.path.join(REF, fn)
            if os.path.exists(p):
                hs += re.findall(r'^#{2,4}\s+([A-F0-9]+)\.', open(p, encoding='utf-8').read(), flags=re.M)
        return hs
    pat = re.compile(r'(TK-\d\d) Sections? ([A-F]\.\d|[A-F]|\d)(?:\s*(?:&amp;|&)\s*([A-F]))?')
    bad_refs, n_refs = [], 0
    for f, t in texts_brain.items():
        for m in pat.finditer(t):
            tk = m.group(1)
            if not headings(tk):
                continue  # capability has no lettered/numbered sections (e.g. TK-01)
            secs = [m.group(2), m.group(3)]
            for s in [x for x in secs if x]:
                n_refs += 1
                top, _, sub = s.partition('.')
                hs = headings(tk)
                if top not in hs: bad_refs.append(f'{names[f]}: {tk} Section {s}')
                elif sub and sub not in hs: bad_refs.append(f'{names[f]}: {tk} Section {s}')
    check(not bad_refs, f'{n_refs} TK-nn Section refs resolve', f'unresolved section refs: {bad_refs[:8]}')

    # 11. backticked file names exist
    allow = {'MASTER.md'}  # generated by the engine at run time
    missing = []
    all_names = set()
    for dp, _, fs in os.walk(KIT):
        for fn in fs: all_names.add(fn)
    for f, t in texts_brain.items():
        for fn in re.findall(r'`([A-Za-z0-9_./-]+\.(?:md|py|csv))`', t):
            base = os.path.basename(fn)
            if base in allow or '<' in fn: continue
            if base not in all_names: missing.append(f'{names[f]}: {fn}')
    check(not missing, 'every backticked file name exists in the kit', f'dangling file refs: {missing[:8]}')

    # 12. contrast examples match the real script
    spec = importlib.util.spec_from_file_location('contrast_check', os.path.join(HERE, 'contrast_check.py'))
    cc = importlib.util.module_from_spec(spec); spec.loader.exec_module(cc)
    cpat = re.compile(r"(\d+(?:\.\d+)?):1[^\n]{0,160}?contrast_check\.py\s+['\"](#[0-9A-Fa-f]{3,6})['\"]\s+['\"](#[0-9A-Fa-f]{3,6})['\"]")
    wrong, n_c = [], 0
    for f, t in texts_brain.items():
        for m in cpat.finditer(t):
            n_c += 1
            claimed = m.group(1); dec = len(claimed.split('.')[1]) if '.' in claimed else 0
            real = round(cc.ratio(m.group(2), m.group(3)), dec)
            if abs(real - float(claimed)) > 10 ** (-dec) / 2 + 1e-9:
                wrong.append(f'{names[f]}: claims {claimed}:1 for {m.group(2)} on {m.group(3)}, real {real}:1')
    check(not wrong, f'{n_c} contrast example(s) match contrast_check.py', f'wrong contrast example: {wrong}')

    # 13a. L-ID legend
    vc = texts[os.path.join(REF, 'visual-craft.md')]
    legend = vc.split('### L-ID Legend')[1].split('\n## ')[0] if '### L-ID Legend' in vc else ''
    defined = set(re.findall(r'`L(\d+)`', legend))
    used = set()
    for f, t in texts_brain.items():
        if f.endswith('CHANGELOG.md'): continue
        used |= {n for n in re.findall(r'\bL(\d+)\b', t) if int(n) >= 5}
    undefined = sorted(used - defined, key=int)
    check(bool(legend) and not undefined, f'all {len(used)} L-ID tags (L>=5) defined in legend',
          f'L-ID tags without legend entry: {undefined}')

    # 13b. rev label agreement
    revs = {}
    for label, text in (('SKILL.md', texts[os.path.join(KIT, 'SKILL.md')]),
                        ('TOOLKIT-INDEX.md', idx),
                        ('brain role_in_system', root.findtext('header/role_in_system') or '')):
        m = re.search(r'v18 rev (\d+)', text)
        revs[label] = m.group(1) if m else None
    check(len(set(revs.values())) == 1 and None not in revs.values(), f'rev label agrees everywhere {revs}',
          f'rev label mismatch {revs}')

if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
