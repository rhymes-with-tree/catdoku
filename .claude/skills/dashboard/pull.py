#!/usr/bin/env python3
"""Pull Catdoku's GoatCounter numbers into the Pawprints dashboard's data files.

Usage: python3 -I pull.py OUT_DIR

Writes, each as {"rows": [...], "meta": [...]}, every day GoatCounter has (the dashboard picks the days to show):
  daily.json      one row a day: game pages opened, and moments sent (events)
  game_days.json  one row a game a day it was played: opens, puzzles started, solved, lost
  visits.json     the shape of a visit (since 2026-11-17), a row a day: what visits open on, the first game, puzzles in a row
  errors.json     the errors the games sent ("Error: ..."), a row a day
  levels.json     one row a game a level a day: started, solved, lost

GoatCounter counts each page or moment once a visit, so every number is a count of visits. The API key is added by
the session's proxy (rhymes-with-tree.goatcounter.com is a connected service), so none is needed here. Days are the
site's own (New York time), as on the GoatCounter dashboard.
"""
import json, os, re, sys, time, urllib.request
from datetime import date, datetime, timedelta, timezone
from zoneinfo import ZoneInfo

API = "https://rhymes-with-tree.goatcounter.com/api/v0"
TZ = ZoneInfo("America/New_York")
SINCE = date(2026, 9, 1)   # before the counter's first day, so every day it has is pulled
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))

START_RE = re.compile(r"\b(started|new (puzzle|tangle|table|trip|board|floor|tower|round|skein|keyboard|game|case))\b", re.I)   # games.js
# what each game sends on a win and on a loss (their G.track calls; a moment that's neither isn't counted)
# (Cat Burglar: "caught" is a win, "got away" a loss; its "round over …: 2 caught" is neither)
SOLVED_RE = re.compile(r"\b(solved|won|done|finished|complete|dyed|cleared|untangled|genius|caught)\b", re.I)
LOST_RE = re.compile(r"\b(fell|out of (moves|swaps)|stuck|overflowed|gave up|got away|lost|over|missed|woke the human|piled up|tangled|put out)\b", re.I)
NEITHER_RE = re.compile(r"\bround over\b", re.I)
LEVEL_RE = re.compile(r"\blevel (\d+)\b", re.I)
VISIT_RE = re.compile(r"^(Visit opened on|First game|Visit length|Games in a visit): (.+)$")
AFTER_RE = re.compile(r"^After (.+): (.+)$")
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
    os.makedirs(out_dir, exist_ok=True)

    today = datetime.now(TZ).date()
    first = SINCE
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
        return {s["day"]: s.get("daily") or 0 for s in h.get("stats", []) if s.get("daily")}

    # 1. each day: game pages opened (pages under /catdoku/, the front page too) and moments
    daily = {}
    for h in rows:
        if not h["event"] and not h["path"].startswith("/catdoku"):
            continue   # another site on the same counter
        for d, n in by_day(h).items():
            row = daily.setdefault(d, {"day": d, "pages": 0, "moments": 0})
            row["moments" if h["event"] else "pages"] += n
    if daily:   # every day from the first counted one to today, with the quiet days as 0
        d, last = date.fromisoformat(min(daily)), today
        while d <= last:
            daily.setdefault(d.isoformat(), {"day": d.isoformat(), "pages": 0, "moments": 0})
            d += timedelta(days=1)

    # 2. each game, each day
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

    game_days, visits, errors, levels = {}, {}, [], {}

    def gd(g, d):
        return game_days.setdefault((g[1], d), {"day": d, "slug": g[1], "game": g[0], "shelf": g[3], "colour": g[2], "beta": g[4],
                                                "opens": 0, "started": 0, "solved": 0, "lost": 0})

    for h in rows:
        p, days = h["path"], by_day(h)
        if not h["event"]:
            m = re.match(r"^/catdoku/([a-z0-9]+)/?$", p)
            if m and m.group(1) in by_slug:
                for d, n in days.items():
                    gd(by_slug[m.group(1)], d)["opens"] += n
            continue
        if p.startswith("Error"):
            for d, n in days.items():
                errors.append({"day": d, "message": p[len("Error: "):] if p.startswith("Error: ") else p, "count": n, "game": error_game(p)})
            continue
        v, r, a = VISIT_RE.match(p), ROW_RE.match(p), AFTER_RE.match(p)
        if v or r or a:
            # kinds: Opened on, First game, In a row (label the game, run how many), Played next (label the game
            # before, run the game after), Visit length, Games in a visit
            if r:
                kind, label, run = "In a row", r.group(1), r.group(2)
            elif a:
                kind, label, run = "Played next", a.group(1), a.group(2)
            else:
                kind = {"Visit opened on": "Opened on"}.get(v.group(1), v.group(1))
                label, run = v.group(2), ""
            for d, n in days.items():
                key = (d, kind, label, run)
                visits[key] = {"day": d, "kind": kind, "label": label, "run": run, "count": visits.get(key, {}).get("count", 0) + n}
            continue
        g = game_of(p)
        if not g or p.startswith("Daily challenge") or "feedback sent" in p or "Favorited" in p:
            continue
        f = None if NEITHER_RE.search(p) else "started" if START_RE.search(p) else "solved" if SOLVED_RE.search(p) else "lost" if LOST_RE.search(p) else None
        if f:
            for d, n in days.items():
                gd(g, d)[f] += n
            lv = LEVEL_RE.search(p)
            if lv and "endless" not in p.lower():   # each numbered level, for where people stop
                for d, n in days.items():
                    key = (d, g[1], int(lv.group(1)))
                    row = levels.setdefault(key, {"day": d, "slug": g[1], "game": g[0], "shelf": g[3], "level": int(lv.group(1)), "started": 0, "solved": 0, "lost": 0})
                    row[f] += n

    code = open(__file__, encoding="utf-8").read()
    window = f"{min(daily) if daily else first.isoformat()} to {today.isoformat()}"
    pulled = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    def meta(what):
        return [{"label": "pull.py", "value": code, "type": "code", "lang": "python"},
                {"label": "Input", "value": f"GoatCounter API, /stats/hits, {window} (New York days)"},
                {"label": "Counts", "value": what}, {"label": "Pulled", "value": pulled}]

    files = {
        "daily.json": (sorted(daily.values(), key=lambda r: r["day"]),
                       meta("Each day: visits that opened a game page or the front page (pages), and moments the games sent (moments), each once a visit")),
        "game_days.json": (sorted(game_days.values(), key=lambda r: (r["day"], r["slug"])),
                           meta("Each game, each day it was played: visits that opened it, and its moments: started (a new puzzle or level), solved (solved, won, done, finished, cleared…) and lost (fell, out of moves, stuck, overflowed, gave up…)")),
        "visits.json": (sorted(visits.values(), key=lambda r: (r["day"], r["kind"], r["label"], r["run"])),
                        meta("Each day: the visit tally's moments, which began on 2026-11-17 (Played next, Visit length and Games in a visit on 2026-11-18)")),
        "levels.json": (sorted(levels.values(), key=lambda r: (r["day"], r["slug"], r["level"])),
                        meta("Each game's numbered levels, each day: visits that started, solved and lost each level (Endless left out)")),
        "errors.json": (sorted(errors, key=lambda e: (e["day"], e["message"]), reverse=True),
                        meta("Each day: moments named 'Error: ...', which the games send when something throws")),
    }
    for name, (rws, mt) in files.items():
        with open(os.path.join(out_dir, name), "w", encoding="utf-8") as fh:
            json.dump({"rows": rws, "meta": mt}, fh, ensure_ascii=False, separators=(",", ":"))
        print(f"{name}: {len(rws)} rows, {os.path.getsize(os.path.join(out_dir, name)) // 1024} KB")
    print(f"window {window}")


if __name__ == "__main__":
    main()
