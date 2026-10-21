# Catlas: work in progress

A new Catdoku game, not on the site yet, for a new Cat Travels shelf ("Countries, maps and places"). A country lights up on the world map, with a clue such as "Where's the lynx?" (a wild cat that lives there), and the player names the country. 

Playable preview (the owner's artifact): https://claude.ai/artifact/JcXFSEy8b4zZwfZA2wJNn5. Republish to that same URL by passing it as `url` (read it first).

## Decisions the owner made

| Topic | Decision |
|---|---|
| Clues | Wild cats by plain species name, never a name that gives the country away ("lynx", not "Iberian lynx") |
| Countries with no native wild cat (45, mostly islands) | "Where did the **housecat** migrate?" |
| Mascot | None |
| Levels | Easy / Medium / Hard: the owner's lists in `difficulty_by_owner.tsv` (`tiers.json`). Trips mix: Easy 10 Easy; Medium 7 Medium + 3 Easy; Hard 6 Hard + 3 Medium + 1 Easy. The US, Mexico, Canada, Russia, Brazil, Australia, India and China are never asked on Hard |
| Regions | World, or a region; where a continent is short at a level it's paired: Easy offers Americas, Europe & Africa, Asia & Oceania (Easy Americas adds Panama and Jamaica); Medium offers Americas, Africa, Europe, Asia & Oceania; Hard offers all five (Americas, Africa, Asia, Europe, Australia and Oceania) |
| Answer style | Always the player's choice: Pick (4 names, easier), List (default), Type (no list, harder). Doesn't affect moving up or the gold paw; best times and the shared result name it ("Medium · Pick") |
| Pick's wrong answers | Same continent. Easy: other Easy places, spread out, of other sizes; Medium: one near neighbour and two others; Hard: the nearest look-alikes |
| Tries | 2 per place, then it's shown and counts as missed |
| Moving up | No hints and no Restart, and: 8+ on the first try, or 7 and any bonus, or all 10 found within their tries. Otherwise the same level and region again. Gold paw: 10 on the first try, no hints |
| Pairs kept apart on Pick | Countries that both claim land the map stripes: Russia–Ukraine, Israel–Syria, Morocco–Western Sahara, India–Pakistan, India–China, Sudan–South Sudan, plus Israel–Palestine |
| Disputed territory round | A separate mode (Round: Disputed land), written without the owner's review at their request. 24 places in `DISPUTES` (`src/atlas.js`), shapes in `dz.json` from `scripts/dz_shapes.py`. Each is a sentence with blanks (the place, then the countries), filled in any order from one box (or chips on Pick, or the list); 3 wrong guesses and the sentence is shown; each other name for the place is a bonus. Sentences say who controls and who claims, never who's right |
| Walkthrough | "A cat is hiding here." / how to answer / "You get two tries for each." / "Drag or pinch the map to look around." / answer style / Hint |

The owner's reasoning: large countries are easier than medium ones, which are easier than small ones; wrong answers that are close together or of a similar size are harder; everyone is bad at islands and small countries.

## Files here

| File | What it is |
|---|---|
| `src/atlas.js` | The game script. `/*NAMES*/` and `/*SIZES*/` are filled in by the build |
| `src/atlas.css`, `src/atlas.body.html` | The page's own CSS and markup |
| `names.json` | The 200 countries (same list and codes as World Map Recall in rhymes-with-tree/mapstudy) |
| `deps.json` | The 45 territories: code to [name, country it belongs to] |
| `difficulty_by_owner.tsv` | The owner's own difficulty for each place (Easy, Medium, Difficult), one row per place in the game; `tiers.json` is the same as codes, used by the game |
| `sizes.json` | Area in km² and island flag (no land border) per country, from `scripts/sizes.py` |
| `gbif_counts.json` | GBIF wild cat records per country and species (1990 onward, sightings and camera traps only), from `scripts/gbif.py` |
| `iso2.json` | Country code to ISO 2-letter code, for GBIF |
| `scripts/build_preview.py` | Builds the artifact page: `python3 atlas/wip/scripts/build_preview.py atlas/wip . ../mapstudy (the third argument is no longer used)` writes `atlas/wip/preview/` (ignored by git), with `world_un.json` copied in as `world.json`, and `disputed.json` |
| `scripts/play.js`, `scripts/trips.js` | Playwright checks. Wrap `preview/cat-atlas.html` in `<!doctype html><html><head><meta charset="utf-8"></head><body>…</body></html>` as `preview/test.html`, serve `preview/` on port 8766, then run them |

## The cat table (`CLUE` in `src/atlas.js`)

Each pick is a wild cat native to the country and, where GBIF has records, one recorded there. GBIF also has zoo animals and misidentifications (a serval in the Netherlands, a lion in Germany, an ocelot in Oman), so its top species wasn't taken blindly.

All 155 wild cat picks were then checked against the IUCN Red List (`scripts/iucn.py`, results in `iucn_check.json`). Changed on the owner's say-so: Burkina Faso, Nigeria and Somalia to leopard, Eswatini to serval, Libya and Morocco to caracal, Qatar and the United Kingdom to the housecat. Kept: Rwanda (lions reintroduced 2015) and Portugal (Iberian lynx reintroduced); Philippines (IUCN has no page yet for the leopard cat split that lives there); Palestine and Kosovo (rarely listed separately by IUCN).

The IUCN key is a Bearer secret in the environment's network settings, added to requests by the network itself; plain `curl https://api.iucnredlist.org/api/v4/...` works.

## Sensitive pairs

- Pairs kept apart on Pick: see the table above (`NEVER_WITH` in `src/atlas.js`).
- Borders follow the UN (the owner's call). World Map Recall's `world.json` draws Crimea as Russia, the Golan Heights as Israel and the Moroccan-held part of Western Sahara as Morocco; `scripts/un_borders.py` (needs shapely) moves them to Ukraine, Syria and Western Sahara (and the Chagos Islands to Mauritius, per the 2019 UN General Assembly vote) using Natural Earth's `ne_50m_admin_0_breakaway_disputed_areas.geojson`, writing `world_un.json`, the game's map. `sizes.json` is measured from it.
- Western Sahara keeps its plain name and Somaliland stays part of Somalia, as the UN has them (the owner's call).
- Disputed land is drawn with grey stripes and a dashed edge, with a "Disputed" key on the map. The owner's rule: stripe land where the map, drawn the UN's way, and whoever actually runs it disagree; or a region split by a ceasefire line where the UN takes no view on which side is whose. The Koreas and Palestine are not striped (reasons in `scripts/disputed.py`) but go in the disputed round. Applied in `scripts/disputed.py`, written to `disputed.json`: Crimea, Donetsk, Luhansk (Natural Earth's 2014 lines), Golan Heights, Northern Cyprus, Somaliland, Abkhazia, South Ossetia, Transnistria, Abyei, the Kashmir areas, Aksai Chin, Arunachal Pradesh and the small India–China valleys, and all of Western Sahara. Not striped: Kosovo, Taiwan, Palestine, the Kuril Islands, the Ilemi Triangle, the Guyana/French Guiana–Suriname headwaters, Junagadh, Nagorno-Karabakh (Azerbaijan has run it since 2023), the Falklands.
- A "disputed territory" round (the owner's idea): a fill-in-the-blank sentence per place ("___ is controlled by ___ and claimed by ___"), one answer box, each right guess fills its blank; bonus points for naming every other name a place goes by (all names accepted). Everything disputed goes in, unstriped ones too (the Kurils, Kosovo, Taiwan, the Koreas, Israel and Palestine, Belize–Guatemala, the Falklands…). Built (see the table above).

## Territories

Quizzed alongside the 200 countries (the owner's choice): every place with an ISO country code of its own, 45 of them, in `deps.json` (code, name, the country it belongs to). Places without their own code stay with their country: Alaska, Hawaii, the Canaries, the Azores, Madeira. `scripts/un_borders.py` splits French Guiana, Guadeloupe, Martinique, Réunion, Mayotte, Svalbard, Bonaire/Sint Eustatius/Saba and Tokelau out of France, Norway, the Netherlands and New Zealand, so they don't light up with them. The Chagos Islands are quizzed as Mauritius's (UN view).

- The territory's name alone is a right answer; naming its country too is a bonus. Hard and Medium take both typed at once ("Greenland (Denmark)"); otherwise a bonus question follows ("which country does Greenland belong to?": 4 choices on Easy, the country list on Medium, typing on Hard), one try, with "Skip the bonus". The win card counts bonuses.
- Clues: housecat for most; jaguar for French Guiana and leopard cat for Hong Kong (both checked with IUCN); "Where's the cat exploring where no one lives?" for South Georgia, Heard and McDonald, the French Southern Lands, and Ashmore and Cartier.
- Sizes use the same tiers as countries, so territories join the ladder by size like any country.

## Cat photos

The owner is restyling the iNaturalist photos (`cat-photos/CREDITS.md`, `cat-photos/contact-sheet.jpg`) to match the site's art, like Fred and Jan Brady. When they come back, show them with the clues: one per wild species (the black panther is a black leopard), and the site's own cats from `cats/` for the housecat and the cat exploring where no one lives. Keep the credits, on a credits card or in `ARTWORK.md`.

## Still to do

1. Add the owner's restyled cat pictures.
2. Port to the site following `.claude/skills/new-game/SKILL.md` (step 3 onward): `atlas/index.html`, the map data in `atlas/`, `G.GAMES` entry, icon, README section, the `IDEAS.md` row (group Geography), build bump, PR. Ask the owner which shelf it goes on.
3. Maybe later: wild cat photos from iNaturalist (Creative Commons, needs credits).
