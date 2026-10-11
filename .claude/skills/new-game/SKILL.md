---
name: new-game
description: Add a new game to the Catdoku site, from choosing an idea through a playable preview to a finished game page and PR. Use when the user wants ideas for new games, wants to try one out, or wants one added to the site.
---

# Adding a game

Each game is one page, `<slug>/index.html`, using the shared `games.css` and `games.js` (the `G` object).
The front page (`index.html`) and every game's menu list the games from `G.GAMES`. The user plays on a
phone, so check layouts at about 400 px wide.

Order: idea, preview, port, housekeeping, test, branch and PR.

## 1. Idea

- Read the README's game sections and `G.GAMES` in `games.js`. Compare candidates with the existing
  games by mechanic (what the player does: place, sort, slide, rotate, connect, fill in numbers), not
  by theme, and say when an existing game already uses a candidate's mechanic.
- Name each candidate by its genre and a well-known example the user will recognise (Simon Tatham's
  Puzzles, an NYT or LinkedIn game, a popular app). Leave themes out until the user picks one.
- Then offer a few cat themes for the chosen game and recommend one.

## 2. Preview

Build a standalone page in the scratchpad and publish it as an artifact before changing the repo.

- Inline `games.css` and `games.js`: an artifact can't load files from the site. The win card's cat
  photo won't load inside an artifact either.
- Use the suite layout, as in `tunnelrun/index.html`: title with the gradient stripe, status line,
  board, action buttons, then the level select and new-puzzle button.
- Write the puzzle generator as plain functions and test it in Node: time per puzzle at every level,
  and for logic puzzles, exactly one solution every time.
- Before publishing, screenshot it at phone width with Playwright and script a playthrough to the win
  card. Playwright is installed globally (`/opt/node22/lib/node_modules/playwright`), with Chromium at
  `/opt/pw-browsers/chromium`.
- Republish to the same file path after each change, so the link stays the same.

## 3. Port

Copy the structure of `tunnelrun/` or `opendoor/`: the head (BUILD check script, icons, manifest,
fonts, `games.css?v=<build>`), the element ids (`levelSel`, `newBtn`, `hintBtn`, `undoBtn`, `restartBtn`,
`shareBtn`, `bestBtn`, `helpBtn`, `msg`, `timer`, `overlay`, `card`), and these features:

- **Menu:** `G.nav(slug)`.
- **Puzzles:** `G.builder([fns…], "entry")` builds them in a Web Worker and can prefetch the next one.
  The worker receives only the source of the listed functions, so they can't use top-level constants
  or helpers missing from the list (list `shuffle` too; put constants inside the functions).
- **Timer and best times:** spread `G.freshClock()` into each new game object; call `G.checkClock` on a
  reopened game, `G.setupTimer({name, game, playing, save, label, noun})` once (`label` and `noun:
  "level"` make Best times list levels), and `G.finishClock` on a win. The Best times button calls
  `G.showBests`.
- **Saving:** `G.load`/`G.save` under `catdoku.<slug>.v1`, reopened through `G.reopen(fn, fresh)`, which
  starts a new puzzle if the save can't be opened.
- **Winning:** `G.winCard(text, onNext, admire, result, {title, gold, goldWhy, next, after})`, with
  `after: G.otherSize($("levelSel"), next, startLevel, "Or play a different level:")`. Decide which help
  keeps the player on the same level and which actions cost the gold paw. In Tunnel Run a hint keeps
  the level; a hint, Undo or Restart costs the gold paw; a win without a hint moves up a level.
- **Share links:** the Share button opens `G.shareCard`; on load and on `hashchange`, `G.readShare(slug)`
  then `G.offerShare`. `readShare` only accepts data with `g` equal to the slug and a truthy `N`, so
  include both; check every other field before using it.
- **How to play:** a card (`G.openCard`) whose first button, "Show me on the board", replays the
  walkthrough, and a first-visit walkthrough with `G.spotlight({grid, w, h, steps, done})`. By default
  the w × h squares are taken to fill `grid`'s `clientWidth` and `clientHeight`; an `<svg>` has none, so
  pass a `map` function instead (see the comment above `spotlight` in `games.js`). `grid`'s parent must be
  `position: relative` (`.wrap` is), because the "Let's Play!" overlay is placed in it.
- **Counting plays:** `G.track()` for new puzzles and solves ("Tunnel Run solved level 3"), and the
  GoatCounter script tag at the end of the page.
- **Toy pictures:** a game that uses `toys/` can let players switch toys off with `G.toysOff`,
  `G.toyPicker` and `G.needToys` (see `pounce/` or `bubbles/`).

### Hints

Show what a hint will change before changing it: highlight the square or piece, describe it in the
message line, then make the change, and keep the highlight up briefly afterwards so a hint that finishes
the puzzle still shows which piece it was. Tunnel Run highlights for 0.9 s before turning the piece and
0.7 s after. Draw the highlight above everything else on the board.

## 4. Housekeeping

- **Game list:** add `[name, slug, blurb, colour]` to `G.GAMES` in `games.js`.
- **Icon:** add a function to `tools/make-icons.py`, add it to the `ICONS` dict at the bottom, and run
  `python3 tools/make-icons.py` (it writes `icons/<slug>.svg`). The front page lazy-loads icons, so a
  full-page screenshot can show the last tile blank; check the SVG by loading it in an `<img>`.
- **README:** a section after the last game, starting "A <nth> game in `<slug>/`, a cat-themed
  <genre>: …", covering the rules, controls, how puzzles are made, levels, hint/Undo/gold paw, and the
  timer, share link and cat photo. Add the game to the Gold paw and Share lists under "Across every
  game", and to Help if its rule differs.
- **Build:** replace the current build string (`YYYY-MM-DD.N`) with a new one (today's date) in
  `version.txt` and every page: each BUILD script and every `?v=`. Pages reload when `version.txt` no
  longer matches their BUILD.

## 5. Test

Serve the repo (`python3 -m http.server`) and drive it with Playwright at about 400 × 860. Check:

- the walkthrough plays on a first visit and lines up with the board;
- Hint, Undo and Restart (or Clear) work;
- progress survives a reload;
- a share link opens the same puzzle;
- a playthrough by tapping reaches the win card, and the level moves up (or stays, after a hint);
- there are no page errors;
- the front page shows the new tile with its icon.

Syntax-check the page's main script with `node --check` on the extracted `<script>` block. To stop the
server, don't use `pkill -f` with a pattern that also matches your own shell command.

## 6. Branch and PR

Branch `claude/<slug>`. Make one commit with a message like the earlier game commits (what the game
is, how puzzles are made, levels, features, build bump), push, and open a PR only when the user asks.
