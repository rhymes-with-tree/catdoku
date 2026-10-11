---
name: new-game
description: Add a new game to the Catdoku family, from picking an idea through a playable preview to a finished game page and PR. Use when the user wants ideas for new games, wants to try one out, or wants one added to the site.
---

# Adding a game to Catdoku

Each game is one HTML page in its own folder (`<slug>/index.html`), sharing `games.css` and `games.js`.
Work in this order: idea, preview, port, housekeeping, test, PR. The user plays on a phone, so judge
everything at phone width.

## 1. Pick the idea

- Read the README's game sections and `G.GAMES` in `games.js` first. Compare **mechanics**, not
  themes: what the player actually does (place, sort, slide, unbury, push, connect, fill numbers).
  Rush Hour got turned down because Toy Box is already "move things out of the way to free what's
  behind", even though one sorts and the other slides.
- Describe each candidate by its plain genre name and a well-known example the user will recognise
  (an app, a newspaper puzzle, Simon Tatham's collection, LinkedIn or NYT games). Don't theme the list
  until the user has picked one.
- Then offer a few cat themes for the chosen one, and recommend one.

## 2. Preview it as an artifact

Before touching the repo, build a standalone, playable page in the scratchpad and publish it as an
artifact, so the user can try it and ask for changes.

- Copy the suite look: Baloo 2, the `games.css` tokens (`--paper`, `--panel`, `--ink`…), title with
  the gradient stripe, status line, board, action buttons, then the level select and new-puzzle button.
- Write the puzzle generator as plain functions and test it in Node first: speed at every size, and
  (for logic puzzles) exactly one answer every time.
- Screenshot it with Playwright (`executablePath: '/opt/pw-browsers/chromium'`), including a scripted
  playthrough to the win, before publishing. Republish to the same file path after each change so the
  link stays the same.
- Expect a few rounds of changes to how it looks and feels. Keep the board calm: contrast between what's
  done and what isn't, without extra decoration.

## 3. Port it into the repo

Model the page on a recent game (`opendoor/` or `tunnelrun/` are good templates): same head (the
BUILD check script, icons, fonts, `games.css?v=`), same markup ids, and the same set of features:

- `G.nav(slug)` for the games menu.
- Puzzles from `G.builder([fns…], "entry")`, which runs them in a Web Worker. The worker only gets the
  listed functions' source, so they must not use top-level `const`s or helpers that aren't in the list.
  Put constants inside the functions.
- `G.setupTimer`, `G.freshClock`, `G.finishClock`, `G.checkClock`, and a Best times button (`G.showBests`).
- Saved progress under `catdoku.<slug>.v1` with `G.load`/`G.save`, reopened through `G.reopen`.
- The win card with `G.winCard` (cat photo, gold paw, next level, `G.otherSize`). A clean win moves up a
  level; a hint keeps you on the same level and costs the gold paw. Undo is free but also costs the gold paw.
- Share links (`G.shareCard`, `G.readShare`, `G.offerShare`, and the `hashchange` listener). Validate
  everything read from a link.
- How to play: a card (`G.openCard`) with "Show me on the board", and a first-visit walkthrough with
  `G.spotlight`. Its `grid` must be an HTML element (not an `<svg>`) that the squares fill, and its
  parent must be `position:relative` (`.wrap` already is).
- `G.track(...)` for new puzzles and solves, and the GoatCounter script at the bottom.

### Hints

A hint should show the player what it's about to change before it changes it: highlight the square
or piece for about a second, say what's wrong in the message line, then make the change. If the
hint finishes the puzzle, the player still gets to see which piece it was. Make sure the highlight
is never hidden under something else on the board.

## 4. Housekeeping

- Add `[name, slug, blurb, colour]` to `G.GAMES` in `games.js`. The front page and the games menu
  pick it up from there.
- Add an icon function to `tools/make-icons.py` (a small picture of the board) and run
  `python3 tools/make-icons.py`. Check it renders by loading the SVG in an `<img>`. The front page
  lazy-loads icons, so a full-page screenshot can show the last tile blank even when it's fine.
- README: a section for the game ("A <nth> game in `<slug>/`…", in the same plain style as the others),
  and add the game to the gold-paw and share lists under "Across every game".
- Bump the build: replace the old build string with a new one (`YYYY-MM-DD.N`, today's date) in
  `version.txt` and every page (the BUILD script and every `?v=`).

## 5. Test in a browser

Serve the repo (`python3 -m http.server`) and drive it with Playwright at about 400 × 860:

- the walkthrough plays on a first visit and lines up with the board;
- Hint, Undo and Restart/Clear work;
- progress survives a reload;
- a share link opens the same puzzle;
- a playthrough by tapping reaches the win card, and the level moves up (or stays, after a hint);
- no page errors;
- the front page shows the new tile with its icon.

Syntax-check the page's main script with `node --check` on the extracted `<script>` block. To stop the
server afterwards, don't use `pkill -f` with a pattern that also matches your own shell command.

## 6. Branch and PR

Branch `claude/<slug>`, one commit in the style of the earlier game commits (what it is, how puzzles are
made, levels, features, build bump), push, then open a PR when the user asks for one.
