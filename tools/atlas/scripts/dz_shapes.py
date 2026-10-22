# Shapes lit in Catlas's disputed-territory round: Natural Earth's 1:50m breakaway and disputed areas, plus whole
# places from the game's map for disputes over a whole place (Kosovo, Taiwan, the Korean Peninsula...).
# Run: python3 dz_shapes.py <ne_50m_admin_0_breakaway_disputed_areas.geojson> <world_un.json> <out.json>
import json, sys
src, world, out = sys.argv[1:4]
NE = {"crimea": ["Crimea"], "donbas": ["Donetsk People's Republic", "Luhansk People's Republic"], "golan": ["Golan Heights"],
  "kashmir": ["Jammu and Kashmir", "Gilgit-Baltistan", "Siachen Glacier", "Shaksam Valley", "Aksai Chin"], "aksaichin": ["Aksai Chin"],
  "arunachal": ["Arunachal Pradesh"], "abkhazia": ["Abkhazia"], "sossetia": ["South Ossetia"], "transnistria": ["Transnistria"],
  "ncyprus": ["N. Cyprus"], "somaliland": ["Somaliland"], "abyei": ["Abyei"], "ilemi": ["Ilemi Triangle"], "kurils": ["Kuril Is."],
  "karabakh": ["Artsakh"]}
WHOLE = {"wsahara": ["SAH"], "kosovo": ["KOS"], "taiwan": ["TWN"], "palestine": ["PSX"], "korea": ["PRK", "KOR"], "falklands": ["FLK"],
  "chagos": ["IOT"], "belize": ["BLZ"], "essequibo": ["GUY"]}
feats = {f["properties"]["BRK_NAME"]: f["geometry"] for f in json.load(open(src, encoding="utf-8"))["features"]}
rows = {r[0]: r for r in json.load(open(world, encoding="utf-8"))}
r3 = lambda poly: [[[round(x, 3), round(y, 3)] for x, y in ring] for ring in poly]
out_rows = []
for k, names in NE.items():
    polys = []
    for n in names:
        g = feats[n]; polys += [r3(p) for p in ([g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"])]
    out_rows.append(["dz:" + k, polys])
for k, codes in WHOLE.items():
    out_rows.append(["dz:" + k, [p for c in codes for p in rows[c][5]]])
json.dump(out_rows, open(out, "w", encoding="utf-8"), separators=(",", ":"))
print(len(out_rows), "shapes")
