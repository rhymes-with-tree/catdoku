---
name: new-game
description: Add a new game to the Catdoku site, from a playable preview to a finished game page and PR. Use when the user wants to try out a game idea or have one added to the site.
---

# Adding a game

Each game is one page, `<slug>/index.html`, using the shared `games.css` and `games.js` (the `G` object).
The front page and every game's menu list the games in `G.GAMES`.

## 1. Theme

Check the README's game sections and `G.GAMES`; if an existing game already uses the same mechanic,
say which. Offer a few cat themes for the user's idea and recommend one.

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
- Lay it out like the other games (see `tunnelrun/index.html`): title and gradient stripe, games menu,
  status line, board, action buttons, then level select and New puzzle.
- Write the puzzle generator as plain functions and test it in Node: time per puzzle at every level,
  and for logic puzzles, exactly one solution.
- Before publishing, screenshot it at phone width with Playwright and script a playthrough to the win
  card (see step 5 for Playwright).

## 3. Port

Copy the structure of `tunnelrun/` or `opendoor/`: the head (BUILD check script, icons, manifest, fonts,
`games.css?v=<build>`), the action buttons (`hintBtn`, `undoBtn`, `restartBtn` or `clearBtn`, `shareBtn`,
`bestBtn`, `helpBtn`), `levelSel` and `newBtn`. `games.js` itself looks up `games`, `msg`, `timer`,
`board`, `overlay` and `card`, and names `newBtn`'s label in the note after "Admire my board".

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
  Door!: a hint, Undo, Restart or Clear costs the gold paw; a hint also keeps the player on the same
  level, and a win without one moves up. Tunnel Run: `gold: !game.undid && !game.hinted`,
  `goldWhy: "No hints or undos!"`.
- **Share links:** the Share button opens `G.shareCard({name, won, puzzle, progress})`. On load and on
  `hashchange`, call `G.readShare(slug)`, then `G.offerShare(d, {name, inProgress, open, after})`.
  `readShare` only returns data with `g` equal to the slug and a truthy `N`; check every other field
  before using it. A puzzle opened with progress isn't timed (`game.timed = false`).
- **How to play:** a first-visit walkthrough with `G.spotlight({grid, w, h, steps, done})`, and the How
  to play button plays it again. There's no rules card, so every rule, control and tip goes in a step.
  When there's no puzzle out to show it on, call `G.helpLater()`. The w × h
  squares fill `grid`'s client box unless a `map` function says where they are (see the comment above
  `spotlight` in `games.js`); Tunnel Run passes the div around its SVG. "Let's Play!" is placed in
  `grid`'s parent, which needs `position: relative` (`.wrap` has it).
- **Counting plays:** `G.track()` for new puzzles and solves ("Tunnel Run solved level 3"), and the
  GoatCounter script tag at the end of the page.
- **Toys:** a game that uses `toys/` lets players switch toys off with `G.toysOff`, `G.toyPicker` and
  `G.needToys` (see `pounce/`, `bubbles/` or `tango/`).

### Hints

Highlight what a hint will change and describe it in the message line, then make the change, and keep
the highlight up a moment so a hint that finishes the puzzle still shows what it did. Tunnel Run waits
0.9 s before turning the piece and clears the highlight 0.7 s after. Draw the highlight on top.

## 4. Housekeeping

- **Game list:** add `[name, slug, blurb, colour]` to `G.GAMES` in `games.js`.
- **Icon:** add a function to `tools/make-icons.py` and to its `ICONS` dict, then run
  `python3 tools/make-icons.py` (writes `icons/<slug>.svg`). Front-page icons load lazily, so a
  full-page screenshot can show a tile blank; check the SVG on its own.
- **README:** a section after the last game, starting "A <nth> game in `<slug>/`, a cat-themed
  <genre>: …": rules, controls, how puzzles are made, levels, hint/Undo/gold paw, timer, share link and
  cat photo. Add the game to the Gold paw and Share lists under "Across every game", and to Help if its
  rule differs.
- **Build:** replace the current build string (`YYYY-MM-DD.N`) everywhere it appears (`version.txt`,
  every page's BUILD, every `?v=`) with a new one: today's date with `.1`, or the next number if the
  current string is already today's. Pages reload when `version.txt` doesn't match their BUILD.

## 5. Test

Serve the repo and drive it with Playwright at about 400 × 860. Load Playwright with
`require("/opt/node-tools/node_modules/playwright")`; it finds Chromium through
`PLAYWRIGHT_BROWSERS_PATH`, so `chromium.launch()` needs no options. Check:

- the walkthrough plays on a first visit and lines up with the board;
- Hint, Undo and Restart (or Clear) work;
- progress survives a reload;
- a share link opens the same puzzle;
- a playthrough reaches the win card, and the level moves up (or stays, after a hint);
- no page errors (failed loads of fonts, GoatCounter and cat photos are expected offline);
- the front page shows the new tile and icon.

Syntax-check the main script with `node --check` on the extracted `<script>` block. Variables don't
carry between commands, so start the server, run the tests and stop it in one command
(`python3 -m http.server 8766 & S=$!; …; kill $S`), or stop a leftover one with `fuser -k 8766/tcp`.
Don't use `pkill -f`: the pattern matches the shell running the command and kills it.

## 6. Branch and PR

Branch `claude/<slug>` from `main`, unless the session names a branch to use. One commit, described
like the earlier game commits (what the game is, how puzzles are made, levels, features, build bump).
Push and open a PR. Don't subscribe to or watch it; the user merges when ready.
