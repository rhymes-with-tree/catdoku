# the owner's second round of Keeps from Clip Bench (2026-11-15): name each, cut it; long ones (purrs, yawns) keep
# their length with a longer fade, and Yawn Snore fades out over its last second as the owner asked
import json, glob, os, re, subprocess, sys
K = "/tmp/claude-0/-home-user-catdoku/a42e1b09-02b5-51f8-a6f3-2547bf4b5974/scratchpad/keeps2/cuts/"
U = "/root/.claude/uploads/a42e1b09-02b5-51f8-a6f3-2547bf4b5974/"
OUT = sys.argv[1]
NAMES = {  # id: (key, kind, name)
 "pchirp1": ("mew", "chirp", "Mew (purr-chirp)"), "cmwh35nomw2i": ("mrrow-01", "chirp", "Mrrow 1"), "cmwh312it3t6": ("mrrow-02", "chirp", "Mrrow 2"),
 "pchirp2": ("chirp-purr-04", "chirp", "Chirp-purr 4"), "pchirp3": ("chirp-purr-05", "chirp", "Chirp-purr 5"), "pchirp4": ("chirp-purr-06", "chirp", "Chirp-purr 6"),
 "cmwh32h8eihj": ("chirp-purr-07", "chirp", "Chirp-purr 7"), "cmwh3a2a2msh": ("hiss-2", "hiss", "Hiss 2"),
 "cmwh30kmiwxl": ("purr-short-01", "purr", "Short purr 1"), "cmwh353ado52": ("purr-short-02", "purr", "Short purr 2"), "cmwh3188u280": ("purr-short-03", "purr", "Short purr 3"),
 "purr2": ("purr-soundmary", "purr", "Purr (soundmary)"), "purr3": ("purr-kitty", "purr", "Kitty purr"),
 "purr1": ("purr-monique-01", "purr", "Monique's purr 1"), "cmwh3rtubnbi": ("purr-monique-02", "purr", "Monique's purr 2"), "purr5": ("purr-daphne", "purr", "Daphne's purr"),
 "cmwh3girsyro": ("purr-snore", "purr", "Purr and snore"),
 "cmwh3oo81wi6": ("yawn-monique", "yawn", "Yawn (Monique)"), "yawn1": ("yawn-snore", "yawn", "Yawn and snore"),
 "cmwh3ity7vtr": ("yawn-purr-wash", "yawn", "Yawn, purr and wash"), "cmwh3mzjsp7a": ("yawn-purr-chirpy-snore", "yawn", "Yawn, purr and chirpy snore"),
 "cmwh33il7zdp": ("collar-jingle", "toy", "Collar jingle"),
}
toys = sorted([os.path.basename(f)[:-5] for f in glob.glob(K + "*.json") if json.load(open(f))["src"] == "594132"], key=lambda i: json.load(open(K + i + ".json"))["start"])
for n, i in enumerate(toys): NAMES[i] = (f"toy-play-{n + 1:02d}", "toy", f"Toy play {n + 1}")
out = []
for i, (key, kind, name) in NAMES.items():
    c = json.load(open(K + i + ".json")); a, b = c["start"], c["end"]; d = b - a; f = glob.glob(U + "*" + c["src"] + "*")[0]
    fo = 1.0 if i == "yawn1" else .3 if d > 3 else .06; fi = .05 if d > 3 else .008
    pk = subprocess.run(["ffmpeg", "-v", "info", "-ss", str(a), "-t", str(d), "-i", f, "-ac", "1", "-af", "volumedetect", "-f", "null", "-"], capture_output=True, text=True).stderr
    gain = -3 - float(re.search(r"max_volume: (-?[\d.]+) dB", pk).group(1))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(a), "-t", str(d), "-i", f, "-ac", "1", "-ar", "44100",
      "-af", f"volume={gain}dB,afade=t=in:d={fi},afade=t=out:st={max(0, d - fo):.3f}:d={fo}", "-b:a", "96k", f"{OUT}/{key}.mp3"], check=True)
    out.append({"key": key, "kind": kind, "name": name, "was": c["name"], "src": c["src"], "start": a, "end": b, "note": c["note"], "id": i})
print(json.dumps(out, indent=0))
