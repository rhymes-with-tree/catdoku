"""Write the game's data from the hand-picked postcards: pawstcards/postcards.js (picks.py and catpicks.py, looked up
in the candidates in cand/) and pawstcards/places.js (every place a guess can name, copied from Catlas's page).

    python3 make.py
"""
import json, os, re
from places import PLACES
from picks import PICKS
from catpicks import CATS
from catsrc import SRC
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
iso = json.load(open(os.path.join(ROOT, "tools/atlas/iso2.json")))
catc = json.load(open("cand/catcards.json"))


def chosen(byid, entries, where):
    out = []
    for e in entries:
        i, t = (e, None) if isinstance(e, str) else e
        assert i in byid, (where, i)
        if t: assert all(w in byid[i] for w in re.findall(r"[\w']+", t)), (where, i)   # a cut-down card only loses words
        out.append(t or byid[i])
    return out


post, n = {}, 0
for code, kinds in PICKS.items():
    name, title, region = PLACES[code]
    cand = json.load(open(f"cand/{code}.json"))
    cards = {k: chosen({i: t for i, _, t in cand[k]}, ids, (code, k)) for k, ids in kinds.items()}
    cards["cats"] = chosen(dict(map(tuple, catc[code])), CATS.get(code, []), (code, "cats"))
    more = []
    for e in CATS.get(code, []):
        art = SRC[code][int((e if isinstance(e, str) else e[0]).split(".")[0])].lstrip("*")
        if art not in more: more.append(art)
    post[code] = {**cards, "title": title, "more": more, "region": region, "iso": iso.get(code, "")}
    n += sum(len(v) for v in cards.values())
with open(os.path.join(ROOT, "pawstcards/postcards.js"), "w") as f:
    f.write("// Pinecone's postcards, made by tools/pawstcards/make.py from Wikipedia (CC BY-SA 4.0): for each place, each kind's\n"
            "// postcards, hardest first, with the words her paw prints cover in [[double brackets]]; the place's Wikipedia\n"
            "// article (title) and the articles its Cats postcards come from (more), for the credit; the region its\n"
            "// postmark shows after a hint; and its two-letter code, for the flag.\n")
    f.write("const POST = {\n" + ",\n".join(f"{json.dumps(c)}: {json.dumps(p, ensure_ascii=False)}" for c, p in post.items()) + "\n};\n")
atlas = open(os.path.join(ROOT, "atlas/index.html")).read()
with open(os.path.join(ROOT, "pawstcards/places.js"), "w") as f:
    f.write("// Every place a guess can name, and the other names it answers to: copied from Catlas (atlas/index.html) by\n"
            "// tools/pawstcards/make.py, so the two games take the same answers.\n")
    for const in ("NAMES", "DEPS", "AKA"):
        f.write(f"const {const} = " + re.search(r"const " + const + r" = (\{.*?\});\n", atlas, re.S).group(1) + ";\n")
print(len(post), "places,", n, "postcards")
