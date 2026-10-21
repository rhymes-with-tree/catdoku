import json, sys, subprocess
S = sys.argv[1]
B = "https://api.iucnredlist.org/api/v4/"
def get(p): return json.loads(subprocess.run(["curl", "-sS", "--max-time", "60", B + p], capture_output=True, text=True, check=True).stdout)
# every cat species IUCN assesses: the family's taxa
allA, page = [], 1
while True:
    got = get(f"taxa/family/FELIDAE?page={page}").get("assessments", [])
    if not got: break
    allA += got; page += 1
sp_ids = {}
for a in allA:
    if a.get("latest") and any(c.get("code") == "1" for c in a.get("scopes", [])) and a.get("taxon_scientific_name", "").count(" ") == 1:
        sp_ids[a["taxon_scientific_name"]] = a["assessment_id"]
print(len(sp_ids), "species")
want = {"BF","SZ","LY","MA","NG","RW","SO","PH","QA","PS","PT","GB","XK","RS","MY","ID"}
g = json.load(open(S + "/gbif_counts.json")); iso2 = json.load(open(S + "/iso2.json"))
by = {k: [] for k in want}
for sp, aid in sorted(sp_ids.items()):
    for l in get(f"assessment/{aid}")["locations"]:
        cc = l["code"][:2]
        if cc in want and l.get("origin") == "Native" and l.get("presence") == "Extant": by[cc].append(sp)
inv = {v: k for k, v in iso2.items()}
for cc, sps in by.items():
    gc = g.get(inv.get(cc, ""), {})
    print(cc, "; ".join(f"{s} (GBIF {gc.get(s, 0)})" for s in sps))
