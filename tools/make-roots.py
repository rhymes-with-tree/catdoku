"""Builds words/roots.json, Kitten Caboodle's roots (the mother cats) and the everyday words built on them (her kittens),
with Wiktionary's meanings as the clues.
Usage: download SCOWL (https://wordlist.aspell.net/, e.g. scowl-2020.12.07.tar.gz), then stream kaikki.org's copy of
English Wiktionary (about 3.4 GB; there's no need to save it) through this script:
       curl -sS https://kaikki.org/dictionary/English/kaikki.org-dictionary-English.jsonl \\
         | python3 tools/make-roots.py scowl-2020.12.07/final words/roots.json
(Wiktionary's own API refuses cloud sessions with 429, too many requests; kaikki.org has the same entries as JSON.)
Wiktionary's text is CC BY-SA 4.0 and SCOWL is (c) Kevin Atkinson; the notices are in words/ROOTS-LICENSE.txt and
words/WORDS-LICENSE.txt and must stay with the file.

The roots are Wiktionary's English prefixes, suffixes and combining forms with a meaning of their own ("time", "not",
"without"); endings that only make one part of speech from another ("forming adjectives from nouns") are left out.
Spellings of one root (chron-, chrono-) count as one, by the Greek or Latin word they come from (χρόνος).
A word is one of a root's kittens when Wiktionary builds it from the root in English ("tele- + -phone", or chron- +
-ic as it reads today), or when it comes from the root's own Greek or Latin word and its spelling has the root in it.
Only everyday words count (SCOWL sizes up to 50, American spelling, a-z, 4 letters or more); the most everyday
(sizes up to 20) are marked, and go first. The clue is the word's first meaning that isn't a form of another word,
old, rare or slang, and doesn't give the answer away."""
import glob, json, os, re, sys, unicodedata

MIN_WORDS, MAX_WORDS = 6, 16
AFFIX_POS = {"prefix", "suffix", "infix", "interfix", "affix", "combining_form"}
SKIP_TAGS = {"obsolete", "archaic", "rare", "dated", "slang", "vulgar", "derogatory", "offensive", "nonstandard",
             "dialectal", "form-of", "alt-of", "abbreviation", "initialism", "misspelling", "humorous", "euphemistic",
             "historical", "Internet", "ethnic", "slur", "nonce-word", "obsolete-form"}
ENGLISH_PARTS = ("af", "affix", "prefix", "pre", "suffix", "suf", "confix", "surf")
SOURCE_LANGS = {"grc", "la", "LL", "ML.", "NL.", "fr", "fro", "frm", "it", "ang", "enm", "gem-pro", "non"}
# Wiktionary puts many a suffix's meaning as how it's used ("Used to form nouns meaning fear of …"); the game shows
# just the meaning ("fear of …").
USED_TO = re.compile(r"^(used|added|appended|attached)( \w+){0,6}? (meaning|denoting|with the sense( of)?|indicating|"
                     r"that means|expressing)( (being|a|an|the))? ", re.I)


def tidy(g):
    t = USED_TO.sub("", g)
    return t[0].upper() + t[1:] if t else g


SLURS = set("""nigger nigga kike gook spic wop spaz honky wetback dago darkie darky jigaboo pickaninny gippo""".split())
# Words left out of a cat game for everyone: killing, illness and the body's private parts, sex, slurs about groups.
NOT_FOR_US = re.compile(r"sex|porn|cunni|orgas|erect|foreskin|cide$|abort|racis|fascis|nazi|rape|suicid|mastect|lobotom|"
                        r"diarrh|anorex|cocaine|heroin|narco|psycho|kill|murder|corpse|semen|penis|vagin|anal$|anus")
# Roots with no meaning of their own to guess from (linking letters, grammar), or whose words are all left out.
SKIP_ROOTS = set("-cide -a -o- -i- -u- -s -s- -os- -t -en -er -an -ie -ica".split())


def plain(w): return unicodedata.normalize("NFKD", w).encode("ascii", "ignore").decode()


def scowl_words(scowl, top):
    words = set()
    for f in glob.glob(os.path.join(scowl, "*-words.*")):
        name = os.path.basename(f); kind, size = name.split("-")[0], int(name.rsplit(".", 1)[1])
        if kind in ("english", "american") and "variant" not in name and size <= top:
            words |= {plain(w.strip()) for w in open(f, encoding="latin-1")}
    return {w for w in words if len(w) >= 4 and w.isascii() and w.isalpha() and w.islower() and w not in SLURS
            and not NOT_FOR_US.search(w)}


def english_parts(t):
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


def sources(e):
    """The words in other languages an entry comes from, as language:word (grc:χρόνος)."""
    out = []
    for t in e.get("etymology_templates", []):
        a = t.get("args", {})
        if t["name"] in ("der", "bor", "inh", "lbor", "uder", "ubor", "der+", "bor+", "inh+") and a.get("2") in SOURCE_LANGS:
            if a.get("3"): out.append(a["2"] + ":" + a["3"])
        elif t["name"] == "etymon":
            for m in re.finditer(r"(?:^|<|:)([a-zA-Z.-]+):([^<>:]+)", a.get("3", "")):
                if m.group(1) in SOURCE_LANGS: out.append(m.group(1) + ":" + m.group(2).strip())
    return out


def letters(root):
    """The root as it shows in a word: chrono- shows as chron, -logy as log."""
    r = root.strip("-")
    if root.endswith("-") and len(r) > 3 and r[-1] in "aeiou": r = r[:-1]
    if root.startswith("-") and len(r) > 3 and r[0] in "aeiou": r = r[1:]
    if root.startswith("-") and len(r) > 3 and r[-1] in "aeiouy": r = r[:-1]
    return r


def gloss(e, giveaway=None):
    """The entry's first everyday meaning; for a word, one that doesn't give the word away. (A root's meaning may
    be put as a form of another word: bio- is "combining form of life".)"""
    for s in e.get("senses", []):
        if set(s.get("tags", [])) - {"form-of"} & SKIP_TAGS or s.get("alt_of"): continue
        if giveaway and (s.get("form_of") or "form-of" in s.get("tags", [])): continue
        for g in s.get("glosses", [])[:1]:
            g = re.sub(r"\s+", " ", g).strip()
            low = g.lower()
            if not g or len(g) > 140 or low.startswith(("plural of", "alternative", "obsolete", "synonym of")): continue
            if giveaway and giveaway in low: continue
            return g
    return None


def main(scowl, out_path):
    everyday, familiar = scowl_words(scowl, 50), scowl_words(scowl, 20)
    affixes = {}        # root -> {meaning, from, sources}
    built = {}          # word -> English roots its etymology names
    word_src = {}       # word -> etymology text, for its Greek and Latin words
    clues = {}
    for line in sys.stdin:
        try: e = json.loads(line)
        except ValueError: continue
        w, pos = e.get("word", ""), e.get("pos", "")
        if pos in AFFIX_POS and (w.startswith("-") or w.endswith("-")):
            g = gloss(e)
            a = affixes.setdefault(w, {"meaning": None, "from": "", "sources": []})
            if g and not a["meaning"]: a["meaning"] = tidy(g); a["from"] = (e.get("etymology_text") or "").split("\n")[0][:200]
            a["sources"] += sources(e)
            continue
        if w not in everyday: continue
        for t in e.get("etymology_templates", []):
            if t.get("name") in ENGLISH_PARTS: built.setdefault(w, set()).update(english_parts(t))
        word_src[w] = word_src.get(w, "") + " " + (e.get("etymology_text") or "")
        if w not in clues:
            g = gloss(e, giveaway=w[:max(4, len(w) - 3)])
            if g: clues[w] = g
    # One root for every Greek or Latin word: chron- and chrono- are one mother cat.
    groups = {}
    for r, a in affixes.items():
        if not a["meaning"]: continue
        src = next((s for s in a["sources"] if s.split(":")[0] in ("grc", "la")), "")
        key = next((k for k in groups if k[0] == src and src and (letters(r).startswith(letters(k[1])) or letters(k[1]).startswith(letters(r)))), (src, r))
        groups.setdefault(key, []).append(r)
    roots = []
    for key, spellings in groups.items():
        if set(spellings) & SKIP_ROOTS: continue
        src, kits = key[0], set()
        shows = {letters(r) for r in spellings}
        # The root has to show in the word: anywhere for 4 letters or more, at the right end for fewer.
        def shows_in(w):
            for r in spellings:
                t = letters(r)
                if len(t) >= 4 and t in w: return True
                if r.endswith("-") and w.startswith(t) or r.startswith("-") and w.endswith(r.strip("-")): return True
            return False
        for w, parts in built.items():
            if parts & set(spellings) and shows_in(w): kits.add(w)
        lemma = src.split(":", 1)[1] if src else ""
        named = [re.compile(r"(?<![\w-])" + re.escape(r) + r"(?![\w-])") for r in spellings]
        for w, text in word_src.items():
            if not shows_in(w): continue
            if len(lemma) >= 4 and lemma in text or any(n.search(text) for n in named): kits.add(w)
        kits = sorted((w for w in kits if w in clues), key=lambda w: (w not in familiar, len(w), w))
        if len(kits) < MIN_WORDS: continue
        main_spelling = max(spellings, key=lambda r: (sum(letters(r) in w for w in kits), -len(r)))
        a = affixes[main_spelling]
        if not a["meaning"]: a = next(affixes[r] for r in spellings if affixes[r]["meaning"])
        roots.append({"root": main_spelling, "also": sorted(set(spellings) - {main_spelling}), "meaning": a["meaning"],
                      "from": a["from"], "familiar": sum(w in familiar for w in kits),
                      "words": [[w, clues[w], int(w in familiar)] for w in kits[:MAX_WORDS]]})
    roots.sort(key=lambda r: (-r["familiar"], r["root"]))
    json.dump(roots, open(out_path, "w"), ensure_ascii=False, indent=0)
    print(len(roots), "roots", file=sys.stderr)


if __name__ == "__main__":
    main(*sys.argv[1:3])
