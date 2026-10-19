"""Builds magnets/words.json, Fridge Magnets' word list: everyday words only, the only words that count on the
board and when checking a fridge has just one answer.
Usage: python3 tools/make-magnet-words.py scowl-2020.12.07/final magnets/words.json
The words: words/words.json's familiar list (3 to 10 letters), those words with an s or es added where SCOWL counts
that word as very common too (size 20 or below), and the everyday two-letter words below. Keyboard Cat's rules (tools/make-words.py)
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
real = kc.scowl_words(scowl, 20, ok)
plurals = {w + e for w in familiar for e in ("s", "es") if ok(w + e) and w + e in real}
words = familiar | plurals | TWO
json.dump({"words": " ".join(sorted(words))}, open(out, "w"), separators=(",", ":"))
print(len(words), "words,", os.path.getsize(out) // 1024, "KB")
