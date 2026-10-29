"""Builds words/roots.json, Kitten Caboodle's roots (the mother cats) and the everyday words built on them (her kittens),
with Wiktionary's meanings as the clues.
Usage: stream kaikki.org's copy of English Wiktionary (about 3.4 GB; there's no need to save it) through this script:
       curl -sS https://kaikki.org/dictionary/English/kaikki.org-dictionary-English.jsonl \\
         | python3 tools/make-roots.py words/words.json words/long.json words/roots.json
(Wiktionary's own API refuses cloud sessions with 429, too many requests; kaikki.org has the same entries as JSON.)
Wiktionary's text is CC BY-SA 4.0; the notice is in words/ROOTS-LICENSE.txt and must stay with the file.
A word is one of a root's kittens when its Wiktionary etymology builds it from that root in English (the af, affix,
prefix, suffix and confix templates: "tele- + -phone"). Only the everyday words (familiar and common) of words.json
and long.json count, of 4 letters or more. The clue is the word's first meaning that isn't a form of another word,
old, rare or slang, and doesn't give the answer away (the word itself, or most of it, isn't in it).
A root makes the list with at least MIN_WORDS kittens, and keeps up to MAX_WORDS, the familiar words first."""
import json, re, sys

MIN_WORDS, MAX_WORDS = 6, 14
AFFIX_POS = {"prefix", "suffix", "infix", "interfix", "affix", "root", "combining_form"}
SKIP_TAGS = {"obsolete", "archaic", "rare", "dated", "slang", "vulgar", "derogatory", "offensive", "nonstandard",
             "dialectal", "form-of", "alt-of", "abbreviation", "initialism", "misspelling", "humorous", "euphemistic",
             "historical", "Internet", "ethnic", "slur"}
# Roots whose words don't make good puzzles: endings that only change a word's part of speech or number, and
# the ones that make a word anyone could guess from the clue alone.
SKIP_ROOTS = set("-s -es -ed -ing -er -est -ly -'s".split())


def words_of(path):
    d = json.load(open(path))
    return set(d["familiar"].split()), set(d["common"].split())


def affix_parts(t):
    """The English roots an etymology template builds a word from, written as Wiktionary heads them (tele-, -phone)."""
    a = t.get("args", {})
    if a.get("1") != "en": return []
    parts = [re.sub(r"<[^>]*>", "", a[k]).strip() for k in sorted((k for k in a if k.isdigit() and k != "1"), key=int)]
    parts = [p for p in parts if p]
    name = t["name"]
    if name in ("prefix", "pre") and parts: parts[0] = parts[0].rstrip("-") + "-"
    if name in ("suffix", "suf") and len(parts) > 1: parts[-1] = "-" + parts[-1].lstrip("-")
    if name == "confix" and len(parts) > 1:
        parts[0] = parts[0].rstrip("-") + "-"; parts[-1] = "-" + parts[-1].lstrip("-")
    return [p for p in parts if p.startswith("-") or p.endswith("-")]


def gloss(e, w):
    """The word's first everyday meaning, as long as it doesn't give the word away."""
    stem = w[:max(4, len(w) - 3)]
    for s in e.get("senses", []):
        if set(s.get("tags", [])) & SKIP_TAGS or s.get("form_of") or s.get("alt_of"): continue
        for g in s.get("glosses", [])[:1]:
            g = re.sub(r"\s+", " ", g).strip()
            if g and len(g) <= 140 and stem not in g.lower() and not g.lower().startswith(("plural of", "alternative")):
                return g
    return None


def main(words_path, long_path, out_path):
    fam, com = words_of(words_path)
    lf, lc = words_of(long_path)
    fam |= lf; com |= lc
    everyday = {w for w in fam | com if len(w) >= 4}
    affixes, kittens, clues = {}, {}, {}
    for line in sys.stdin:
        try: e = json.loads(line)
        except ValueError: continue
        w, pos = e.get("word", ""), e.get("pos", "")
        if pos in AFFIX_POS and (w.startswith("-") or w.endswith("-")) and w not in affixes:
            g = gloss(e, w.strip("-") + "@@@@")
            if g: affixes[w] = {"meaning": g, "from": (e.get("etymology_text") or "").split(". ")[0][:160]}
        if w not in everyday: continue
        for t in e.get("etymology_templates", []):
            if t.get("name") in ("af", "affix", "prefix", "pre", "suffix", "suf", "confix"):
                for p in affix_parts(t): kittens.setdefault(p, set()).add(w)
        if w not in clues:
            g = gloss(e, w)
            if g: clues[w] = g
    roots = []
    for r, ws in kittens.items():
        if r in SKIP_ROOTS or r not in affixes: continue
        ws = sorted((w for w in ws if w in clues), key=lambda w: (w not in fam, w))
        if len(ws) < MIN_WORDS: continue
        roots.append({"root": r, "meaning": affixes[r]["meaning"], "from": affixes[r]["from"],
                      "words": [[w, clues[w]] for w in ws[:MAX_WORDS]], "familiar": sum(w in fam for w in ws)})
    roots.sort(key=lambda r: (-r["familiar"], r["root"]))
    json.dump(roots, open(out_path, "w"), ensure_ascii=False, indent=0)
    print(len(roots), "roots", file=sys.stderr)


if __name__ == "__main__":
    main(*sys.argv[1:4])
