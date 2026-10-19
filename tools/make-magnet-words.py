"""Builds magnets/words.json, Fridge Magnets' word list: everyday words only, the only words that count on the
board and when checking a fridge has just one answer.
Usage: python3 tools/make-magnet-words.py scowl-2020.12.07/final magnets/words.json
The words: words/words.json's familiar list (3 to 10 letters); those words with an ending (-s, -es, -ed, -ing,
-ly) where SCOWL counts the longer word as very common too (size 20 or below, American
spelling); and the everyday two-letter words
below. Keyboard Cat's rules (tools/make-words.py)
leave out slurs and swear words."""
import json, sys, os, importlib.util
here = os.path.dirname(__file__)
spec = importlib.util.spec_from_file_location("kc", os.path.join(here, "make-words.py"))
kc = importlib.util.module_from_spec(spec)
try: spec.loader.exec_module(kc)
except ImportError: pass
scowl, out = sys.argv[1:3]
TWO = set("am an as at be by do go he hi if in is it me my no of oh ok on or ox so to up us we".split())
def ok(w): return 2 <= len(w) <= 10 and w.isascii() and w.isalpha() and w.islower() and w not in kc.BLOCK and w not in kc.NOT_ANSWERS
familiar = {w for w in json.load(open(os.path.join(here, "..", "words", "words.json")))["familiar"].split() if ok(w)}
# SCOWL's very common words, in American spelling (English and American lists; not British-only ones like signalling)
real = set()
for top in (10, 20):
    for kind in ("english", "american"):
        f = os.path.join(scowl, f"{kind}-words.{top}")
        if os.path.exists(f): real |= {w for w in (kc.plain(x.strip()) for x in open(f, encoding="latin-1")) if ok(w)}
# the word a longer one is made from: walked, walking (walk), baked (bake), stopped (stop), cried (cry), quickly
def stems(x):
    for end in ("s", "es", "ed", "ing", "ly", "d"):
        if x.endswith(end) and len(x) - len(end) >= 2:
            b = x[:-len(end)]
            yield from (b, b + "e", b[:-1] if len(b) > 2 and b[-1] == b[-2] else b, b[:-1] + "y" if b.endswith("i") else b)
endings = {x for x in real if any(b in familiar for b in stems(x))}
words = familiar | endings | TWO
json.dump({"words": " ".join(sorted(words))}, open(out, "w"), separators=(",", ":"))
print(len(words), "words,", os.path.getsize(out) // 1024, "KB")
