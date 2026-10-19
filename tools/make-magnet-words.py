"""Builds magnets/words.json, Fridge Magnets' word list, from SCOWL with Keyboard Cat's rules
(tools/make-words.py: no slurs, swear words never answers) except that words may have an 's' and any letters.
answers: SCOWL sizes 10-50, 4 to 8 letters: the words a Spelling Bee might ask for, plus words with an S. These are
the only words that count, on the board and when checking a fridge has just one answer.
everyday: the answers that are everyday words (in words/words.json's familiar list, or one with an s added).
Usage: python3 tools/make-magnet-words.py scowl-2020.12.07/final magnets/words.json"""
import json, sys, os, importlib.util
spec = importlib.util.spec_from_file_location("kc", os.path.join(os.path.dirname(__file__), "make-words.py"))
kc = importlib.util.module_from_spec(spec)
try: spec.loader.exec_module(kc)
except ImportError: pass
scowl, out = sys.argv[1:3]
def ok(w): return 4 <= len(w) <= 8 and w.isascii() and w.isalpha() and w.islower() and w not in kc.BLOCK
answers = (kc.scowl_words(scowl, 50, ok) - kc.NOT_ANSWERS) | {w for w in kc.MAKE_COMMON if ok(w)}
familiar = set(json.load(open(os.path.join(os.path.dirname(__file__), "..", "words", "words.json")))["familiar"].split())
everyday = {w for w in answers if w in familiar or w[-1] == "s" and (w[:-1] in familiar or w.endswith("es") and w[:-2] in familiar)}
json.dump({"everyday": " ".join(sorted(everyday)), "answers": " ".join(sorted(answers - everyday))}, open(out, "w"), separators=(",", ":"))
print(len(everyday), "everyday,", len(answers), "answers,", os.path.getsize(out) // 1024, "KB")
