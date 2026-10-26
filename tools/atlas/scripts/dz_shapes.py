# Shapes lit in Catlas's disputed-territory round: Natural Earth's 1:50m breakaway and disputed areas, plus whole
# places from the game's map for disputes over a whole place (Kosovo, Taiwan, the Korean Peninsula...), and provinces
# from Natural Earth's 1:10m admin-1 file (Tibet), simplified to about the 1:50m shapes' detail.
# Run: python3 dz_shapes.py <ne_50m_admin_0_breakaway_disputed_areas.geojson> <world_un.json> <out.json> <ne_10m_admin_1_states_provinces.geojson>
import json, sys
src, world, out, admin1 = sys.argv[1:5]
NE = {"crimea": ["Crimea"], "donbas": ["Donetsk People's Republic", "Luhansk People's Republic"], "golan": ["Golan Heights"],
  "kashmir": ["Jammu and Kashmir", "Gilgit-Baltistan", "Siachen Glacier", "Shaksam Valley", "Aksai Chin"], "aksaichin": ["Aksai Chin"],
  "arunachal": ["Arunachal Pradesh"], "abkhazia": ["Abkhazia"], "sossetia": ["South Ossetia"], "transnistria": ["Transnistria"],
  "ncyprus": ["N. Cyprus"], "somaliland": ["Somaliland"], "abyei": ["Abyei"], "ilemi": ["Ilemi Triangle"], "kurils": ["Kuril Is."],
  "karabakh": ["Artsakh"]}
WHOLE = {"wsahara": ["SAH"], "kosovo": ["KOS"], "taiwan": ["TWN"], "palestine": ["PSX"], "korea": ["PRK", "KOR"], "falklands": ["FLK"],
  "chagos": ["IOT"], "belize": ["BLZ"], "essequibo": ["GUY"]}
ADMIN1 = {"tibet": [("CHN", "Xizang")]}
feats = {f["properties"]["BRK_NAME"]: f["geometry"] for f in json.load(open(src, encoding="utf-8"))["features"]}
rows = {r[0]: r for r in json.load(open(world, encoding="utf-8"))}
r3 = lambda poly: [[[round(x, 3), round(y, 3)] for x, y in ring] for ring in poly]
def simplify(ring, tol=0.03):
    # Douglas-Peucker, keeping the ring closed
    def dp(pts):
        if len(pts) < 3: return pts
        (x1, y1), (x2, y2) = pts[0], pts[-1]
        dx, dy = x2 - x1, y2 - y1; L = (dx * dx + dy * dy) ** 0.5 or 1e-12
        i, dmax = 0, 0
        for j in range(1, len(pts) - 1):
            d = abs(dy * pts[j][0] - dx * pts[j][1] + x2 * y1 - y2 * x1) / L
            if d > dmax: i, dmax = j, d
        return dp(pts[:i + 1])[:-1] + dp(pts[i:]) if dmax > tol else [pts[0], pts[-1]]
    half = len(ring) // 2
    return dp(ring[:half + 1])[:-1] + dp(ring[half:])
out_rows = []
for k, names in NE.items():
    polys = []
    for n in names:
        g = feats[n]; polys += [r3(p) for p in ([g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"])]
    out_rows.append(["dz:" + k, polys])
for k, codes in WHOLE.items():
    out_rows.append(["dz:" + k, [p for c in codes for p in rows[c][5]]])
prov = {(f["properties"]["adm0_a3"], f["properties"]["name"]): f["geometry"] for f in json.load(open(admin1, encoding="utf-8"))["features"]}
for k, names in ADMIN1.items():
    polys = []
    for n in names:
        g = prov[n]; polys += [r3([simplify(r) for r in p]) for p in ([g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"])]
    out_rows.append(["dz:" + k, polys])
json.dump(out_rows, open(out, "w", encoding="utf-8"), separators=(",", ":"))
print(len(out_rows), "shapes")
