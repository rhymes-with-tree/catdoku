#!/usr/bin/env python3
"""Fetch the paintings for Cat Burglar from The Met's Open Access collection.

Writes catburglar/art/<objectID>.webp (longest side 1600 px) and
catburglar/paintings.js (title, artist, date and link for each).
Every painting is public domain (CC0); see https://metmuseum.github.io/.
Run from the repo root: python3 tools/make-paintings.py
"""
import io, json, os, sys, time, urllib.request
from PIL import Image

# Busy scenes, picked by hand from the Met's highlighted paintings: no nudes,
# nothing gory, and no real cats (or lions) already in the picture.
IDS = [
    10154, 10464, 10481, 10497, 11145, 11417, 39664, 435702, 435809, 435839,
    435868, 435882, 435908, 436121, 436528, 436535, 436575, 436579, 436622,
    436838, 436947, 436966, 437053, 437097, 437299, 437549, 437658, 437749,
    437854, 437881, 438417, 438815, 438817, 438820, 441769, 626692, 679844,
    827660, 44918, 49156, 37947, 61429, 744940, 910555, 44696, 10997,
    436504, 437344, 436440, 435962, 436095,
]
API = "https://collectionapi.metmuseum.org/public/collection/v1/objects/"
SIDE = 1600
OUT = "catburglar/art"


def fetch(url):
    for i in range(6):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "catdoku-tools/1.0"})
            return urllib.request.urlopen(req, timeout=60).read()
        except Exception as e:
            print("  retry", url, e, file=sys.stderr)
            time.sleep(2 ** i)
    raise SystemExit("couldn't fetch " + url)


def main():
    os.makedirs(OUT, exist_ok=True)
    rows = []
    for oid in IDS:
        o = json.loads(fetch(API + str(oid)))
        if not o.get("isPublicDomain"):
            print("not public domain, skipped:", oid, file=sys.stderr)
            continue
        path = f"{OUT}/{oid}.webp"
        if not os.path.exists(path):
            im = Image.open(io.BytesIO(fetch(o["primaryImage"]))).convert("RGB")
            im.thumbnail((SIDE, SIDE), Image.LANCZOS)
            im.save(path, "WEBP", quality=80, method=6)
        w, h = Image.open(path).size
        rows.append({"id": oid, "title": o["title"], "artist": o["artistDisplayName"],
                     "date": o["objectDate"], "url": o["objectURL"], "w": w, "h": h})
        print(oid, w, h, o["title"][:50], "|", ", ".join(t["term"] for t in o.get("tags") or []))
        time.sleep(0.3)
    with open("catburglar/paintings.js", "w") as f:
        f.write("// Made by tools/make-paintings.py from The Met's Open Access collection (CC0).\n")
        f.write("const PAINTINGS = [\n")
        for r in rows:
            f.write("  " + json.dumps(r, ensure_ascii=False) + ",\n")
        f.write("];\n")


main()
