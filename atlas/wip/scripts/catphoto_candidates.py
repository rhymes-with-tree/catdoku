# Up to 12 candidate photos per cat: research grade, wild, annotated alive, editable licences (NC last), most liked first.
import json, sys, subprocess, urllib.parse, os, concurrent.futures as cf
out = sys.argv[1]
CATS = [("lion", "Panthera leo", None), ("tiger", "Panthera tigris", None), ("leopard", "Panthera pardus", None), ("panther", "Panthera pardus", "melanistic"),
  ("snow-leopard", "Panthera uncia", None), ("clouded-leopard", "Neofelis nebulosa", None), ("jaguar", "Panthera onca", None), ("cheetah", "Acinonyx jubatus", None),
  ("puma", "Puma concolor", None), ("lynx", "Lynx lynx", None), ("bobcat", "Lynx rufus", None), ("caracal", "Caracal caracal", None), ("serval", "Leptailurus serval", None),
  ("ocelot", "Leopardus pardalis", None), ("margay", "Leopardus wiedii", None), ("jaguarundi", "Herpailurus yagouaroundi", None), ("oncilla", "Leopardus tigrinus", None),
  ("geoffroys-cat", "Leopardus geoffroyi", None), ("kodkod", "Leopardus guigna", None), ("andean-cat", "Leopardus jacobita", None), ("golden-cat", "Caracal auratus", None),
  ("leopard-cat", "Prionailurus bengalensis", None), ("fishing-cat", "Prionailurus viverrinus", None), ("rusty-spotted-cat", "Prionailurus rubiginosus", None),
  ("pallas-cat", "Otocolobus manul", None), ("sand-cat", "Felis margarita", None), ("black-footed-cat", "Felis nigripes", None), ("jungle-cat", "Felis chaus", None),
  ("wildcat", "Felis silvestris", None)]
def get(url): return json.loads(subprocess.run(["curl", "-sS", "--max-time", "60", url], capture_output=True, text=True, check=True).stdout)
TAXA = {v[1]: v[0] for v in json.load(open(os.path.join(out, "taxa.json"))).values() if v}
TAXA["Caracal auratus"] = 74146
def one(c):
    key, sp, term = c; got = []
    for alive, lic in [(a, l) for a in (True, False) for l in ("cc0,cc-by", "cc-by-sa", "cc-by-nc,cc-by-nc-sa")]:
        if len(got) >= 12: break
        q = {"taxon_id": TAXA[sp], "quality_grade": "research", "captive": "false", "photo_license": lic, "order_by": "votes", "per_page": 40}
        if alive: q.update(term_id=17, term_value_id=18)
        if term: q["q"] = term
        for o in get("https://api.inaturalist.org/v1/observations?" + urllib.parse.urlencode(q))["results"]:
            p = next((p for p in o["photos"] if p.get("license_code") in lic.split(",")), None)
            if p and o["id"] not in [g["obs"] for g in got]:
                got.append({"obs": o["id"], "url": p["url"].replace("square", "large"), "thumb": p["url"].replace("square", "small"),
                            "license": p["license_code"], "credit": p["attribution"], "place": o.get("place_guess") or "", "species": sp})
            if len(got) >= 12: break
    for i, g in enumerate(got):
        g["file"] = f"{key}-c{i+1:02d}.jpg"
        subprocess.run(["curl", "-sS", "--max-time", "60", "-o", os.path.join(out, g["file"]), g["thumb"]], check=True)
    return key, got
with cf.ThreadPoolExecutor(6) as ex: res = dict(ex.map(one, CATS))
json.dump(res, open(os.path.join(out, "candidates.json"), "w"), indent=0)
print({k: len(v) for k, v in res.items()})
