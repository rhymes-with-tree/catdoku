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

## Pounce Up: finish the beta

Pounce Up went up as an unlisted beta on 2026-11-11 (`pounceup/`, in `BETA` in `games.js`), so the owner could share it
from the site while it's still being tuned. Before it joins `GAMES` (and the front page):
- decide the gold paw (first try for now), and whether pouncing is by itself or on a tap (the Pounce when I tap
  switch), and whether full screen is worth it (the board is about 390 pixels wide on a laptop);
- the rest of the new-game skill's port: the README section, a front-page icon (`tools/make-icons.py`), its settings
  on the Settings page, catnip and tape drawings moved into `tablethings.js` (they're copied in Tail Chase, Knock It
  Off and Pounce Up), and the full test list;
- then move its row from `BETA` to `GAMES` (with the date it joins), take the beta label off the page, and split Kitten
  Play (above): it's the second of Pawlinko, Pounce Up and Paw-ball.

## Feedback: what's left

Send feedback went into every game's menu on 2026-11-11 (the card in `games.js`, to the owner's Google Form; README,
"Feedback"). Left for later:
- a link to the puzzle in play: only Pounce Up gives one (`G.feedbackFor`); the other games send their level (from the
  level picker) and the page's address. Each game's Share already knows its puzzle, so each can pass the same data;
- the front page, which has no menu row for it;
- whether a beta's win and miss cards should ask a one-tap "How was that level?" (sent as a GoatCounter event: no
  words, so nothing new leaves the device, and it shows how hard each level feels).

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
- Goals as a fraction with a small icon: done through `G.tally` for every game counting "N of M": Tangle, Pounce,
  Copycat, Tunnel Run, Treat Time, Window Ledges, and (build .19) Cross Stitch, High Perch, If It Fits, Junk Drawer,
  Knit Pick, Kitten Caboodle, Laser Pointer, Open the Door!, Tail Chase, Toydoku, Mew Hue's lines and Bird Watch, each
  with an icon from its own board; wins and special lines stay in words. For the owner to look over on a phone.
- Tall boards: checked on 390 × 844 and 375 × 667. Tunnel Run's and Catdoku's biggest boards leave the status line well
  on screen; Bubbles' note line dips just under on a 390 × 844 phone, with its goal and time still showing.

### Symbols that read wrong
- Toy Box: done (build .22): what read wrong was the win screen, which showed empty baskets: the baskets a level
  empties along the way stayed on the floor behind the win card and Admire Laya. Now, once every toy is put away,
  they're carried off too, and Laya has the rug to herself.
- Up a Tree: done (build .21): the owner chose `dottie-14` (stretched out, tongue poking out) for the gold-paw card,
  in place of `dottie-12`; the plain win card keeps the random cat photo.

### Comfort settings, one place for every game (a Settings page; decided 2026-11-08)
- Done: `settings/`, with the five three-way rows, a section per game, All settings in every ☰ Menu and a link on the
  front page; timers hidden per game; Junk Drawer's Junk switch (more junk, grey once you start); Auto grade changed
  mid-puzzle waits for the next game. Wording of the rows settled (build .23): no line under a row; Timer (Show · By
  game · Hide), Action game speed (Regular · By game · Slower), Reduce visual clutter, Auto check and Auto Notes (On ·
  By game · Off), On or Show first; Timer's own switch lost its line too. Saved choices carried over
  (`catdoku.comfort.v2`). Next (owner, 2026-11-08): "Lose any words you can lose anywhere": the
  lines under switches and settings, walkthrough and card text, notes and labels, site-wide.

### Menu and Settings (every game)

### Win card and sharing
- Toy Box's Admire Laya shows `laya-9` on the rug. She isn't asleep, she's relaxing: the Admire line says so now
  (2026-11-08), so no new picture is needed.

### More to play
- Done 2026-11-08: Keyboard Cat's fully found starts come off the Starts strip, and its walkthrough teaches the real
  keyboard on a computer; Spelling String's cards look the word up; Fridge Magnets' Auto-Audit switch and Fill one
  helper (three a fridge, costing the gold paw); Up a Tree's ⌫ steps back down a perch (extra perches already grow
  past par, which only decides the gold paw, so nothing else was needed); If It Fits' Bugsy can lie on his back
  (`bugsy-1`), and every picture gets a turn; Tunnel Run's levels 11–16, turning only, 8 × 8 up to 13 × 13, with full
  screen from 9 × 9.
- Done 2026-11-08: Tunnel Run's page-shaped rugs, levels 17 (8 × 14) and 18 (10 × 18), on their side on a screen
  wider than tall; the game is W × H throughout, and share links and saves carry the shape.
- If It Fits: more cat shapes still welcome. Checked `cats/` on 2026-11-08 (build .22): no other whole lying-down
  Bowtie. `bowtie-6` is whole but lies facing you (Tunnel Run's), the rolling Bowtie in `bowtie-7` shares one picture
  with the tunnel, and `bowtie-4` is cut off at the right; `bowtie-8` and `bowtie-9` are faces. So Bowtie keeps
  `bowtie-2` until the owner adds a new picture or picks one of these.
- Patches: colourways (long term). What it would take: Patches has one set of four fabrics (`FABRICS`: red gingham,
  blue polka dot, mustard stripe, green zigzag) and their plain colours (`SOLIDS`) for Reduce visual clutter. A
  colourway is another set of four, each pair differing in pattern as well as colour, so it still reads without
  colour; the fabrics are stored as numbers 0–3, so saves and share links don't change. Each set needs checking
  against the white-and-gold hint flash, the red clash stripes, the gold paw, dark mode and colour-blind views, with a
  matching plain set. Then a Fabrics picker in Patches' Settings (and on the Settings page, through `SET_LIST`), the
  swatches under the quilt following it. About one session for three or four colourways. For the owner: how many,
  whether all are open from the start or earned (gold paws, or the Toy chest), and the owner said (2026-11-08) to borrow from
  Yarn's colourways in `colorways.js` (Berry, Moss, Ocean…).

### Questions still to answer
- Answered 2026-11-08 (build .20), for the owner to look over: Laser Pointer's cats never need the dot again once
  it's passed them, as a cat stays awake and only its first sighting counts for the order. Mirrors do, but only on
  the moving levels, 11–15, and there by design: every moving room has a mirror the dot meets twice that must be
  tipped between the two visits (the walkthrough says "It comes back to some mirrors… Tip them again after it
  bounces", and Hint says when to wait). In levels 1–10 a mirror is set once; the dot sometimes bounces off both
  its faces, with the same slant both times. Checked by making 12 rooms a level through the page's own
  `makeRoom`: every moving room had such a mirror, and no still room did. README now says so for levels 1–10.
