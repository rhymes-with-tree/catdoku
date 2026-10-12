"""Builds keyboardcat/words.json from SCOWL (via the wordlist-english npm package's JSON files).
Usage: npm pack wordlist-english && tar xzf wordlist-english-*.tgz
       python3 tools/make-words.py package keyboardcat/words.json
SCOWL is (c) Kevin Atkinson; its notice is in keyboardcat/WORDS-LICENSE.txt and must stay with the list.
common: words from SCOWL sizes 10-35 (answers); extra: sizes 40-50 (accepted, rarer).
Only lowercase a-z words of 4+ letters, with at most 7 different letters and no 's' (as in Spelling Bee,
so plurals don't double every list), and nothing on the blocklist."""
import json, sys, os
src = sys.argv[1]; out = sys.argv[2]
# Words left out on purpose: rude or hurtful ones that shouldn't turn up in a cat game.
BLOCK = set("""anal anus arse bitch bitched bitchier bitchy bollock boner booby boob bugger buggered butt butthole cock cocky coon crap crappier crappy cunt damn damned dick dickhead dildo dyke fart farted fatso faggot fag fuck fucked fucker gook hell homo honky horny hump humped jerkoff jizz kike kink kinky knob lech lechery lewd naked nigga nigger nude orgy pecker penile penis perv pervert piddle piss pissed poof poop porn porno prick pube pubic puke queer rape raped rapist rectum retard retarded semen sex sexed sexier sexy shag shit shitty slag slut sodomy spaz sperm spic tart teat tit titty tits turd twat urine vagina vulva wank wanker whore wop""".split())
def load(sizes):
    s = set()
    for lv in sizes:
        for kind in ("english", "american"):
            p = os.path.join(src, f"{kind}-words-{lv}.json")
            for w in json.load(open(p)):
                if len(w) >= 4 and w.isascii() and w.isalpha() and w.islower() and "s" not in w and len(set(w)) <= 7 and w not in BLOCK:
                    s.add(w)
    return s
common = load(["10", "20", "35"]); extra = load(["40", "50"]) - common
json.dump({"common": sorted(common), "extra": sorted(extra)}, open(out, "w"), separators=(",", ":"))
pangrams = [w for w in common if len(set(w)) == 7]
print(len(common), "common,", len(extra), "extra,", len(pangrams), "pangram words,", os.path.getsize(out) // 1024, "KB")

# Every playable keyboard: 7 letters that some common word uses all of, and the key the cat sits on, kept when
# there are 15 to 50 common answers. Stored as 8 letters: the 7 keys in order, then the one the cat sits on.
data = json.load(open(out)); common_l = data["common"]
by_set = {}
for w in common_l:
    k = "".join(sorted(set(w)))
    if len(k) == 7: by_set.setdefault(k, 0)
puzzles = []
masks = [(w, set(w)) for w in common_l]
for keys in sorted(by_set):
    ks = set(keys); fits = [w for w, s in masks if s <= ks]
    for c in keys:
        n = sum(1 for w in fits if c in w)
        if 15 <= n <= 50: puzzles.append(keys + c)
data["puzzles"] = puzzles
json.dump(data, open(out, "w"), separators=(",", ":"))
print(len(puzzles), "keyboards,", os.path.getsize(out) // 1024, "KB")
