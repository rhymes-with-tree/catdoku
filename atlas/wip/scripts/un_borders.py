# Redraw disputed land the way the UN sees it, for Cat Atlas.
# World Map Recall's world.json (Natural Earth 1:50m) draws some land as the side that controls it. Using Natural
# Earth's 1:50m breakaway and disputed areas, this moves:
#   Crimea from Russia to Ukraine, the Golan Heights from Israel to Syria, and the Moroccan-held part of
#   Western Sahara from Morocco to Western Sahara.
# It also hands the Chagos Islands (British Indian Ocean Territory) to Mauritius, as the UN General Assembly voted in 2019.
# Run: python3 un_borders.py <world.json> <ne_50m_admin_0_breakaway_disputed_areas.geojson> <out.json>
import json, sys
from shapely.geometry import shape, mapping, MultiPolygon, Polygon
from shapely.geometry.polygon import orient
from shapely import set_precision
src, disputed, out = sys.argv[1:4]
MOVES = {"Crimea": ("RUS", "UKR"), "Golan Heights": ("ISR", "SYR"), "W. Sahara": ("MAR", "SAH")}
world = json.load(open(src, encoding="utf-8"))
areas = {f["properties"]["BRK_NAME"]: f for f in json.load(open(disputed, encoding="utf-8"))["features"]}
snap = lambda g: set_precision(g.buffer(0), 0.001)
geom = {row[0]: snap(MultiPolygon([Polygon(p[0], p[1:]) for p in row[5]])) for row in world}
for name, (frm, to) in MOVES.items():
    piece = snap(shape(areas[name]["geometry"]))
    geom[frm] = snap(geom[frm].difference(piece))
    geom[to] = snap(geom[to].union(piece))
def coords(g):
    polys = [g] if isinstance(g, Polygon) else [p for p in getattr(g, "geoms", []) if isinstance(p, Polygon)]
    res = []
    for p in polys:
        if p.area < 1e-6: continue          # drop slivers left where the two outlines don't quite meet
        p = orient(p, sign=-1.0)            # outer rings clockwise, holes counterclockwise, as in world.json
        res.append([[[round(x, 3), round(y, 3)] for x, y in r.coords] for r in [p.exterior, *p.interiors]])
    return res
geom["MUS"] = snap(geom["MUS"].union(geom["IOT"]))
changed = {c for pair in MOVES.values() for c in pair} | {"MUS"}
rows = [row[:5] + [coords(geom[row[0]])] if row[0] in changed else row for row in world if row[0] != "IOT"]
json.dump(rows, open(out, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
for c in sorted(changed): print(c, len(geom[c].geoms) if hasattr(geom[c], "geoms") else 1, "pieces")
