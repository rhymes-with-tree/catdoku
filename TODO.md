# To do

Things to come back to, kept here so any chat can pick them up. Add an item when something is put aside; take it out
(in the same PR) once it's done. Game ideas go in `IDEAS.md`, and work on Apple's guidelines in `HIG.md` ("Still to do").

## Catlas: Safari still offers AutoFill Contact in the answer box

On an iPhone, typing an answer in Catlas (Type answers) brings up Safari's AutoFill Contact bar above the keyboard,
offering the player's contacts. Safari ignores `autocomplete="off"` when it decides a box belongs to a contact or
address form.

Tried (still shows, checked on the owner's iPhone after rhymes-with-tree/catdoku#216, 2026-11-02):
- `autocomplete="off"` on the box and on its form
- the placeholder changed from "Type the name" to "Your guess", and the box's name from `answer` to `guess`
- `type="search"` in place of `type="text"`

Still to try:
- take the box out of its `<form>` (handle Enter and the Go button in script); Safari looks for contact fields in forms
- `autocomplete` set to something Safari doesn't recognise (such as `autocomplete="nope"`) rather than `off`
- make the box read-only until it's tapped, then drop `readonly` on focus
- if none of that works, a `contenteditable` box styled like the input
Test each on a real iPhone: Safari's AutoFill doesn't show in the headless browser the tests use.

## Shelves: split Kitten Play once its action games arrive

Talked through with the owner on 2026-11-02, the reasoning kept so it can be weighed again. That day Toy Box, Night
Light and Pawlette moved to Curious Cat, Cat Pile to Kitten Play, and Catlas to Kitten Play, retiring Cat Travels.
Shelves live in `GROUPS` in `games.js` (with their colours in `SHELF_COLOUR`, short names in `SHORT` in `index.html`,
and colours again in `calendar/index.html`), and a game's shelf is the fifth field of its row in `GAMES`.

**The test for Curious Cat and Kitten Play.** Curious Cat ("Moves to plan and shapes to fit") gives you a fixed board
to plan your way through, and nothing new turns up while you think. Kitten Play ("Match, pop, spot and chase") keeps
bringing new things (falling toys, the next bubble, birds, the snake moving), so chance and timing count as much as
planning, and you play for a score or a level's goal rather than solving one set position; its looking games
(Copycat, Cat Burglar, Catlas) are quick rounds of spotting and finding. Cat Trails ("Join, link and route things")
holds together: every game there is drawing or routing lines. Yarn, Catwalk and Tunnel Run are logic puzzles with one
answer, but drawing lines puts them on Trails, and that's on purpose. Borderline on Curious Cat but staying: Pick of
the Pile (partly spotting pairs, still a fixed board to clear in a good order) and Shelf Life (judged by eye more than
planned).

**Don't add shelves yet.** A phone shows three tiles across, and every shelf adds a label tile and starts a new row,
so a shelf of two to four games costs a lot of screen for little. Counts on 2026-11-02, games on the site / shortlist
ideas: Cat Logic 9/3, Cat Math 6/0, Cat Trails 6/1, Cat Spells 8/5, Curious Cat 10/5, Kitten Play 11/2.

**Split Kitten Play once its action games arrive.** It's more than one kind of game sharing a shelf. Its ideas fall in
two groups:
- match and pop: Onet-style pairs, SameGame groups, a triple-tile tray; with Pounce, Bubbles, Wind Up, Mew Hue and
  Cat Pile
- action: Pawlinko (was Kitty Plinko), Paw-ball, Pounce Up, a fling game, kneading in time with the purr; with Tail Chase and Bird
  Watch, and the looking games (Copycat, Cat Burglar, Catlas) could go with them
The action group is two to five games today, too few for a shelf. Once a couple of the shortlisted ones (Pawlinko,
Paw-ball, Pounce Up) are built, split it.

**Cat Spells stays one shelf.** With its five shortlisted ideas it would have 13 games, but there's no natural split:
finding words and moving letters to make words are the same kind of game (the owner's call). Cat Math has no ideas
waiting, but six games is a fine shelf; leave it.

**Colour games, if Curious Cat gets crowded.** Cat Mat (flood fill), Shelf Life (colour gradient), Pawlette (mix
paint to order), all on Curious Cat, and Mew Hue (slide and mix paint) on Kitten Play are colour games. With its five
shortlisted ideas built, Curious Cat would be the biggest shelf at 15. If that's too many, split the colour games off
into a shelf of their own: a colour shelf of 4, leaving Curious Cat with 12. Not decided; weigh it once the shortlist
is mostly built.

With the shortlist built and both splits, the shelves would be (66 games): Cat Logic 12, Cat Math 6, Cat Trails 7,
Cat Spells 13, Curious Cat 12, colour 4, Kitten Play (match and pop) 5, action 8. Without the colour split, Curious Cat
15 and no colour shelf.

## Pawlinko: sound effects

The owner wants sound effects for Pawlinko, put aside for later (2026-11-02): a knock as each thing hits a hold,
a boing off a coil spring, a splash when coffee or water spills, a soft thump as it lands in a bed (and a sleepy
grumble from a napping cat), and a cheer for a tandem. No game on the site has sound yet, so this needs a shared way to
play it first: a Sound switch in the settings (off by default, as browsers only play sound after a tap), quiet enough
for a phone, and sounds that follow the thing's kind (a bell rings, a mug clunks, a feather makes none).



## Cross Stitch: a star cat

Cross Stitch (2026-11-06) went on the site with general cats for now (one of Purrfect Square's sitting cats beside the
title). Its samplers are mostly Gus, Peanut, Marmalade and Willow. Once the owner picks a star (or draws one), put
them beside the title and in `ARTWORK.md`, and perhaps on the gold-paw card.

## Every game's page: one layout, one menu, one set of tools (approved 2026-11-07)

Approved by the owner on 2026-11-07, after a table of every game's controls was checked against the pages. Three parts
that go together: the page's order, a menu in place of Games and the row of page tools, and shared helpers so each
kind of control is written once and works the same everywhere. Build it in `games.js` and `games.css` first, then move
the games over a few at a time. When it's done, the README's "Across every game" (Layout, Gold paw, Bookmark, Keys) and
`HIG.md` need rewriting to match.

### The page, top to bottom

1. **Title row, pinned** (it stays at the top while everything else scrolls, so you always see which game you're
   playing): ☰ Menu at the left (where an iPhone app's Back is; its first row is Home), the game's name centred, the
   win-streak flame at the right (every game counts streaks with `G.streak`; today only Catdoku shows the flame).
   Tapping the flame shows the best streak and today's challenge; on the challenge game it says whether today's is
   done (in place of the badge under Games). On a phone held sideways the title row is pinned at the top of the
   column beside the board instead.
2. The rainbow line, the full width.
3. The game's cat beside its blurb (the tagline). These scroll away.
4. **Status line:** level on the left; time, lives or both on the right.
5. **Board**, with zoom and full screen in its corner (as Cat Burglar's + and − already are).
6. **Pieces**, the most used: digits, letters, toys, fabrics, paints, a tray of shapes, with ⌫ or Erase, and the
   game's marking tool among them (Mark, Dot, Keep, Patches' Marker), as Marker already sits with Patches' fabrics.
7. **Free tools:** Undo, Pencil, Bookmark, Return to Bookmark, Complete. Shown only where the game has them, in this
   order, closing up the gaps.
8. **Tools that cost the gold paw, grouped and in a dark brick red:** Hint, Audit, and the game's helpers. Not the
   red that marks mistakes on the boards; at least 3 to 1 in light and dark; and a small slashed paw on the icon's
   corner, so the colour isn't the only sign. Once the paw is gone for this puzzle, they go back to the usual colour.
9. **Restart (red: it costs the paw) beside New puzzle**, and Give up beside them where a game has it (Keyboard Cat,
   Spelling String, Cat Burglar).

Action games (Tail Chase, Bird Watch, L-M-N-O-Pom, Wind Up, Bubbles, Pawlinko): the free tools are their controls
(arrows, Turn, Drop, Pause) and the red group their helpers.

### The menu (☰, top left, in place of Games and the row of page tools)

- **Home** (the front page; one name for it everywhere), **Today's Challenge**, **Toy Chest** (one choice for every
  game, so it can be reached from any of them)
- **GAME NAME:** Add to Favorites (or ★ In Favorites; the ☆ leaves the title), Share, Best Times, How to Play, Keys
  (on a computer), and **Settings**, a row that opens the game's switches, each with its line
- All games: the games panel opens from Home's row, or from a row of its own; the front page and today's challenge
  stay at its top
- No Add to Home Screen.

`pageTools` in `games.js` is where the page tools are gathered today, so most of this is one change there. Walkthrough
steps and first-time tips that point at a switch or a page tool (`spotlight` `els`) need to open the menu, or point at
☰ and say what's in it.

### The gold paw

Undo and Bookmark (so Return to Bookmark too) become free in every game. Restart still costs it, as do Hint, Audit
and helpers, and whatever result the game is about (fewest moves, first try, par…). Today Undo costs it in about 25
games and is free in Catdoku, Toydoku and Shelf Life. Each game's gold-paw line on the win card, and the README's
Gold paw list, change with it.

### Shared helpers, so each is written once

- **Undo:** 33 pages write their own history. One `G.history` (push, undo, restart, ⌘Z), which Return to Bookmark
  and Restart use too.
- **Bookmark:** `G.guesser` runs it in 7 games; move Toydoku and Fair Play onto it.
- **Checking:** one name each. Auto check (rule breaks turn red as you play: Patches, Sunbeams, Fair Play, High
  Perch, Toydoku, Scratch That); Audit (a one-off check: Catdoku, Fridge Magnets, Purrfect Square); and wrong answers
  costing a life, called Audit as-you-go in Catdoku and Auto grade in Toydoku, the same thing. Complete (Catdoku) and
  Check (Mewstermind) are one button.
- **Pencil:** one name for Toydoku's Pencil, the Notes of Open the Door!, High Perch and Window Ledges, and Catdoku's
  paws, with Auto Notes. The three digit-pad games share one pad helper (digits, ⌫, Pencil, Auto Notes). Toydoku's
  Erase pencil (every pencil mark off at once) sits beside Pencil or is a long press on it.
- **Marking tools:** Hide & Seek's Mark, Fair Play's Mark (×), Cross Stitch's Dot, Treat Time's Keep, Patches'
  Marker, Catdoku's Erase and Scratch That's Dot first switch all change what a tap does. One helper; Scratch That's
  becomes a piece like the rest.
- **Lives and revives:** "Wait, I'm only mostly dead!" is written out in Catdoku, Toydoku, Hide & Seek, Twirl and Cat
  Burglar, and Catlas has lives of its own. One `G.lives`.
- **Switches:** 21 pages write their own. One `G.switch({id, label, line, key})`, drawn in the menu's Settings, with
  its line and its first-time tip.
- **Numbers:** one switch name in Yarn ("Show numbers"), Toydoku, Purrmutation and Wind Up ("Numbers").
- **Admire:** after a win, a toggle that clears the marks to show the finished picture. Today it's Open the Door!'s
  Show/Hide numbers button and Cat Burglar's Show/Hide the rings on its gallery card; it goes with the win card's
  Admire my board (`G.winCard`), and other games can use it (pencil marks, Hide & Seek's doodles).
- **Zoom and full screen:** Twirl (Fit, Zoom In, Zoom Out), Cat Burglar (+ −) and Catlas (+ −, Recentre) each zoom
  their own way. One helper beside `G.fullScreen`, in the board's corner.
- **Helpers:** the icon badge is shared; the uses left and the gold-paw cost become shared too. Shake is in Toy Box,
  Bubbles, Wind Up and Pawlinko; Shuffle or Mix in Toy Box, Pick of the Pile, Mew Hue and Keyboard Cat.
- **Hints by other names** go in the red group as hints: Keyboard Cat's Words left, Starts and Clues (switches today),
  and Junk Drawer's Words left.
- **Hints:** Catlas and Cat Burglar don't use `G.hinter` yet.

### Names to fix on the way

- Junk Drawer's Auto Notes fades the magnets no word left uses; name it like Pick of the Pile's Dim stuck blocks.
- Knit Pick's Guess button has the id `guessBtn`, which every other game uses for Bookmark (once called Guess).
- Slower: Wind Up is the one real-time game without it.

## README: corrections found with the controls table

- Bookmark's list leaves out Window Ledges (it has Bookmark through `G.guesser`), and "one helper runs it" isn't yet
  true of Toydoku and Fair Play.
- Hints: Toydoku's words are quiet too (read out only by VoiceOver), not only Toe Beans'; and "every game's hints work
  through `G.hinter`" leaves out Catlas and Cat Burglar.
