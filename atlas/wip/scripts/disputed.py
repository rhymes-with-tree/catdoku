# The disputed areas Cat Atlas draws with stripes, from Natural Earth's 1:50m breakaway and disputed areas.
# Western Sahara is striped whole (Natural Earth's shape is only the Moroccan-held part), so its outline comes from
# the game's map. North Borneo is left out: Natural Earth lists no live dispute for it.
# Run: python3 disputed.py <ne_50m_admin_0_breakaway_disputed_areas.geojson> <world_un.json> <out.json>
import json, sys
src, world, out = sys.argv[1:4]
rows = []
for f in json.load(open(src, encoding="utf-8"))["features"]:
    p, g = f["properties"], f["geometry"]
    if p["BRK_NAME"] in ("North Borneo", "W. Sahara"): continue
    polys = [g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]
    rows.append([p["BRK_NAME"], p["NOTE_BRK"], [[[[round(x, 3), round(y, 3)] for x, y in r] for r in poly] for poly in polys]])
sah = next(r for r in json.load(open(world, encoding="utf-8")) if r[0] == "SAH")
rows.append(["Western Sahara", "Claimed by Morocco", sah[5]])
json.dump(rows, open(out, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print(len(rows), "areas,", sum(len(r[2]) for r in rows), "pieces")
