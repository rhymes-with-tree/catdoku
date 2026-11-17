#!/usr/bin/env python3
"""Pull Catdoku's GoatCounter numbers into the Pawprints dashboard's data files.

Usage: python3 -I pull.py OUT_DIR [--days 28] [--week 7]

Writes, each as {"rows": [...], "meta": [...]}:
  daily.json   one row a day: game pages opened, and moments sent (events)
  games.json   one row a game, the last WEEK days: opens, puzzles started, solved, lost
  visits.json  the shape of a visit (since 2026-11-17): what visits open on, the first game, puzzles in a row
  errors.json  the errors the games sent ("Error: ..."), by day

GoatCounter counts each page or moment once a visit, so every number is a count of visits. The API key is added by
the session's proxy (rhymes-with-tree.goatcounter.com is a connected service), so none is needed here. Days are the
site's own (New York time), as on the GoatCounter dashboard.
"""
import json, os, re, sys, time, urllib.request
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

API = "https://rhymes-with-tree.goatcounter.com/api/v0"
TZ = ZoneInfo("America/New_York")
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))

START_RE = re.compile(r"\b(started|new (puzzle|tangle|table|trip|board|floor|tower|round|skein|keyboard))\b", re.I)   # games.js
# what each game sends on a win and on a loss (their G.track calls; a moment that's neither isn't counted)
SOLVED_RE = re.compile(r"\b(solved|won|done|finished|complete|dyed|cleared|untangled|genius)\b", re.I)
LOST_RE = re.compile(r"\b(fell|out of (moves|swaps)|stuck|overflowed|gave up|lost|over|missed|caught|woke the human|piled up|tangled|put out)\b", re.I)
VISIT_RE = re.compile(r"^(Visit opened on|First game): (.+)$")
ROW_RE = re.compile(r"^(.+) in a row: (.+)$")


def get(path, **q):
    url = API + path + "?" + "&".join(f"{k}={v}" for k, v in q.items())
    for attempt in range(8):
        try:
            with urllib.request.urlopen(url, timeout=60) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 429:   # rate limited: a few requests a second
                time.sleep(1 + attempt)
                continue
            raise
    raise RuntimeError(f"GoatCounter kept refusing {path}")


def games_list():
    """[(name, slug, colour, shelf, beta)] from games.js, so the names match the site's."""
    src = open(os.path.join(REPO, "games.js"), encoding="utf-8").read()
    out = []
    for block, beta in (("GAMES", False), ("BETA", True)):
        m = re.search(r"const %s = \[(.*?)\n  \];" % block, src, re.S)
        for g in re.finditer(r'\[\s*"([^"]+)",\s*"([^"]+)",\s*"[^"]*",\s*"(#[0-9A-Fa-f]{6})",\s*"([a-z]+)"', m.group(1)):
            out.append((g.group(1), g.group(2), g.group(3), g.group(4), beta))
    return out


def norm(s):
    return re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    out_dir = sys.argv[1]
    days = int(sys.argv[sys.argv.index("--days") + 1]) if "--days" in sys.argv else 28
    week = int(sys.argv[sys.argv.index("--week") + 1]) if "--week" in sys.argv else 7
    os.makedirs(out_dir, exist_ok=True)

    today = datetime.now(TZ).date()
    first = today - timedelta(days=days - 1)
    week_from = today - timedelta(days=week - 1)
    start = datetime.combine(first, datetime.min.time(), TZ).astimezone(timezone.utc)
    end = datetime.combine(today + timedelta(days=1), datetime.min.time(), TZ).astimezone(timezone.utc)
    q = dict(start=start.strftime("%Y-%m-%dT%H:%M:%SZ"), end=end.strftime("%Y-%m-%dT%H:%M:%SZ"), limit=100, daily="true")

    # every page and moment, with its count for each day
    rows, seen = [], []
    while True:
        page = get("/stats/hits", **q, **({"exclude_paths": ",".join(map(str, seen))} if seen else {}))
        new = [h for h in page["hits"] if h["path_id"] not in seen]
        rows += new
        seen += [h["path_id"] for h in new]
        if not page.get("more") or not new:
            break
        time.sleep(0.5)

    def by_day(h):
        return {s["day"]: s.get("daily") or 0 for s in h.get("stats", [])}

    day_list = [(first + timedelta(days=i)).isoformat() for i in range(days)]
    week_days = set(d for d in day_list if d >= week_from.isoformat())

    # 1. each day: game pages opened (pages under /catdoku/, the front page too) and moments
    daily = {d: {"day": d, "pages": 0, "moments": 0} for d in day_list}
    for h in rows:
        if not h["event"] and not h["path"].startswith("/catdoku"):
            continue   # another site on the same counter
        for d, n in by_day(h).items():
            if d in daily:
                daily[d]["moments" if h["event"] else "pages"] += n

    # 2. each game, the last week
    games = games_list()
    by_slug = {g[1]: g for g in games}
    names = sorted(((norm(g[0]), g) for g in games), key=lambda x: -len(x[0]))   # longest first: Pounce Up before Pounce

    def game_of(event):
        e = norm(event)
        for n, g in names:
            if e == n or e.startswith(n + " "):
                return g
        return None

    def error_game(p):
        """The game an error came from, by the page's address in it ("laserpointer/:393"); games.js is every game's."""
        p = p.replace("github.io/catdoku/", "/").replace("catdoku/games.js", "games.js")
        slugs = [t for t in re.findall(r"([a-z0-9]+)/", p) if t in by_slug]
        return by_slug[slugs[-1]][0] if slugs else ("Every game (games.js)" if "games.js" in p else "")

    stats = {g[1]: {"game": g[0], "slug": g[1], "colour": g[2], "shelf": g[3], "beta": g[4],
                    "opens": 0, "started": 0, "solved": 0, "lost": 0} for g in games}
    visits, errors = [], []
    for h in rows:
        week_n = sum(n for d, n in by_day(h).items() if d in week_days)
        all_n = sum(by_day(h).values())
        p = h["path"]
        if not h["event"]:
            m = re.match(r"^/catdoku/([a-z0-9]+)/?$", p)
            if m and m.group(1) in stats:
                stats[m.group(1)]["opens"] += week_n
            continue
        if p.startswith("Error"):
            for d, n in by_day(h).items():
                if n:
                    errors.append({"day": d, "message": p[len("Error: "):] if p.startswith("Error: ") else p, "count": n,
                                   "game": error_game(p)})
            continue
        v, r = VISIT_RE.match(p), ROW_RE.match(p)
        if v and all_n:
            visits.append({"kind": "Opened on" if v.group(1) == "Visit opened on" else "First game", "label": v.group(2), "run": "", "count": all_n})
            continue
        if r and all_n:
            visits.append({"kind": "In a row", "label": r.group(1), "run": r.group(2), "count": all_n})
            continue
        g = game_of(p)
        if not g or not week_n or p.startswith("Daily challenge") or "feedback sent" in p or "Favorited" in p:
            continue
        s = stats[g[1]]
        if START_RE.search(p):
            s["started"] += week_n
        elif SOLVED_RE.search(p):
            s["solved"] += week_n
        elif LOST_RE.search(p):
            s["lost"] += week_n

    game_rows = sorted((s for s in stats.values() if s["opens"] or s["started"]), key=lambda s: (-s["opens"], -s["started"], s["game"]))
    for s in game_rows:
        s["solve_rate"] = round(s["solved"] / s["started"], 2) if s["started"] else None
    visits.sort(key=lambda v: (v["kind"], -v["count"], v["label"]))
    errors.sort(key=lambda e: (e["day"], e["message"]), reverse=True)

    code = open(__file__, encoding="utf-8").read()
    window = f"{first.isoformat()} to {today.isoformat()}"
    week_window = f"{week_from.isoformat()} to {today.isoformat()}"
    pulled = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    def meta(what, win):
        return [{"label": "pull.py", "value": code, "type": "code", "lang": "python"},
                {"label": "Input", "value": f"GoatCounter API, /stats/hits, {win} (New York days)"},
                {"label": "Counts", "value": what}, {"label": "Pulled", "value": pulled}]

    files = {
        "daily.json": ([daily[d] for d in day_list], meta("Visits that opened a game page or the front page (pages), and moments the games sent (moments), each once a visit", window)),
        "games.json": (game_rows, meta("Visits that opened each game, and its moments: started (a new puzzle or level), solved (solved, won, done, finished) and lost (fell, out of moves, stuck, overflowed, gave up)", week_window)),
        "visits.json": (visits, meta("The visit tally's moments, since they began on 2026-11-17", window)),
        "errors.json": (errors, meta("Moments named 'Error: ...', which the games send when something throws", window)),
    }
    for name, (rws, mt) in files.items():
        with open(os.path.join(out_dir, name), "w", encoding="utf-8") as f:
            json.dump({"rows": rws, "meta": mt}, f, ensure_ascii=False)
        print(f"{name}: {len(rws)} rows")
    print(f"window {window}, week {week_window}")


if __name__ == "__main__":
    main()
