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

## Play-testing notes, 2026-11-08: themes across the games

The owner's notes on games 1–42 (43–52 not yet looked at), grouped by theme. Checked against the plan approved on
2026-11-07 and the PRs that built it (rhymes-with-tree/catdoku#236 to #240), so nothing here quietly undoes them.
Items marked **Changes the 2026-11-07 plan** say where it differs; each says whether the owner has decided. The owner
will recheck this list, and add games 43–52, before any of it is built.

### Status line (every game)
- Goals as a fraction with a small icon for what's
  counted: Tangle's "56 crossings left" becomes "56/59 ○" (the white dot); Pounce's moves become a fraction.
- Status line under the board: done (decided 2026-11-08, changing the 2026-11-07 plan's step 4). Keyboard Cat and
  Meowbile keep their own layouts. Still to check on tall boards (Tunnel Run, big Catdoku), where it could fall below
  the fold.

### Button rows (every game)
- **Restart · New [Noun]** on the last line, a line of their own, kept apart so they aren't pressed by accident
  (Restart beside New is as the plan has it).
- **Hint stays where the plan has it** (decided 2026-11-08): in the gold-paw group, not on Undo's line.
- New [Noun] centred (Toe Beans).
- Spelling String: New Round is in an odd spot (it already has Give up).
- Undo far down the page: Knock It Off. Junk Drawer's row
  underneath is unevenly spaced.
- Zoom and full screen: done for Twirl, Cat Burglar, Catlas, Fish Bones and Hide & Seek (`G.zoom` with `below`). Still
  beside New: Wind-Up's and Pawlinko's full screen (action games, not on the 2026-11-08 list). Move them too?

### Things in the way of the board
- Yarn: cats below Restart / New Puzzle, the puzzle's name ("Tropical") between them; smaller cats if it still
  doesn't fit one screen.
- Patches: the cat under the colours goes below Restart / New Puzzle (or to the side), so Undo, Hint, Restart and New
  can be found.
- Pawlette: Empty the cup and Dye it go below the board, not in it.
- Bubbles: less beige under the shooter.

### Too much talking
- Knock It Off: the legend of every icon goes off the page, into How to play or a lexicon; trial and error is part of
  the fun.
- Fish Bones: don't show "The Words" ahead; add each to the dictionary as it's found. Its level names have numbers
  after the fish names that need explaining or dropping.

### Tools and gestures the same everywhere
- One meaning for a double tap / long press across the marking games: after Catdoku a double tap should leave a cat
  mark in Hide & Seek, not a hiss. Open the Door!: long press as in Toydoku; an eraser in place of ⌫.
- Catdoku: a cat mark beside the paw mark and Erase.
- Fair Play: with Auto check on, Toy | Toy | Mark as pieces in place of tap once / tap twice. (Done: the Toy piece
  shows a toy, and Mark shows × = with "Mark" under it.)
- **Changes the 2026-11-07 plan** (pieces put Patches' Marker among the fabrics). **Decided 2026-11-08:** Marker is a
  notes tool, so it comes out of the colours and sits where the other games' notes tools do.
- Auto Notes: Catdoku's 🐾 is hard to see in dark mode (not urgent).
- Toydoku: its icons are in an odd order.
- Scratch That's Post first / Dot first: look for other games it would help (Fair Play?).

### Symbols that read wrong
- Cat Mat's key numbers read as pots of paint.
- Toy Box: a better way to show the toys on the track.
- Up a Tree: a new picture of Dottie for the win card.

### Comfort settings, one place for every game (a Settings page; decided 2026-11-08)
- Done: `settings/`, with the five three-way rows, a section per game, All settings in every ☰ Menu and a link on the
  front page; timers hidden per game; Junk Drawer's Junk switch (more junk, grey once you start); Auto grade changed
  mid-puzzle waits for the next game. Wording of the rows still to settle with the owner.

### Menu and Settings (every game)

### Win card and sharing
- Next / Admire / Share / Back to the front page / other size: one big Next, small icon buttons for the rest, the
  other sizes as a small link (New already holds the levels, #236).
- Share My Result: drop the long level names; game, one-line result (fraction, time, 🔥 streak, 🐾 gold paw), link.
- Toy Box's Admire Laya shows `laya-9` on the rug, awake: no Laya picture has her asleep. A sleeping Laya picture?

### Bugs
- Mewstermind: Enter moves to the next toy and changes it.
- Scratch That: why it isn't complete isn't clear, and the note goes too fast.
- Fair Play's hints: only three rules (no three in a row, no sandwich, a line already has all of one toy); when none
  applies it shows the first empty square's answer with no reason. Add rules, or say it's a plain answer.
- Bubbles: when Raise the Ceiling is allowed isn't predictable after a loss; offer it as a helper.

### Choices as radio buttons
- Catlas: Answer type → Pick from 4 names / Type with autocomplete / Type in a blank box, no help.
- Knit Pick: Cat theme words / Everyday words.

### More to play
- Tunnel Run: many more turning-only levels, up to a full page of small tunnels with a full-page view.
- If It Fits: more cat shapes. Patches: colourways (long term).
- Up a Tree: ⌫ back down to a lower level of the tree; if it's scored against par, allow extra levels?
- Fridge Magnets: Auto-Audit; a helper that fills in one square.
- Keyboard Cat: take a word start off the page once it's fully found; a keyboard walkthrough (its Keyboard Shortcuts now show in the menu). (A Full Pounce uses
  all 7 keys at least once; a Perfect Pounce uses each just once.)
- Spelling String: a way to look up a word.

### Questions still to answer
- Laser Pointer: does any target need a tap again after the laser has passed it once?
