# the owner's Keeps from Clip Bench: give each a tag and a plain name, then cut it from the original recording
import json, glob, os, re, subprocess, sys
K = "/tmp/claude-0/-home-user-catdoku/a42e1b09-02b5-51f8-a6f3-2547bf4b5974/scratchpad/keeps/cuts/"
U = "/root/.claude/uploads/a42e1b09-02b5-51f8-a6f3-2547bf4b5974/"
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
cuts = []
for f in glob.glob(K + "*.json"):
    c = json.load(open(f)); c["id"] = os.path.basename(f)[:-5]; cuts.append(c)
def kind(c):
    n, s = c["name"].lower(), c["src"]
    if s == "634174":
        if "purr" in n: return "chirp-purr"
        if "rub" in n: return "rub"
        if "meoow" in n: return "meow"
        if "squeak" in n: return "squeak"
        return "chirp"
    if s == "451250": return "little-chirp"
    if s == "845517": return "mrrp" if "mrr" in n else "meow"
    if s == "851329": return "grumpy-chirp" if "chirp" in n else "grumpy-meow"
    return {"386738": "hiss", "863335": "knit", "846612": "fabric-grab", "427865": "rustle", "552515": "slide",
            "186747": "splash", "186746": "splash"}.get(s) or ("toy-knock" if "knock" in n else "toy-jingle")
TITLE = {"chirp": "Chirp", "chirp-purr": "Chirp-purr", "rub": "Cat rub", "meow": "Meow", "squeak": "Squeak", "little-chirp": "Little chirp",
  "mrrp": "Mrrp", "grumpy-meow": "Grumpy meow", "grumpy-chirp": "Grumpy chirp", "hiss": "Hiss", "knit": "Knitting stitch",
  "fabric-grab": "Fabric grab", "rustle": "Tunnel rustle", "slide": "Hard slide up", "splash": "Splash", "toy-jingle": "Toy jingle", "toy-knock": "Toy knock"}
cuts.sort(key=lambda c: (kind(c), c["src"], c["start"]))
n = {}; out = []
for c in cuts:
    k = kind(c); n[k] = n.get(k, 0) + 1
    total = sum(1 for x in cuts if kind(x) == k)
    name = TITLE[k] + (f" {n[k]}" if total > 1 else "")
    key = f"{k}-{n[k]:02d}" if total > 1 else k
    a, b = c["start"], c["end"]; d = b - a; f = glob.glob(U + "*" + c["src"] + "*")[0]
    fade = f"afade=t=out:st={max(0, d - .06):.3f}:d=0.06"
    if c["id"] == "meow1": fade = f"afade=t=out:st={0.5 - a:.3f}:d={b - 0.5:.3f}:curve=qsin"   # the owner: fade from 0.5 s, silent by the end
    pk = subprocess.run(["ffmpeg", "-v", "info", "-ss", str(a), "-t", str(d), "-i", f, "-ac", "1", "-af", "volumedetect", "-f", "null", "-"], capture_output=True, text=True).stderr
    gain = -3 - float(re.search(r"max_volume: (-?[\d.]+) dB", pk).group(1))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(a), "-t", str(d), "-i", f, "-ac", "1", "-ar", "44100",
      "-af", f"volume={gain}dB,afade=t=in:d=0.008,{fade}", "-b:a", "96k", f"{OUT}/{key}.mp3"], check=True)
    out.append({"key": key, "kind": k, "name": name, "was": c["name"], "src": c["src"], "start": a, "end": b, "note": c["note"], "id": c["id"]})
print(json.dumps(out, indent=0))
