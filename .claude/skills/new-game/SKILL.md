---
name: new-game
description: Add a new game to the Catdoku site, from a playable preview to a finished game page and PR. Use when the user wants to try out a game idea or have one added to the site.
---

# Adding a game

Each game is one page, `<slug>/index.html`, using the shared `games.css` and `games.js` (the `G` object).
The front page and every game's menu list the games in `G.GAMES`.

## 1. Theme

Check the README's game sections and `G.GAMES`; if an existing game already uses the same mechanic,
say which. Look the idea up in `IDEAS.md`, the list of every puzzle considered, and use its row (rules,
what it's close to, theme notes). Offer a few cat themes for the user's idea and recommend one.

Ask whether there's a particular cat the user wants as the game's mascot or star. The named cats and the
games they're meant for are in `ARTWORK.md` ("Who's who in `cats/`"); Bowtie in Tunnel Run is the example
to follow (the cat in the game, its run, the gold-paw card, the tagline and the front-page icon).

Look for art the site already has before drawing anything new, and say what you'd reuse:

- **Shared files:** `cats/` (photos and the curled-up napping cats from Sunbeams), `toys/` (the toy library),
  `colorways.js` (Yarn's and Twirl's colourways) and `cattower.js` (carpet colours, perch pieces, sisal posts
  and napping cats, from Catwalk and High Perch).
- **Colours:** use the site's palette for anything new: the colours in `games.css` (`:root`, and the seven in
  `--gradient`: brick, coral, gold, lime, sage, pacific blue and plum, plus periwinkle, spring blue and
  lavender), or tints and shades of them (`color-mix` with white or ink). `colorways.js` and the toys are
  drawn from it too. Don't bring in new hues; a soft or pastel version is a tint of a palette colour.
- **Other games' pages:** drawings that live in one page, such as Night Light's cat heads, Open the Door!'s
  running cat, Tunnel Run's tunnels or Knock It Off's table things. When a new game wants one, move it into a
  shared file (as `cattower.js` was) and point both games at it, rather than copying it.

## 2. Preview

Build a standalone page in the scratchpad and publish it as an artifact before changing the repo. Load
the `artifact-design` skill before the first publish. The user plays it and asks for changes; republish
the same file path so the link stays the same.

- Write the page without `<!DOCTYPE>`, `<html>`, `<head>` or `<body>`; the artifact adds them. Start
  with `<title>`, the Baloo 2 font link, and one `<style>` holding `games.css` and the page's own CSS.
  Then the markup, `games.js` in a `<script>` (and `colorways.js` if the game uses it), and the page's
  script.
- An artifact can't reach the rest of the site or other hosts. Pictures from `cats/` or `toys/` show
  only if embedded as `data:` URIs, the win card's cat photo (TheCatAPI) doesn't load, the games menu
  links go nowhere, and share links don't work (only a bare `#token` reaches the page). Hide the games
  menu, the Share button and the win card's "Share my result".
- Lay it out like the other games (see `tunnelrun/index.html`): title, gradient stripe and a tagline
  (the same words as the game's blurb in `G.GAMES`), games menu, status line, board (with any key or
  number pad just under it), action buttons, then level select and New puzzle.
- Write the puzzle generator as plain functions and test it in Node: time per puzzle at every level,
  and for logic puzzles, exactly one solution.
- Before publishing, screenshot it at phone width with Playwright and script a playthrough to the win
  card (see step 5 for Playwright).

## 3. Port

Copy the structure of `tunnelrun/` or `opendoor/`: the head (BUILD check script, icons, manifest, fonts,
`games.css?v=<build>`), the action buttons and the settings row.

- **Buttons, in this order on every page:** `hintBtn` (Hint), `undoBtn` (Undo), `restartBtn` (always
  labelled Restart, never Clear), then the game's own buttons (Flip, Notes, Mark…), then `shareBtn`,
  `toysBtn` if it uses toys, `bestBtn` (Best times) and `helpBtn` (How to play). Leave out what the game
  doesn't have, but don't reorder. Undo also answers Ctrl+Z / ⌘Z.
- **Settings row** (`.bar`, under the buttons): `levelSel` labelled "Level" (or `size` labelled "Size"),
  then `newBtn` (New puzzle, or a themed name: New box, New room…). Switches and extra pickers go in a
  second row, `<div class="bar toggles">`, each in a `<div class="opt">` with a
  `<span class="hint">` line saying what it does (see `yarn/` or `patches/`). `games.js` itself looks up `games`, `msg`, `timer`,
`board`, `overlay` and `card`, and names `newBtn`'s label (or `restartBtn`'s, if there's no `newBtn`) in
its notes.

- **Menu:** `G.nav(slug)`.
- **Puzzles:** `G.builder([fns…], "entry")` makes them in a Web Worker; `take(n)` returns a promise of
  one and `prefetch(n)` makes the next in advance. The entry function gets `n` (the level) and may
  return a falsy value to have it called again. The worker gets only the source of the listed
  functions, so list every function they call and keep constants inside them. If the worker can't run,
  the page calls the entry function itself, so it must be a top-level `function` declaration.
- **Timer and best times:** spread `G.freshClock()` into each new game object; `G.checkClock(game)` on a
  reopened one; `G.setupTimer({name, game, playing, save, label, noun: "level"})` once; `G.finishClock`
  on a win. Bests are kept by `game.level` (or `game.N` without levels). The clock starts on a
  pointerdown or keydown inside `#board`; controls outside it (a number pad) set `game.started = true`
  themselves. The Best times button calls `G.showBests(title, level)`.
- **Saving:** `G.load`/`G.save` under `catdoku.<slug>.v1`. Reopen a save inside `G.reopen(fn, fresh)`;
  if `fn` throws, `fresh(message)` should start a new puzzle and show the message.
- **Winning:** `G.winCard(text, onNext, admire, result, {title, gold, goldWhy, next, after})`, with
  `after: G.otherSize($("levelSel"), next, startLevel, "Or play a different level:")`. When `gold` is
  true the card's title is "Gold paw!", so `title` only shows on other wins. Gold paw rules
  differ by game (README, "Across every game"). For a logic puzzle, follow Tunnel Run and Open the
  Door!: a hint, Undo or Restart costs the gold paw; a hint also keeps the player on the same level, and
  a win without one moves up. Say so on the win card: "You had a hint, so here's another at level N." Tunnel Run: `gold: !game.undid && !game.hinted`,
  `goldWhy: "No hints or undos!"`.
- **Share links:** the Share button opens `G.shareCard({name, won, puzzle, progress})`. On load and on
  `hashchange`, call `G.readShare(slug)`, then `G.offerShare(d, {name, inProgress, open, after})`.
  `readShare` only returns data with `g` equal to the slug and a truthy `N`; check every other field
  before using it. A puzzle opened with progress isn't timed (`game.timed = false`).
- **How to play:** a first-visit walkthrough with `G.spotlight({grid, w, h, steps, done})`, and the How
  to play button plays it again. There's no rules card, so every rule, control and tip goes in a step,
  ending with "Stuck? Hint …" pointing at `hintBtn`. Keep it succinct: one short line per step (a few
  words, under about ten), one idea each, and only the steps a new player needs; leave out anything
  the board already makes obvious. It must work at any point in an unfinished puzzle:
  a step that changes the board for show (`enter`/`leave`) puts back exactly what was there, and once
  the player has started, steps point at their own pieces rather than revealing part of the answer
  (see `copycat/` and `unravel/`). If something is still moving or loading, wait and try again rather
  than refusing; a timed game pauses first (see `tailchase/`). Only when the puzzle is finished, call
  `G.helpLater()`. The w × h
  squares fill `grid`'s client box unless a `map` function says where they are (see the comment above
  `spotlight` in `games.js`); Tunnel Run passes the div around its SVG. "Let's Play!" is placed in
  `grid`'s parent, which needs `position: relative` (`.wrap` has it).
- **Counting plays:** `G.track()` for new puzzles and solves ("Tunnel Run solved level 3"), and the
  GoatCounter script tag at the end of the page.
- **Toys:** a game that uses `toys/` lets players switch toys off with `G.toysOff`, `G.toyPicker` and
  `G.needToys` (see `pounce/`, `bubbles/` or `tango/`).

### Hints

A hint shows; it never makes the move (README, "Across every game"). Mark what to look at (gold for where
to go, red for a mistake), say in the message line what to do there, and leave the player to do it.
Tunnel Run puts a box round a piece that's the wrong way round and says so for 3.5 s.

- **Visible without animation.** `games.css` turns every animation off when the device asks for reduced
  motion, so a mark that only pulses or glows disappears (Night Light's did). Use the shared steady
  styles, which pulse on top only when motion is allowed: `.hintsq` (an SVG box or ring), `.hintline`
  (an SVG line) and `.hintcell` (a tint on an HTML square), each with `.bad` for red. Draw the mark on
  top of the board, but under anything it would hide, such as a number badge.
- **How long.** Keep it up for about 5 s, and take it down as soon as the board changes: store the
  board's state with the mark and draw it only while they still match (see `yarn/` or `sunbeams/`).
- **What to show.** Work from the game's own solver or stored answer: first a mistake if there is one
  (in red), otherwise the next move, preferring the one with the fewest options. If no hint can be found,
  say why in the message line rather than doing nothing.
- **Bookkeeping.** Set `game.hinted = true` and save; disable `hintBtn` once the puzzle is won.

## 4. Housekeeping

- **Game list:** add `[name, slug, blurb, colour, shelf, search words, added date]` to `G.GAMES` in `games.js`, with the added date as today's date (`"YYYY-MM-DD"`). The daily challenge leaves a new game out until the first cycle that starts at least 3 days later, so there's time to fix things first. The shelf is
  one of the keys in `G.GROUPS` (logic, numbers, lines, words, teasers, quick, travels: shown as Cat Logic, Cat Math, Cat
  Trails, Cat Spells, Curious Cat, Kitten Play and Cat Travels); the search words are the puzzle it's
  based on and other names for it ("minesweeper mines"), so the search boxes on the front page and in the games menu
  find it.
- **Icon:** add a function to `tools/make-icons.py` and to its `ICONS` dict, then run
  `python3 tools/make-icons.py` (writes `icons/<slug>.svg`). Front-page icons load lazily, so a
  full-page screenshot can show a tile blank; check the SVG on its own.
- **README:** a section after the last game, starting "A <nth> game in `<slug>/`, a cat-themed
  <genre>: …": rules, controls, how puzzles are made, levels, hint/Undo/gold paw, timer, share link and
  cat photo. Add the game to the Gold paw and Share lists under "Across every game", and to Help if its
  rule differs.
- **Ideas list:** keep `IDEAS.md` up to date with every decision, in the same PR. Set the game's row to
  Built, name it "<Game> (<puzzle it's based on>)", and move it below the Idea rows of its group; add a row
  if the game wasn't listed. When two ideas become one game, merge their rows; when an idea becomes a mode
  or levels of an existing game, mark it Built and say where (Notes); drop rows the user rules out; and note
  new ideas, themes or changes of plan that come up while talking it through.
- **Build:** replace the current build string (`YYYY-MM-DD.N`) everywhere it appears (`version.txt`,
  every page's BUILD, every `?v=`) with a new one: today's date with `.1`, or the next number if the
  current string is already today's. Pages reload when `version.txt` doesn't match their BUILD.

## 5. Test

Serve the repo and drive it with Playwright at about 400 × 860. Load Playwright with
`require("/opt/node-tools/node_modules/playwright")`; it finds Chromium through
`PLAYWRIGHT_BROWSERS_PATH`, so `chromium.launch()` needs no options. Check:

- the walkthrough plays on a first visit and lines up with the board;
- the buttons and settings are in the standard order (step 3);
- Hint, Undo (and Ctrl+Z) and Restart work, and following hints alone reaches the win at every level;
- hint marks show with `reducedMotion: "reduce"` on the page;
- How to play works partway through a puzzle and leaves the progress as it was;
- progress survives a reload;
- a share link opens the same puzzle;
- a playthrough reaches the win card, and the level moves up (or stays, after a hint);
- no page errors (failed loads of fonts, GoatCounter and cat photos are expected offline);
- the front page shows the new tile and icon.

Save screenshots and test scripts in the scratchpad, not the repo, so they don't end up in the commit.
Syntax-check the main script with `node --check` on the extracted `<script>` block. Variables don't
carry between commands, so start the server, run the tests and stop it in one command
(`python3 -m http.server 8766 & S=$!; …; kill $S`), or stop a leftover one with `fuser -k 8766/tcp`.
Don't use `pkill -f`: the pattern matches the shell running the command and kills it.

## 6. Branch and PR

Branch `claude/<slug>` from `main`, unless the session names a branch to use. One commit, described
like the earlier game commits (what the game is, how puzzles are made, levels, features, build bump).
Push and open a PR, and give the user the link. That's the end: nobody else reviews or comments, and the
user approves and merges it. Don't offer to watch it, subscribe to it or schedule check-ins.
