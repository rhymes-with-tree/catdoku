# Check every wild cat pick in CLUE against the IUCN Red List: is the species listed as native and extant in that country?
import json, re, sys, subprocess
S, js = sys.argv[1:3]
B = "https://api.iucnredlist.org/api/v4/"
def get(p): return json.loads(subprocess.run(["curl", "-sS", "--max-time", "60", B + p], capture_output=True, text=True, check=True).stdout)
SPECIES = {"lion": "Panthera leo", "tiger": "Panthera tigris", "leopard": "Panthera pardus", "panther": "Panthera pardus",
  "snow": "Panthera uncia", "clouded": ["Neofelis nebulosa", "Neofelis diardi"], "jaguar": "Panthera onca", "cheetah": "Acinonyx jubatus",
  "puma": "Puma concolor", "lynx": ["Lynx lynx", "Lynx pardinus", "Lynx canadensis"], "bobcat": "Lynx rufus", "caracal": "Caracal caracal",
  "serval": "Leptailurus serval", "ocelot": "Leopardus pardalis", "margay": "Leopardus wiedii", "jaguarundi": "Herpailurus yagouaroundi",
  "oncilla": ["Leopardus tigrinus", "Leopardus guttulus"], "geoffroy": "Leopardus geoffroyi", "kodkod": "Leopardus guigna",
  "andean": "Leopardus jacobita", "golden": ["Caracal aurata", "Catopuma temminckii"], "leopardcat": "Prionailurus bengalensis",
  "fishing": "Prionailurus viverrinus", "rusty": "Prionailurus rubiginosus", "manul": "Otocolobus manul", "sand": "Felis margarita",
  "blackfoot": "Felis nigripes", "jungle": "Felis chaus", "wildcat": ["Felis silvestris", "Felis lybica"]}
src = open(js, encoding="utf-8").read()
words = re.search(r"const CLUE = Object\.fromEntries\(`(.*?)`", src, re.S).group(1).split()
clue = dict(zip(words[::2], words[1::2]))
iso2 = json.load(open(S + "/iso2.json")); iso2["SDS"] = "SS"
names = json.load(open(S + "/names.json"))
cache = {}
def where(sp):
    if sp not in cache:
        g, s = sp.split()
        t = get(f"taxa/scientific_name?genus_name={g}&species_name={s}")
        a = [x for x in t["assessments"] if x.get("latest") and any(c.get("code") == "1" for c in x.get("scopes", []))]
        locs = get(f"assessment/{a[0]['assessment_id']}")["locations"] if a else []
        cache[sp] = {l["code"][:2]: f"{l.get('origin')}/{l.get('presence')}" for l in locs}
    return cache[sp]
ok, bad = [], []
for c, cat in clue.items():
    if cat == "house": continue
    sps = SPECIES[cat] if isinstance(SPECIES[cat], list) else [SPECIES[cat]]
    status = {sp: where(sp).get(iso2[c]) for sp in sps}
    good = [sp for sp, v in status.items() if v and v.startswith("Native/Extant")]
    (ok if good else bad).append((names[c], cat, good or status))
print("native and extant:", len(ok))
for b in bad: print("CHECK", b)
json.dump({"ok": ok, "check": bad}, open(S + "/iucn_check.json", "w"), indent=1)
