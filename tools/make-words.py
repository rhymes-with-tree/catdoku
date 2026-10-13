"""Builds keyboardcat/words.json from SCOWL and ENABLE.
Usage: download SCOWL (https://wordlist.aspell.net/, e.g. scowl-2020.12.07.tar.gz) and ENABLE (enable1.txt, public
       domain; e.g. https://raw.githubusercontent.com/dolph/dictionary/master/enable1.txt), then
       python3 tools/make-words.py scowl-2020.12.07/final enable1.txt keyboardcat/words.json
SCOWL is (c) Kevin Atkinson; its notice is in keyboardcat/WORDS-LICENSE.txt and must stay with the list.
common (the answers): SCOWL sizes 10-50 (American, British, Canadian and shared English spellings).
extra (accepted too): SCOWL up to size 80, everything in ENABLE, and a few newer words SCOWL and ENABLE don't have.
Accents are dropped (épée counts as epee). Only a-z words of 4+ letters, with at most 7 different letters and no
's' (as in Spelling Bee, so plurals don't double every list), and no slurs. Swear words count but are never answers."""
import json, sys, os, glob, unicodedata
scowl, enable, out = sys.argv[1:4]
# Slurs, left out: words whose only meaning is a slur.
SLURS = set("""nigger nigga kike gook spic wop spaz honky wetback dago darkie darky jigaboo pickaninny gippo lezzie
bulldyke trannie""".split())
# Slurs that also have another meaning (dyke: an embankment; coon: a raccoon). Left out until decided one by one.
# (Decided and allowed as ordinary words: dyke, poof, twink, cripple, midget, rape, raped, rapist, cracker.)
UNDECIDED = set("""fag faggot homo coon retard retarded chink coolie gypped paddy mick kraut mongol mong gimp tranny nancy
mulatto octoroon golliwog""".split())
BLOCK = SLURS | UNDECIDED
# Swear words and crude slang: they count when typed, but are never answers you have to find.
CRUDE = set("""arse bitch bitched bitchier bitchy bollock bugger buggered butt butthole crap crappier crappy cunt damn damned
dick dickhead dildo fart farted fuck fucked fucker jerkoff jizz piss pissed shit shitty tit tits titty turd twat wank
wanker boner boob booby porn porno perv fatso slut whore""".split())
# Newer words neither list has yet.
ALSO = set("empath empathic vlog vlogger glamping matcha".split())
def ok(w): return len(w) >= 4 and w.isascii() and w.isalpha() and w.islower() and "s" not in w and len(set(w)) <= 7 and w not in BLOCK
def plain(w): return unicodedata.normalize("NFKD", w).encode("ascii", "ignore").decode()
def scowl_words(top):
    words = set()
    for f in glob.glob(os.path.join(scowl, "*-words.*")):
        name = os.path.basename(f); kind, size = name.split("-")[0], int(name.rsplit(".", 1)[1])
        if kind in ("english", "american", "british", "canadian") and "variant" not in name and size <= top:
            words |= {plain(w.strip()) for w in open(f, encoding="latin-1")}
    return {w for w in words if ok(w)}
common = scowl_words(50) - CRUDE
extra = (CRUDE & scowl_words(80)) | (scowl_words(80) | {w.strip() for w in open(enable) if ok(w.strip())} | {w for w in ALSO if ok(w)}) - common
json.dump({"common": sorted(common), "extra": sorted(extra)}, open(out, "w"), separators=(",", ":"))
pangrams = [w for w in common if len(set(w)) == 7]
print(len(common), "common,", len(extra), "extra,", len(pangrams), "pangram words,", os.path.getsize(out) // 1024, "KB")

# Every playable keyboard: 7 letters that some common word uses all of, and the key the cat sits on, kept when
# there are 20 to 70 common answers. Stored as 8 letters: the 7 keys in order, then the one the cat sits on.
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
        if 20 <= n <= 70: puzzles.append(keys + c)
data["puzzles"] = puzzles
json.dump(data, open(out, "w"), separators=(",", ":"))
print(len(puzzles), "keyboards,", os.path.getsize(out) // 1024, "KB")
