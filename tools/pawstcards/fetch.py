"""Fetch the Wikipedia articles Pawstcards reads, as raw wikitext: each place's own article into raw/, and the
articles about its cats (catsrc.py) into rawcats/. Files already there are kept.

Raw wikitext (index.php?action=raw) is the only way in from a cloud session: Wikipedia's APIs answer 429 there.
    python3 fetch.py            (needs en.wikipedia.org allowed)
"""
import os, re, time, urllib.error, urllib.parse, urllib.request
from places import PLACES
from catsrc import SRC
UA = "CatPuzzleSiteTool/1.0 (educational game data)"


def get(title):
    url = "https://en.wikipedia.org/w/index.php?" + urllib.parse.urlencode({"title": title, "action": "raw"})
    for i in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60) as r:
                return r.read().decode()
        except urllib.error.HTTPError as e:
            if e.code == 404: return None
            time.sleep(3 * 2 ** i)
        except Exception:
            time.sleep(3 * 2 ** i)
    return None


def fetch(title, path):
    if os.path.exists(path): return
    text, hops = get(title), 0
    while text and text.lstrip().upper().startswith("#REDIRECT") and hops < 2:
        time.sleep(1.5); text = get(re.search(r"\[\[(.*?)[\]|#]", text).group(1)); hops += 1
    print(title, len(text) if text else "MISSING")
    if text: open(path, "w").write(text)
    time.sleep(1.5)


os.makedirs("raw", exist_ok=True); os.makedirs("rawcats", exist_ok=True)
for code, (name, title, region) in PLACES.items(): fetch(title, f"raw/{code}.wiki")
for title in sorted({t.lstrip("*") for v in SRC.values() for t in v}): fetch(title, "rawcats/" + title.replace("/", "_") + ".wiki")
