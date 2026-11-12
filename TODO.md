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
Paw-ball, Pounce Up) are built, split it. That's now: Pawlinko (2026-11-02) and Pounce Up (2026-11-12) are both on the
site, waiting for the owner to name the action shelf.

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

## On-ramps and pacing, from the GoatCounter numbers (2026-11-12)

From GoatCounter's counts, 2026-10-05 to 2026-11-12 ("27 → 11" is a level started 27 times and solved 11). The samples
are small (10 to 40 a level) and a start includes pressing New, so these are signs, not rates. In order (done so far,
2026-11-12: Open the Door's and Toe Beans' easier level 1, Tunnel Run's Hint, starts counted in Wind Up, Pawlinko
and L-M-N-O-Pom, High Perch's trees left standing, smaller first sizes in Catdoku, Patches, Yarn and Sunbeams, 
Knock It Off's forgiving first two levels, and Pounce saving while toys fall):

- [ ] **Toe Beans: levels 9 and 10?** 0 solves in 9 starts, but five of those ended with Close enough, 1 to 6 away,
  which is the game working as meant. Leave unless the owner finds them too hard.
- [ ] **Tunnel Run: is a new order worth it?** A second look says the numbers don't back it firmly: the levels with one
  and two tracks hold up (7 → 7, 7 → 4), and the 1 win in 10 starts from level 6 up is one or two people. The loss is
  at level 2 (21 → 11), a plain 6 × 6. Moving the bigger turning-only rugs (11 to 16) ahead of the tracks would
  renumber the levels (saved rugs, best times and share links go by number), so it's the owner's call.
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

Done the same day: Pounce is Pounce on Three; Night Light is plain rooms only, 15 levels from one tap; its rooms with
cats that point their own way are Day Light (`daylight/`, in beta).

- [ ] **Day Light: out of beta.** The owner plays it first. Still to settle: a cat of its own (Dottie stands in), its
  place on the front page and in the daily challenge, and whether the sunny room reads well.
- [ ] **Tunnel Run: what becomes of the sliding tracks?** The owner chose to split them off, then asked whether they
  differ from Purrmutation. The move is the same as Purrmutation's Sixteen (a whole row or column slides round);
  the puzzle differs (join the tunnels, where any piece that fits will do, against putting a picture back, where
  every piece has one home). Levels 4 to 10 have had about 25 starts in all. Choices put to the owner: a game of
  its own, a Tracks switch inside Tunnel Run, or dropping them. Either way Tunnel Run's own levels become
  turning only (1 to 3 and 11 to 18 today), with saves, best times and links moved as Night Light's page does.
- [ ] **Moving up and down: the rest of the games.** Three wins at a level move you up and three losses move you
  down (a loss in a puzzle that can't be lost: a hint, or a Restart after working on it), with Give me another! and
  Change the difficulty on the win card. It's `G.ladder` in `games.js`, in Night Light, Day Light, Open the Door!
  and Toe Beans since 2026-11-12 (README, "Moving up and down"). Once the owner has played those, bring it to every
  other game with levels or sizes (each sets its own next level today), and fix each README section's wording.
- [ ] **Wind Up: play the deeper baskets.** Done 2026-11-12: levels 6 to 12 have a deeper basket and a higher line, and
  the first three helpers don't cost the gold paw. Checked with a simple bot, not a person: the owner should say
  whether levels 7 to 12 can now be won without a Shake. The helper buttons still wear the red "costs the gold paw"
  mark from the first use; it should only show once the free ones are gone.
- [ ] **Front page: one shelf at a time.** A carousel: see Cat Logic, or Cat Math, or the next, rather than
  everything in one very long list. Show the owner a preview before changing the page.
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
