# Cat Atlas: work in progress

A new Catdoku game, not on the site yet. A country lights up on the world map, with a clue such as "Where's the lynx?" (a wild cat that lives there), and the player names the country. "Cat Atlas" is a working name.

Playable preview (the owner's artifact): https://claude.ai/artifact/JcXFSEy8b4zZwfZA2wJNn5. Republish to that same URL by passing it as `url` (read it first).

## Decisions the owner made

| Topic | Decision |
|---|---|
| Clues | Wild cats by plain species name, never a name that gives the country away ("lynx", not "Iberian lynx") |
| Countries with no native wild cat (45, mostly islands) | "Where did the **housecat** migrate?" |
| Walkthrough, step 2 | "A cat is hiding in its native environment." |
| Mascot | None |
| Levels | A 15-step ladder: Easy 1–5 (pick from 4 names), Medium 1–5 (type, with a list of all 200 country names), Hard 1–5 (type, no list). The 5 steps are geography, as below |
| Moving up | A gold paw (all 10 found on the first try, no hints, no Restart) moves up one level |

| Step | Countries asked | Easy's 3 wrong names (same continent) |
|---|---|---|
| 1 | Large (over 500,000 km²) | Far away and a different size |
| 2 | Large and medium (over 100,000 km²) | Far away |
| 3 | Adds small (over 10,000 km²), no islands | One near neighbour, two random |
| 4 | Everything, including tiny countries and islands | Picked from the 6 most alike (nearness plus size) |
| 5 | 7 small, tiny or island countries, plus 3 others | The 3 most alike |

The owner's reasoning: large countries are easier than medium ones, which are easier than small ones; wrong answers that are close together or of a similar size are harder; everyone is bad at islands and small countries.

## Files here

| File | What it is |
|---|---|
| `src/atlas.js` | The game script. `/*NAMES*/` and `/*SIZES*/` are filled in by the build |
| `src/atlas.css`, `src/atlas.body.html` | The page's own CSS and markup |
| `names.json` | The 200 countries (same list and codes as World Map Recall in rhymes-with-tree/mapstudy) |
| `sizes.json` | Area in km² and island flag (no land border) per country, from `scripts/sizes.py` |
| `gbif_counts.json` | GBIF wild cat records per country and species (1990 onward, sightings and camera traps only), from `scripts/gbif.py` |
| `iso2.json` | Country code to ISO 2-letter code, for GBIF |
| `scripts/build_preview.py` | Builds the artifact page: `python3 atlas/wip/scripts/build_preview.py atlas/wip . ../mapstudy` writes `atlas/wip/preview/` (ignored by git), with `world.json` copied from mapstudy |
| `scripts/play.js`, `scripts/trips.js` | Playwright checks. Wrap `preview/cat-atlas.html` in `<!doctype html><html><head><meta charset="utf-8"></head><body>…</body></html>` as `preview/test.html`, serve `preview/` on port 8766, then run them |

## The cat table (`CLUE` in `src/atlas.js`)

Each pick is a wild cat native to the country and, where GBIF has records, one recorded there. GBIF also has zoo animals and misidentifications (a serval in the Netherlands, a lion in Germany, an ocelot in Oman), so its top species wasn't taken blindly.

All 155 wild cat picks were then checked against the IUCN Red List (`scripts/iucn.py`, results in `iucn_check.json`). Changed on the owner's say-so: Burkina Faso, Nigeria and Somalia to leopard, Eswatini to serval, Libya and Morocco to caracal, Qatar and the United Kingdom to the housecat. Kept: Rwanda (lions reintroduced 2015) and Portugal (Iberian lynx reintroduced); Philippines (IUCN has no page yet for the leopard cat split that lives there); Palestine and Kosovo (rarely listed separately by IUCN).

The IUCN key is a Bearer secret in the environment's network settings, added to requests by the network itself; plain `curl https://api.iucnredlist.org/api/v4/...` works.

## Sensitive pairs

- Israel and Palestine are never each other's wrong answer on Easy (`NEVER_WITH` in `src/atlas.js`). The owner asked for this. Other pairs are waiting on the owner.
- The map data (Natural Earth, through World Map Recall's `world.json`) draws Crimea as Russia, the Golan Heights as Israel, and the Moroccan-held part of Western Sahara as Morocco, with only the eastern strip as "Western Sahara". The owner hasn't decided how to handle these.

## Still to do

1. Settle the sensitive pairs and the disputed borders with the owner.
2. Port to the site following `.claude/skills/new-game/SKILL.md` (step 3 onward): `atlas/index.html`, the map data in `atlas/`, `G.GAMES` entry, icon, README section, the `IDEAS.md` row (group Geography), build bump, PR. Ask the owner which shelf it goes on.
3. Maybe later: wild cat photos from iNaturalist (Creative Commons, needs credits).
