"""Builds words/words.json, the word list Up a Tree and Fuzzy Spelling share, from SCOWL.
Usage: download SCOWL (https://wordlist.aspell.net/, e.g. scowl-2020.12.07.tar.gz), then
       python3 tools/make-wordlist.py scowl-2020.12.07/final words/words.json
SCOWL is (c) Kevin Atkinson; its notice is in words/WORDS-LICENSE.txt and must stay with the list.
Unlike Keyboard Cat's list (which follows Spelling Bee), words with an s count, and only American spellings are
used, so KERB and COLOUR aren't in it. Words of 3 to 8 letters, a-z only, by SCOWL size:
familiar (answers, starts and goals): sizes 10-20, leaving out plurals and words ending in -ed;
common (everyday words: Up a Tree's par and hints): sizes 10-50, the familiar ones included;
every word (anything that counts when you make it): sizes 10-70, the common ones included.
To keep it small each word is stored once, in three space-separated strings: "familiar", "common" (the common
words that aren't familiar) and "more" (the rest).
Slurs are left out; swear words count when typed but are never starts, goals or hints."""
import json, sys, os, re
scowl, out = sys.argv[1:3]
SLURS = set("""nigger nigga kike gook spic wop spaz honky wetback dago darkie darky jigaboo pickaninny gippo lezzie
bulldyke trannie fag faggot homo coon retard chink coolie gypped paddy mick kraut mongol mong gimp tranny nancy dyke
poof twink midget rape raped""".split())
CRUDE = set("""arse ass asses bitch butt crap cunt damn dick dildo fart fuck jizz piss shit tit tits turd twat wank boner
boob booby porn perv slut whore sexy sex anal anus""".split())
def words(top):
    found = set()
    for kind in ("english", "american"):
        for size in (10, 20, 35, 40, 50, 55, 60, 70):
            f = os.path.join(scowl, f"{kind}-words.{size}")
            if size <= top and os.path.exists(f):
                found |= {w.strip() for w in open(f, encoding="latin-1")}
    return {w for w in found if re.fullmatch(r"[a-z]{3,8}", w) and w not in SLURS}
every, common, familiar = words(70), words(50) - CRUDE, words(20) - CRUDE
# a plural or a past tense reads as a form of another word, not a word of its own, so it's never a start or goal
familiar = {w for w in familiar if not re.search(r"([^s]s|ed)$", w)}
data = {"familiar": " ".join(sorted(familiar)), "common": " ".join(sorted(common - familiar)), "more": " ".join(sorted(every - common - familiar))}
json.dump(data, open(out, "w"), separators=(",", ":"))
print({k: len(v.split()) for k, v in data.items()}, os.path.getsize(out), "bytes")
