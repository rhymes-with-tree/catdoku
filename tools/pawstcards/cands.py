"""Write the candidates to choose postcards from, into cand/: for each place, the best few runs of 2-3 sentences of
each kind from its own article (CODE.txt, CODE.json), and the Cats candidates from the articles about its cats
(catcards.txt, catcards.json). Places that already have a CODE.json are skipped unless named.

    python3 cands.py [CODE ...]
"""
import json, os, re, sys
import build
from places import PLACES
from catsrc import SRC
build.CANDIDATES = 12
os.makedirs("cand", exist_ok=True)
only = sys.argv[1:]


def terms_for(code):
    wt = open(f"raw/{code}.wiki").read()
    return wt, build.cover_terms(PLACES[code][0], build.AKA.get(code, []), build.infobox(wt), build.EXTRA.get(code, {}))


for code in PLACES:
    if (only and code not in only) or (not only and os.path.exists(f"cand/{code}.json")): continue
    wt, (terms, stems, caps) = terms_for(code)
    c = build.postcards(build.sections(wt), terms, stems)
    with open(f"cand/{code}.txt", "w") as f:
        for k, v in c.items():
            f.write(f"## {k}\n")
            for i, sc, t in v: f.write(f"{i} [{sc}] {t}\n")
    json.dump(c, open(f"cand/{code}.json", "w"), ensure_ascii=False)
    print(code, {k: len(v) for k, v in c.items()})

# Cats: 1 or 2 sentences from an article about the place's cats. An article marked * in catsrc.py is all about that
# place's cats, so any sentence may do; from any other, only sentences that name the place.
out, lines = {}, []
for code, arts in SRC.items():
    wt, (terms, stems, caps) = terms_for(code)
    out[code] = []
    lines.append(f"## {code} {PLACES[code][0]}")
    for ai, a in enumerate(arts):
        whole, title = a.startswith("*"), a.lstrip("*")
        p = "rawcats/" + title.replace("/", "_") + ".wiki"
        if not os.path.exists(p): continue
        cands = []
        for pi, (h2, h3, para) in enumerate(build.sections("== Lead ==\n" + open(p).read())):
            if re.search(r"see also|references|notes|further|external|bibliography|sources|taxonomy|phylogen|genetic|health|characteristics|description", (h3 or "") + " " + h2, re.I) and not whole: continue
            if re.search(r"see also|references|notes|further|external|bibliography|sources", h2, re.I): continue
            sents = build.split_sentences(para)
            for i in range(len(sents)):
                for n in (1, 2):
                    win = sents[i:i + n]
                    if len(win) < n: break
                    text = " ".join(win)
                    if not (90 <= len(text) <= 330) or (n == 2 and len(win[0]) >= 150): continue
                    if build.DANGLING.match(win[0]) or build.bad_text(text) or build.points_back(win[0], sents[i - 1] if i else ""): continue
                    cov, nb = build.cover(text, terms)
                    shown = build.fold(re.sub(r"\[\[.*?\]\]", "", cov)).lower()
                    if any(st in shown for st in stems) or nb > 4 or (not whole and nb == 0): continue
                    cands.append((build.interest(cov) + (2 if nb else 0), pi, f"{ai}.{pi}.{i}.{n}", cov))
        cands.sort(key=lambda c: -c[0])
        seen, keep = set(), []
        for sc, pi, cid, cov in cands:
            if pi in seen: continue
            seen.add(pi); keep.append((cid, cov))
            if len(keep) >= 12: break
        lines.append(f"# {title}")
        for cid, cov in keep:
            out[code].append((cid, cov)); lines.append(f"{cid} {cov}")
json.dump(out, open("cand/catcards.json", "w"), ensure_ascii=False)
open("cand/catcards.txt", "w").write("\n".join(lines))
print("cats:", sum(len(v) for v in out.values()))
