---
name: new-game
description: Add a new game to the Catdoku site, from a playable preview to a finished game page and PR. Use when the user wants to try out a game idea or have one added to the site.
---

# Adding a game

Each game is one page, `<slug>/index.html`, using the shared `games.css` and `games.js` (the `G` object).
The front page and every game's menu list the games in `G.GAMES`.

**Access is never a reason to drop or shrink an idea.** The owner is always happy to add network access, connectors
or other permissions a game needs (a museum's API, an image host, a data source). When something is blocked, or a
better option needs access the session doesn't have, don't work around it or rule it out: say exactly what to add
(each host name, such as `collectionapi.metmuseum.org` and `images.metmuseum.org`, or the connector) and what it
would make possible, then carry on with whatever doesn't depend on it.

**Word data from Wiktionary:** a cloud session can't use Wiktionary's own API (`en.wiktionary.org` answers 429, too
many requests, even when it's allowed: cloud sessions share addresses). This has come up more than once. Use
kaikki.org instead, which is already allowed: it publishes Wiktionary as JSON, one word at a time
(`https://kaikki.org/dictionary/English/meaning/c/ch/chrono-.jsonl`) or all English in one file
(`kaikki.org-dictionary-English.jsonl`, about 3.4 GB; stream it through a filter rather than saving it). The
site's pages can still look words up on Wiktionary while you play (`G.meaning`), since that runs on the player's
device, not in the session.

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
  drawn from it too. Don't bring in new hues; a soft or pastel version is a tint of a palette colour. For anything
  outside the board (status line, trays, labels), use the variables (`--ink`, `--ink-soft`, `--panel`, `--paper`,
  `--line`, `--star`, `--gold-text`, `--bad-text`) rather than hex, so it follows Dark Mode (step 3, "Apple's guidelines").
- **Other games' pages:** drawings that live in one page, such as Night Light's cat heads, Open the Door!'s
  running cat, Tunnel Run's tunnels or Knock It Off's table things. When a new game wants one, move it into a
  shared file (as `cattower.js` was) and point both games at it, rather than copying it.

## 2. Preview

Build a standalone page in the scratchpad and publish it as an artifact before changing the repo. Load
the `artifact-design` skill before the first publish. The user plays it and asks for changes; republish
the same file path so the link stays the same.

- Write the puzzle generator as plain functions and test it in Node: time per puzzle at every level,
  and for logic puzzles, exactly one solution.
- **A Next preview shows the piece after the one in play**, never the one the player is already holding or
  dropping (Wind Up and L-M-N-O-Pom both first showed the same piece twice). Count from the piece in play: if
  `game.i` is the piece in play (or the one about to come in), Next is `game.i + 1`, whatever the step in between,
  and it's redrawn every time a new piece comes in.
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
- Before publishing, screenshot it with Playwright at the small phone sizes, not only at a roomy phone width:
  an iPhone SE upright (375 × 553) and sideways (667 × 323, with the board on the left: step 3, "Sideways"), and
  the first SE (320 × 460). Script a playthrough
  to the win card too (step 5 says how to load Playwright).

## 3. Port

Branch `claude/<slug>` from `main` before changing anything in the repo, unless the session names a branch to use.

Copy the structure of `tunnelrun/` or `opendoor/`: the head (BUILD check script, icons, manifest, fonts,
`games.css?v=<build>`), the action buttons and the settings row. `games.js` itself looks up `games`, `msg`,
`timer`, `board`, `overlay` and `card`, and names `newBtn`'s label (or `restartBtn`'s, if there's no `newBtn`)
in its notes.

- **Buttons, in this order on every page:** `hintBtn` (Hint), `undoBtn` (Undo), `restartBtn` (always
  labelled Restart, never Clear), then the game's own buttons (Flip, Notes, Mark…), then `linkBtn` (labelled Share; content
  blockers hide anything whose id or class has "share" in it, so never use the word there),
  `toysBtn` if it uses toys, `bestBtn` (Best times) and `helpBtn` (How to play). Leave out what the game
  doesn't have, but don't reorder. `games.js` turns them into icons with the word small underneath (its `ICON_OF`
  table, by id): give a new kind of button an icon there (or `data-icon` where an id means something else in this
  game), and change a button's word with `G.relabel(btn, words, icon)`, never `textContent`, or the icon goes.
  The game's ☆ goes just after its name in the title by itself. Undo also answers Ctrl+Z / ⌘Z (but not with Shift). Restart always puts
  back this same puzzle as it was dealt; `newBtn` deals a different one. Every game has Share, and New unless
  levels are a fixed list.
- **Settings row** (`.bar`, under the buttons): `levelSel` labelled "Level" (or `size` labelled "Size"),
  then `newBtn` (New puzzle, or a themed name: New box, New room…). Switches and extra pickers go in a
  second row, `<div class="bar toggles">`, each in a `<div class="opt">` with a
  `<span class="hint">` line saying what it does (see `yarn/` or `patches/`).

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
  true the card's title is "Gold paw!", so `title` only shows on other wins. A gold paw on the top level or size masters the
  game (its tile gets a gold Mastered label); the win card works that out from `result.n` and the page's level or size picker,
  so pass `top: true` or `false` if the game's levels aren't the picker's values (see `atlas/`). Gold paw rules
  differ by game (README, "Across every game"). For a logic puzzle, follow Tunnel Run and Open the
  Door!: a hint, Undo or Restart costs the gold paw; a hint also keeps the player on the same level, and
  a win without one moves up. Say so on the win card: "You had a hint, so here's another at level N." Tunnel Run: `gold: !game.undid && !game.hinted`,
  `goldWhy: "No hints or undos!"`. An Audit, if the game has one, never costs a life: like a hint, it keeps the
  player on the same level and costs the gold paw.
- **Share links:** the Share button opens `G.shareCard({name, won, puzzle, progress})`. A game played against
  the clock (Pounce, Bubbles, Tail Chase) leaves out `progress` and passes `what` ("board", "rug"…), so the card
  shares only the level as dealt; keep a copy of it as dealt for that and for Restart (see `pounce/`). A shared
  puzzle opens in place of the saved one rather than racing a puzzle still being built. On load and on
  `hashchange`, call `G.readShare(slug)`, then `G.offerShare(d, {name, inProgress, open, after})`.
  `readShare` only returns data with `g` equal to the slug and a truthy `N`; check every other field
  before using it. A puzzle opened with progress isn't timed (`game.timed = false`).
- **How to play:** a first-visit walkthrough with `G.spotlight({grid, w, h, steps, done})`, and the How
  to play button plays it again. There's no rules card, so every rule, control and tip goes in a step,
  ending with "Stuck? Hint …" pointing at `hintBtn`. Keep it succinct: one short line per step (six
  words or fewer, like "One 🐱 in every row" or "Tap twice for a 🐱"), one idea each, and only the steps a new player needs; leave out anything
  the board already makes obvious. Follow Apple's onboarding guidance (`HIG.md`, "Onboarding"):
  - **Brief:** the first visit at most about six steps. `G.spotlight` keeps back, on a first visit, every step that only
    points at a button or setting in `.actions`, `.bar` or `.toggles` (by id, or an id inside it) and shows each later
    as a one-off tip, so write those as steps of their own (no `lit`, `marks` or `enter`), each pointing at one control
    with an id. The board and its rules make up the first visit.
  - **Interactive:** one step, early on, where the player does the main move on the real board: `try: {done, yes, tip}`
    on a step with `lit` squares (only they take taps; it waits until `done()` is true, then says `yes` in green and goes
    on). Use `G.yourTurn(() => game, g => { game = g; }, redraw)`: `...turn.from` on each step of a run of them and
    `...turn.upTo` on the last, and the game goes back exactly as it was (clock, lives, undo and all), so nothing is
    given away or lost; a first move that gives nothing away (the first, always-safe box) may be kept instead. Mark
    rarer rules and gold-paw details `later: true` (How to play only). If a game's input ignores taps while a `.spot`
    is up, let `.spot.trying` through (see `keyboardcat/`).
  - **Optional:** every walkthrough has Skip and a row of dots (shared); don't add your own.
  - **Switches:** a step pointing at an on/off switch in `.toggles` (Auto check…) is never in the walkthrough;
    `G.spotlight` keeps it and shows it once, the first time the switch is turned on. Write it for that moment
    ("Auto grade: a wrong 🐱 costs a life").
  - **Bookmark** (`G.guesser`, ids `guessBtn` and `backBtn`) is labelled Bookmark and Back to bookmark, never Guess.
  - **Few words around it too:** "Tap to go on" shows on the first step only, and an interactive step needs no
    extra line (its `tip` is optional); let the lit squares and the dots do the talking. It must work at any point in an unfinished puzzle:
  a step that changes the board for show (`enter`/`leave`) puts back exactly what was there, and once
  the player has started, steps point at their own pieces rather than revealing part of the answer
  (see `copycat/` and `unravel/`). If something is still moving or loading, wait and try again rather
  than refusing; a timed game pauses first (see `tailchase/`). Only when the puzzle is finished, call
  `G.helpLater()`. The w × h
  squares fill `grid`'s client box unless a `map` function says where they are (see the comment above
  `spotlight` in `games.js`); Tunnel Run passes the div around its SVG. "Let's Play!" is placed in
  `grid`'s parent, which needs `position: relative` (`.wrap` has it).
- **Losing:** every card that ends a game without a win (out of lives, out of moves, no room, piled up, and
  so on) ends its buttons with `G.homeBtn()` ("Back to the front page"), as the win card does, so there's
  always a way home: `btns.push(G.homeBtn())` before `G.openCard(...)`, or `G.homeBtn()` last in the list.
- **Win streaks:** `G.finishClock` adds a win and the win card shows the streak, and a new puzzle made with
  `G.freshClock()` while one is started ends it. Call `G.breakStreak()` wherever the player loses (out of lives,
  moves or time, giving up).
- **Counting plays:** `G.track()` for new puzzles and solves ("Tunnel Run solved level 3"), and the
  GoatCounter script tag at the end of the page.
- **Toys:** a game that uses `toys/` lets players switch toys off with `G.toysOff`, `G.toyPicker` and
  `G.needToys` (see `pounce/`, `bubbles/` or `tango/`).

### Hints

A hint shows; it never makes the move (README, "Across every game"). Mark what to look at (gold for where
to go, red for a mistake), say in the message line what to do there, and leave the player to do it.
Every game's hint goes through `G.hinter` (see `toydoku/` or `sunbeams/`).

- **Visible without animation.** `games.css` turns every animation off when the device asks for reduced
  motion, so a mark that only pulses or glows disappears (Night Light's did). Use the shared steady
  styles, which pulse on top only when motion is allowed: `.hintsq` (an SVG box or ring), `.hintline`
  (an SVG line) and `.hintcell` (a tint on an HTML square), each with `.bad` for red. Draw the mark on
  top of the board, but under anything it would hide, such as a number badge.
- **How long.** `const hints = G.hinter({game: () => game, key: () => <the board as a string>, draw})`;
  `hints.show(mark, say)` keeps the mark up for 5 s, or until the board or the puzzle changes, and `draw`
  reads it with `hints.current()`. An Audit's marks go through it too, with `{uncounted: true}`.
- **Say more when asked again.** `hints.level()` is how many hints have been shown on this same board. Where
  there's more to say, the first shows where to look and why it's settled ("Only one toy fits in the gold
  box"), and the next names the answer (see `toydoku/`, `toebeans/`, `catwalk/`).
- **What to show.** Work from the game's own solver or stored answer: first a mistake if there is one
  (in red, adding "(and 2 more)" when there are others), otherwise the next move, preferring the one with
  the fewest options. If no hint can be found, say why in the message line rather than doing nothing.
- **Bookkeeping.** Set `game.hinted = true` and save only when a mark is shown (a hint with nothing to show
  is free); disable `hintBtn` once the puzzle is won.

### One-use helpers

A helper that can only be used so many times a level (Bubbles' Long sight, Toy Box's Shake, Bird Watch's Wipe)
goes away once it's used up: set `button.hidden = true`, never `disabled`, so there's no strip of greyed-out
buttons. Keep them in an `.actions.helpers` row; `games.css` lets the buttons that are left share the row and
hides the whole row when none are left. Bring them all back when the level starts again. (A helper that works
any time, or as often as it's needed, like Wind Up's Shake, stays and is only greyed while it can't be used.)

### Keys

Every game can be played without a mouse. A board of squares, or of spots (perches, balls, baskets), uses
`G.gridKeys({on, show, act, size | move, keys})`: the arrows move a cursor (drawn with `.kbcursor` on HTML
squares, `.kbring` in SVG, or `G.CURSOR` on a canvas), Space or Enter does what a tap does, and `keys` adds
the game's own (Notes, Mark…). For boards that aren't squares, `move` can use `G.nearestThatWay`. A game with
typing (numbers, letters) keeps its own handler, as `highperch/` does, with Escape letting go of the square
picked. The README's Keys line under "Across every game" says what Space does in each game.

### Full screen

Decide whether the game gains from a full-screen mode, and say what you found when you report. Measure the board
at the game's biggest level or size, at the four screens in step 5 (both iPhone SEs and the laptop). Boards
stop at 560 pixels (`--board`), so on a laptop most get about a third of the screen. On a phone a square board
already fills the width, so it gains little there. Full screen is worth it when any of these is true:

- the board pans or zooms (Twirl's mat, Cat Burglar's painting), so a bigger window shows more of it;
- the biggest board doesn't fit on the screen without scrolling the page (a tall mat, a 16 × 30 floor);
- on a laptop its squares or pieces are small at 560 pixels and would be much bigger with the whole screen;
- a board that isn't square would fit a wide screen far better on its side (Twirl lays its mat sideways).

Leave it out when the board is small and square and fills a phone's width, or when typing with the phone's
keyboard goes with play (it covers half the screen anyway).

To add it: a button beside the zoom controls, or in the board's corner, run by
`G.fullScreen({btn, name, change})` in `games.js`. It adds the icon, F and Escape, the browser's own full
screen where there is one, and `body.full` (the page filling the window, which is all an iPhone gets).
`games.css` puts the title and menu away; the page lays out the rest under `body.full`. In `change`, lay the
board out again to fill the room the frame now has. Keep the lives or count, the message line, Hint and the zoom
buttons on show, and put the other buttons and settings away. On a phone (`max-width:600px` or
`max-height:500px`), drop decoration round the board, and when it's held sideways move the status and buttons
into a narrow column beside the board so it gets the whole height (see `catburglar/` and `twirl/`). If the
board is turned to lie sideways, taps, the arrow keys (which still go the way they point on the screen) and the
walkthrough's squares and arrows must all be turned with it (see `shownXY` and `matXY` in `twirl/`).

### Sideways

On a phone held sideways (`(orientation:landscape) and (max-height:500px)`), every game puts its board on the left at
the screen's full height, staying put, with everything else in a column beside it that scrolls. `games.css` does
this for any page with a `.stage`: add the class to the board's box, the direct child of `main` that holds the board
and anything drawn on or around it (often `.wrap`). The rest of `main` becomes the column, where `--board` is 100%.

- **Size from `--board` (and `--tall`).** On the stage, `--board` is the box's width and `--tall` the screen's
  height, so a board sized from them fits. A box taller than it is wide sets `--aspect`, its height for each pixel
  across (`.floor{--aspect:1.29}` in `iffits/`); where that changes with the level, set it from script on the stage
  (`fuzzyspelling/`, `unravel/`). A board sized in script asks `G.sideways()` and takes its room from the stage and
  `innerHeight` (`twirl/`, `catburglar/`), and lays out again on `resize`.
- **Decorations.** A cat or picture over the board's top edge needs room inside the stage (padding-top, with
  `--tall` less that much: `pawlette/`, `twirl/`); one hanging below or beside the board, with no room for it,
  is put away there (`patches/`, `yarn/`). Padding kept for a decoration in the column goes too (`patches/`).
- **A pad or tray that goes with the board** (numbers, letters) stands beside it inside the stage, in as many columns
  as fit the height (`purrfect/`, `magnets/`), or, if it's outside the board's box, comes near the top of the column
  (`stash/`). Never let it fall below the fold: you can't play without it.
- **A board much wider than tall** adds `wide` (`.stage.wide`): it keeps the whole width under a slim row with the
  title and menu, sized to the height left; `--below` keeps room for something under it. Set `--aspect` from the
  board's real shape (`fishbones/`); a keyboard can go beside it (`upatree/`).
- **A game you aim or shoot "up"** may read better turned on its side (`bubbles/`: the cat on the left shooting
  right, with pictures and words kept upright, and taps, arrow keys and walkthrough turned with it).
- **Full screen** keeps its own layout: the shared rule only applies without `body.full`.
- A page whose board can't be one box of `main` lays it out itself in the same way (see `keyboardcat/`).

### Apple's guidelines

The site is a web app today, played in Safari or from the home screen, and it follows Apple's Human Interface
Guidelines where they fit a web page (README, "Across every game"). Keep a new game in line with them, so it would
carry over if the site ever became an app:

- **Touch targets: 44 × 44 points at least** for every control a finger uses (Apple's minimum is 28 × 28, for
  where there's truly no room). The shared buttons, pickers, stars and
  timer already are (`games.css`, "Touch targets"). A game's own controls (a number pad, a turn button, a tray of
  pieces) are 44 tall, or get an invisible 44-point square with the `hit44` class or an `::after` of their own
  (`catpile/`'s `.turnBtn`). Squares on the board at the biggest level may be smaller where the genre needs it (a
  14 × 14 Catdoku); say what size they come out on an iPhone SE when you report.
- **Dark Mode.** `games.css` has a dark set of colours. Boards keep the light set: `.board`, `.wrap` and `.stage` get it
  back, so a board drawn against the light colours looks the same either way. Everything else follows the dark set,
  and so do cards, wherever they sit. So outside the board use the variables, never hex, for words and backgrounds
  (a red word is `var(--bad-text)`, a gold one `var(--gold-text)`). Part of the board drawn in lines straight on the
  page with nothing behind it (Toe Beans' paw) takes the class `darkOk` to follow the dark set too. A colour that
  must stay dark in both (writing on a gold paw) is `#2A2530`, not `var(--ink)`.
- **Text size.** Text sizes in shared CSS are `calc(<n>px*var(--ts))`, so they follow the iPhone's text size setting
  (`textSize` in `games.js` sets `--ts`). In a game's own CSS, scale words outside the board the same way (status
  lines, a word list, a clue); leave the board's own lettering as it is. Never stop pinch to zoom (no
  `maximum-scale` or `user-scalable=no`). Nothing smaller than 11 pixels. `--ts` goes up to 1.6, so check the page at
  that size.
- **Contrast:** at least 4.5 to 1 for words and 3 to 1 for icons and the lines that matter, in light and dark.
- **VoiceOver:** every button has words or an `aria-label` (an icon alone needs a label), the board has a role and a
  label (`role="grid"` with each square labelled, as in `catdoku/`, or `aria-label` on an SVG board), and the message
  line is `aria-live="polite"`.
- **Motion:** reduce motion turns animations off (`games.css`); nothing a player needs may only show while moving
  (step 3, "Hints"), and nothing a player needs to read may go away on a timer (hints stay until the board changes).
- **Increase Contrast:** `games.css` strengthens `--ink-soft` and `--line` under `prefers-contrast: more`; colours of
  your own outside the board should do the same if they're faint.
- **Cards:** `G.openCard` makes them dialogs, and Escape presses a button starting Close, Cancel, Keep playing, Done,
  Admire or Look at, so give a card that can simply be put away one of those.
- `HIG.md` is the full review against Apple's guidelines; check a new game against its "Still to do" list too.

### Lives

Most games have none. A game that does follows Catdoku, Twirl and Toydoku: three hearts drawn as `♥` in
`.hearts` (lost ones in `<span class="lost">`), the line saying how many are left. Running out opens an "Out
of lives" card with Restart, New, "Wait, I'm only mostly dead! Mostly dead is slightly alive, folks!" for
three more (up to nine on one puzzle) and, last, `G.homeBtn()`, and a revive shows a "Slightly alive!" card saying how many revives are
left. Restart only refills lives after they've run out, so it's never a way round them. Running out or a
revive keeps the player on the same level and costs the gold paw.

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
  cat photo. Add the game to the Gold paw, Share and Keys lists under "Across every game", to the Hints list
  if a second hint says more, and to Help if its rule differs.
- **Ideas list:** keep `IDEAS.md` up to date with every decision, in the same PR. Set the game's row to
  Built, name it "<Game> (<puzzle it's based on>)", and move it below the Idea rows of its group; add a row
  if the game wasn't listed. When two ideas become one game, merge their rows; when an idea becomes a mode
  or levels of an existing game, mark it Built and say where (Notes); drop rows the user rules out; and note
  new ideas, themes or changes of plan that come up while talking it through.
- **Artwork:** add the game's cats to "Who's who in `cats/`" in `ARTWORK.md`: for a named cat, which pictures
  the game uses and where (beside the title, on the board, on the gold-paw card); for general cats, the list
  the page picks from and what each does.
- **Shared files:** a drawing moved out of another game's page into a shared file (step 1) is loaded with
  `?v=<build>` like `games.js`, gets the build bump below, and the game it came from is tested again (step 5).
- **Build:** replace the current build string (`YYYY-MM-DD.N`) everywhere it appears (`version.txt`,
  every page's BUILD, every `?v=`) with a new one: today's date with `.1`, or the next number if the
  current string is already today's. Pages reload when `version.txt` doesn't match their BUILD.

## 5. Test

Serve the repo and drive it with Playwright at about 400 × 860, and check the layout at an iPhone SE: 375 × 553
upright and 667 × 323 sideways (Safari's address bar and toolbar take the rest of its 375 × 667), and the first
SE, 320 × 460, as well as a laptop at 1280 × 720. Load Playwright with
`require("/opt/node-tools/node_modules/playwright")`; it finds Chromium through
`PLAYWRIGHT_BROWSERS_PATH`, so `chromium.launch()` needs no options. Check:

- on the iPhone SE sizes, nothing runs off the side (no sideways scroll, no button cut off), button rows wrap
  tidily at 320 wide, the board at the biggest level is big enough to tap (note its square size in pixels),
  and the page scrolls only as far as it must; take screenshots and look at them;
- sideways (step 3, "Sideways"), at 667 × 323, 844 × 390 and 932 × 430, at the game's smallest and biggest level: the
  whole board is on screen (measure it), nothing runs off the side, it stays put while the column scrolls to the
  settings, taps land on the board, a card (Best times, the win card) covers the column too, the walkthrough lines
  up, and turning the phone part-way through a puzzle (upright, then sideways, then back) lays it out as a fresh
  load would; held upright and on a laptop, the page is unchanged;
- full screen, if the game has it (step 3, "Full screen"): measure the board at each size before and after,
  taps still land on the square under the finger (also when zoomed, and when the board is turned), F and Escape
  leave it, the cards and the walkthrough show on top, and the page still opens with a puzzle saved part-way
  through (play a move, reload, and look for page errors). Test the iPhone way too, with
  `Element.prototype.requestFullscreen = undefined` in an init script (headless Chromium's own full screen also
  blocks resizing the viewport);
- the walkthrough plays on a first visit and lines up with the board, has at most about six steps there, its
  interactive step waits for the move, says so in green and puts the board back as it was (compare the game's state
  before and after), Skip ends it, and How to play plays every step;
- the buttons and settings are in the standard order (step 3);
- Hint, Undo (and Ctrl+Z) and Restart work, and following hints alone reaches the win at every level
  (pressing Hint twice where the first only shows where to look);
- the whole puzzle can be played with the keyboard;
- New deals a different puzzle and Restart puts back the same one;
- hint marks show with `reducedMotion: "reduce"` on the page;
- How to play works partway through a puzzle and leaves the progress as it was;
- progress survives a reload;
- a share link opens the same puzzle;
- a playthrough reaches the win card, and the level moves up (or stays, after a hint);
- every losing card has Back to the front page;
- a game with a Next preview: over a run of drops, Next never shows the piece in play, and each piece that comes
  in is the one Next showed just before;
- Apple's guidelines (step 3): every control outside the board is at least 44 × 44 to a finger (probe 21 pixels each
  side of its centre with `document.elementFromPoint` on a viewport tall enough to show the whole page); with
  `colorScheme: "dark"` on the context, take screenshots and look at them, and check every word against what's behind
  it (at least 4.5 to 1, worked out from the computed colours), the cards included; light mode is unchanged; with
  `--ts` set to 1.6 on the page (`document.documentElement.style.setProperty("--ts", "1.6")`, as the largest text
  setting it follows would), nothing runs off the side at 320 × 460 or sideways at 667 × 323; and each button, the board and its
  squares read out sensibly (their `aria-label`s or words);
- no page errors (failed loads of fonts, GoatCounter and cat photos are expected offline);
- the front page shows the new tile and icon;
- any game whose drawings moved to a shared file still draws and plays them;
- every colour is from the site's palette (step 1, "Colours"): list each one the page and its icon use
  (`grep -o "#[0-9A-Fa-f]\{6\}\b\|#[0-9A-Fa-f]\{3\}\b\|rgba([^)]*)" <slug>/index.html icons/<slug>.svg | sort | uniq -c`)
  and check that each is a palette colour, the ink, or a tint or shade of one (`color-mix` with white or ink, or
  `tint()` in `tools/make-icons.py`). Look out for creams, greys, browns and greens picked by eye. A colour another
  game already uses for the same thing (a toy kind's colour, the walkthrough's text) may stay; say which, and why,
  when you report. Pictures (cats, toys) keep their own colours.

Save screenshots and test scripts in the scratchpad, not the repo, so they don't end up in the commit.
Syntax-check the main script with `node --check` on the extracted `<script>` block. Variables don't
carry between commands, so start the server, run the tests and stop it in one command
(`python3 -m http.server 8766 & S=$!; …; kill $S`), or stop a leftover one with `fuser -k 8766/tcp`.
Don't use `pkill -f`: the pattern matches the shell running the command and kills it.

## 6. Commit and PR

Make one commit on the branch from step 3, described like the earlier game commits (what the game is, how puzzles are made, levels, features, build bump).
Push and open a PR, and give the user the link. That's the end: nobody else reviews or comments, and the
user approves and merges it. Don't offer to watch it, subscribe to it or schedule check-ins.
