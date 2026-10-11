---
name: new-game
description: Add a new game to the Catdoku site, from a playable preview to a finished game page and PR. Use when the user wants to try out a game idea or have one added to the site.
---

# Adding a game

Each game is one page, `<slug>/index.html`, using the shared `games.css` and `games.js` (the `G` object).
The front page and every game's menu list the games in `G.GAMES`. Check layouts at about 400 px wide.

Steps: theme, preview, port, housekeeping, test, branch and PR.

## 1. Theme

The user brings the idea. Check the README's game sections and `G.GAMES`, and if an existing game
already uses the same mechanic, say which. Offer a few cat themes and recommend one.

## 2. Preview

Build a standalone page in the scratchpad and publish it as an artifact before changing the repo.
The user plays it and asks for changes; republish to the same file path so the link stays the same.

- Inline `games.css` and `games.js`; an artifact can't load the site's files, so cat photos and toy
  pictures won't show unless embedded.
- Lay it out like the other games (see `tunnelrun/index.html`): title and gradient stripe, status line,
  board, action buttons, then level select and New puzzle.
- Write the puzzle generator as plain functions and test it in Node: time per puzzle at every level,
  and for logic puzzles, exactly one solution.
- Before publishing, screenshot it at phone width with Playwright and script a playthrough to the win
  card. Playwright: `/opt/node22/lib/node_modules/playwright/index.mjs`, launched with
  `executablePath: "/opt/pw-browsers/chromium"`.

## 3. Port

Copy the structure of `tunnelrun/` or `opendoor/`: the head (BUILD check script, icons, manifest, fonts,
`games.css?v=<build>`), the element ids (`games`, `msg`, `timer`, `board`, `overlay`, `card`, `levelSel`,
`newBtn`, `hintBtn`, `undoBtn`, `restartBtn`, `shareBtn`, `bestBtn`, `helpBtn`), and these pieces:

- **Menu:** `G.nav(slug)`.
- **Puzzles:** `G.builder([fns…], "entry")` makes them in a Web Worker; `take(n)` returns a promise of
  one and `prefetch(n)` makes the next in advance. The worker gets only the source of the listed
  functions, so list every function they call and keep constants inside them. If the worker can't run,
  the page calls the entry function itself, so it must also be a top-level function on the page.
- **Timer and best times:** spread `G.freshClock()` into each new game object; `G.checkClock(game)` on a
  reopened one; `G.setupTimer({name, game, playing, save, label, noun: "level"})` once; `G.finishClock`
  on a win. The Best times button calls `G.showBests(title, level)`.
- **Saving:** `G.load`/`G.save` under `catdoku.<slug>.v1`. Reopen a save inside `G.reopen(fn, fresh)`,
  which starts a new puzzle if it throws.
- **Winning:** `G.winCard(text, onNext, admire, result, {title, gold, goldWhy, next, after})`, with
  `after: G.otherSize($("levelSel"), next, startLevel, "Or play a different level:")`. Any help (hint,
  Undo, Restart or Clear) costs the gold paw; a hint also keeps the player on the same level, and a win
  without one moves up. Tunnel Run: `gold: !game.undid && !game.hinted`, `goldWhy: "No hints or undos!"`.
- **Share links:** the Share button opens `G.shareCard`. On load and on `hashchange`, call
  `G.readShare(slug)`, then `G.offerShare(d, opts)`. `readShare` only returns data with `g` equal to the
  slug and a truthy `N`; check every other field before using it.
- **How to play:** a card (`G.openCard`) whose first button, "Show me on the board", replays the
  walkthrough, and a first-visit walkthrough with `G.spotlight({grid, w, h, steps, done})`. The w × h
  squares fill `grid`'s client box, unless a `map` function says where they are (see the comment above
  `spotlight` in `games.js`). Tunnel Run passes the div around its SVG. "Let's Play!" is placed in
  `grid`'s parent, which needs `position: relative` (`.wrap` has it).
- **Counting plays:** `G.track()` for new puzzles and solves ("Tunnel Run solved level 3"), and the
  GoatCounter script tag at the end of the page.
- **Toys:** a game that uses `toys/` lets players switch toys off with `G.toysOff`, `G.toyPicker` and
  `G.needToys` (see `pounce/` or `bubbles/`).

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
  every page's BUILD, every `?v=`) with a new one: today's date, `.1` for the first that day. Pages
  reload when `version.txt` doesn't match their BUILD.

## 5. Test

Serve the repo (`python3 -m http.server 8766`) and drive it with Playwright at about 400 × 860. Check:

- the walkthrough plays on a first visit and lines up with the board;
- Hint, Undo and Restart (or Clear) work;
- progress survives a reload;
- a share link opens the same puzzle;
- a playthrough reaches the win card, and the level moves up (or stays, after a hint);
- no page errors;
- the front page shows the new tile and icon.

Syntax-check the main script with `node --check` on the extracted `<script>` block. Stop the server by
its PID (`kill $!`), not `pkill -f`: the pattern matches the shell running the command and kills it.

## 6. Branch and PR

Branch `claude/<slug>` from `main`. One commit, described like the earlier game commits (what the game
is, how puzzles are made, levels, features, build bump). Push and open a PR. Don't subscribe to or watch
it; the user merges when ready.
