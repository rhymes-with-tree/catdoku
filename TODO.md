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

## Shelves: what's left after the Kitten Play split

Kitten Play was split on 2026-11-12: it keeps match, pop and pile (Pounce on Three, Bubbles, Cat Pile, Wind Up, Mew
Hue), and On the Prowl (the owner's name) has the action and looking games (Tail Chase, Bird Watch, Pawlinko, Pounce
Up, Copycat, Cat Burglar, Catlas, and Pawstcards in beta). Its colour is coral. `IDEAS.md` still lists ideas under
Kitten Play: move the action ones (Paw-ball, a fling game, kneading in time) to On the Prowl when they're next touched.

Still open from the earlier notes: Cat Spells stays one shelf (the owner's call), and a colour-games shelf only if
Curious Cat gets crowded (Cat Mat, Shelf Life, Pawlette, Mew Hue).

## On-ramps and pacing, from the GoatCounter numbers (2026-11-12)

From GoatCounter's counts, 2026-10-05 to 2026-11-12 ("27 → 11" is a level started 27 times and solved 11). The samples
are small (10 to 40 a level) and a start includes pressing New, so these are signs, not rates. In order (done so far,
2026-11-12: Open the Door's and Toe Beans' easier level 1, Tunnel Run's Hint, starts counted in Wind Up, Pawlinko
and L-M-N-O-Pom, High Perch's trees left standing, smaller first sizes in Catdoku, Patches, Yarn and Sunbeams, 
Knock It Off's forgiving first two levels, and Pounce saving while toys fall):

- [ ] **Toe Beans: levels 9 and 10?** 0 solves in 9 starts, but five of those ended with Close enough, 1 to 6 away,
  which is the game working as meant. Leave unless the owner finds them too hard.
- [ ] **Pounce: check level 1.** 23 → 12, though the move limits were tuned for a near-certain win. Running out of
  moves wasn't counted, so that may be people looking in and leaving; it's counted from 2026-11-12 ("Pounce out of
  moves on level N"). Look again with a few weeks of it.
- [ ] **Weak level 1s to watch** (small samples): Cat Pile 16 → 7, Scratch That 17 → 8, Window Ledges 11 → 5, Kitten
  Caboodle 10 → 5.
- [ ] **Somewhere to go past the hardest level.** Toy Box's level 21 is a fifth of its starts; Twirl and Knock It Off
  at 20 are the same.
- [ ] **Catlas: two errors, once each on 2026-10-24.** Both are the map not having loaded when something asked it
  for a place (`world` was null). Not seen since; check that nothing can be tapped before the map is in.

### The owner's notes on the list, and what was decided (2026-11-12)

Done the same day: Tunnel Run is turning only, with its sliding rugs behind a Tracks switch; Pounce is Pounce on Three; Night Light is plain rooms only, 15 levels from one tap; its rooms with
cats that point their own way are Day Light (`daylight/`, in beta).

- [ ] **Day Light: out of beta.** The owner plays it first. Still to settle: a cat of its own (Dottie stands in), its
  place on the front page and in the daily challenge, and whether the sunny room reads well.
- [ ] **Moving up and down: the rest of the games.** Three wins at a level move you up and three losses move you
  down (a loss in a puzzle that can't be lost: a hint, or a Restart after working on it), with Give me another! and
  Change the difficulty on the win card. It's `G.ladder` in `games.js`, in Night Light, Day Light, Open the Door!
  and Toe Beans since 2026-11-12 (README, "Moving up and down"). Once the owner has played those, bring it to every
  other game with levels or sizes (each sets its own next level today), and fix each README section's wording.
- [ ] **Wind Up: play the deeper baskets.** Done 2026-11-12: levels 6 to 12 have a deeper basket and a higher line, and
  the first three helpers don't cost the gold paw. Checked with a simple bot, not a person: the owner should say
  whether levels 7 to 12 can now be won without a Shake. The helper buttons still wear the red "costs the gold paw"
  mark from the first use; it should only show once the free ones are gone.
- [ ] **Front page carousel: the owner to try it on a phone.** Rebuilt 2026-11-12 after the first try (tabs with a
  swipe that didn't work in the preview): the shelves now stand side by side in a row that scrolls with the finger
  and stops at each, with the next one's edge showing, a nudge on the first visit, a title card across each shelf,
  and today's challenge above the search box (README, first paragraph).
- [ ] **One new move a level.** The how-to and the on-ramp are divided in a way that isn't ideal: the walkthrough
  tells the rules up front, and then the levels get harder. Better: each early level brings in one new move, and a
  win on it is the reward. Night Light's and Day Light's new first levels (one tap, then two) are a first go at it.
- [ ] **Toe Beans:** getting that hard with few wins is disheartening; the moving-down rule above is the fix to try.
- [ ] **Mewstermind** is harder than the owner expected (2 starts and 1 win in GoatCounter so far, too few to say
  where).
- [ ] **Toy Box, Twirl and Knock It Off need more** past their hardest level.
- [ ] **Zen:** look for more games that could have one (Pounce on Three and Bubbles do).

## Star cats decided, waiting for pictures

Pangur Bán (Pangur) for Cat Burglar and Fitzwilliam Darcy (Fitz) for Pawlette (the owner, 2026-11-12; `ARTWORK.md`,
"Stars decided"). Once their pictures are in `cats/`, put each into its game.

## Pounce Up: tune the goals

Pounce Up joined the front page on 2026-11-12. Its level goals (`TASKS` in `pounceup/index.html`: the counts, the
race's 90 seconds, the candle level's share of candles) were set from an autopilot's play, which is clumsier than a
person; tune them from the owner's play and the Send feedback notes.

## Pawstcards: finish the beta

Pawstcards went up as an unlisted beta on 2026-11-11 (`pawstcards/`, in `BETA` in `games.js`) with 22 countries; it has 42 since the third batch. Before
it joins `GAMES` (and the front page):
- more places, in batches, until it has as many of Catlas's 245 as have good postcards (`tools/pawstcards/NOTES.md`
  says how a batch is made; the owner wants them picked on Fable). The Easy list first, then Medium and Hard;
  territories may have too little written about them;
- then levels: Easy, Medium and Hard trips from Catlas's lists (there's one level until there are enough places);
- Pinecone's own pictures, when the owner has drawn her (she/her): beside the title, on the win and gold-paw cards,
  and the front-page icon. A general black cat (`c18-27`, `c19-15`) stands in;
- the postcards' file is one script of every place (295 KB for 42): split it by place, loaded as a trip is dealt,
  before it grows past a few hundred KB;
- `places.js` is a copy of Catlas's names (written by `tools/pawstcards/make.py`): move them to one shared file
  that both pages load;
- Pick's wrong names are any three from the same continent: use Catlas's nearer and look-alike names per level;
- the owner's calls still open: 5 postcards a place, 20 a trip for the gold paw, and the first hint showing the
  region on the postmark;
- the rest of the new-game skill's port: the README section, a front-page icon (`tools/make-icons.py`), its Answer
  setting on the Settings page, an interactive step in the walkthrough, full screen (probably not: it's reading),
  and the full test list;
- then move its row from `BETA` to `GAMES` (with the date it joins) and take the beta label off the page.

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

## Settings page: questions left from the grid redesign (2026-11-12)

The owner's grid for the new Settings page differed from the games in a few places; asked, not yet answered:
- Keyboard Cat has no timer (it's in `UNTIMED` in `games.js`), but the grid gave it one: add one, timing each keyboard?
- Window Ledges' Show sets (on by default): the owner never asked for it and isn't sure about it. Keep or take out?
- The grid had "Other Settings" in the Every game row and "Check" on the Cat Logic shelf's row: left out until it's
  clear what they'd do.
- Speed says Slow · Fast · By game (the owner's words); "Regular" might read better than "Fast" for normal speed.
- Auto grade (Catdoku, Toydoku, Fridge Magnets) is a heart among each game's own settings, not under Check, so the
  Every game Check never turns lives on; the grid had Catdoku's under Check.
