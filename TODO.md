# To do

Things to come back to, kept here so any chat can pick them up. Add an item when something is put aside; take it out
(in the same PR) once it's done. Game ideas go in `IDEAS.md`, and work on Apple's guidelines in `HIG.md` ("Still to do").

## The move to lapcatpuzzles.com

The site is moving from GitHub Pages (`rhymes-with-tree.github.io/catdoku/`) to Cloudflare Workers at lapcatpuzzles.com,
and taking its name, Lap Cat Puzzles, from the domain (2026-11-17). `move.js` carries players' progress across (see
README, Hosting and the move). It waits for the new site to answer, so it's on `main` already. In order:
- [x] Cloudflare Workers project `lapcatpuzzles` on this repository, with lapcatpuzzles.com and www; live 2026-11-17
- [ ] check on an iPhone: from Safari at the old address, and from an old Home Screen icon (the code and Settings);
  and on Android and in DuckDuckGo, which testers use too
- [ ] testers moved: keep the old address up (the repository public, GitHub Pages on) until they all have, a few weeks
- [ ] then make the repository private, which turns GitHub Pages off; the old address stops working for good
- [ ] Email Routing for lapcatpuzzles.com in Cloudflare (Compute, Email Service): domain onboarded 2026-11-17; the
  destination address and a hello@ rule are the owner's to finish
- [ ] after the switch, the Pawprints numbers carry on in one line (the paths keep `/catdoku`); check a day's worth

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

Kitten Play was split on 2026-11-12: it keeps match, pop and merge (Pounce on Three, Bubbles, Cat Pile, Wind Up, Mew
Hue, and Copycat: matching, not prowling; Pawlette and Shelf Life joined it from Curious Cat the same day, the owner's call), and On the Prowl (the owner's name) has the action and looking games (Tail Chase, Bird Watch, Pawlinko, Pounce
Up, Cat Burglar, Catlas, and Pawstcards in beta). Its colour is coral.

Still open from the earlier notes: Cat Spells stays one shelf (the owner's call), and a colour-games shelf only if
the colour games crowd a shelf (Cat Mat on Curious Cat; Shelf Life, Pawlette and Mew Hue on Kitten Play).

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
- [ ] **Mewstermind: out of beta.** Moved to beta on 2026-11-19 (the owner's call) and rebuilt as a Clue: one cat had
  one toy, in one room, at one time of day; each guess names one of each, paws say how many are right; Higgins is the
  witness Hint. Levels 1 to 6 built 2026-11-19 and 2026-11-20, with its new icon (preview:
  https://claude.ai/artifact/LD21RccB3Yg2dk66XGUih3). Rooms and times stay emoji (the owner's call). For the owner to
  play, then back to the front page.
- [ ] **Under the Blanket: out of beta again.** Moved to beta on 2026-11-16 (the owner's call) after its first week on
  the front page: 11 starts at level 1, 6 solves. Still to settle what makes level 1 easier to get into.
- [ ] **Twirl's sound on an iPhone** (feedback, 2026-11-16): sometimes no sound at all. Since the same day a tap's sound
  waits for the sound to wake, and sound stuck after a call or another app restarts itself. Check on an iPhone. (The
  report also said it went quieter after zooming the mat; the owner couldn't make that happen.) The silent switch mutes
  the site's sound on purpose ("ambient", so music keeps playing).
- [ ] **Somewhere to go past the hardest level.** (Twirl has levels 21 to 24 since 2026-11-15.) Toy Box's level 21 is a fifth of its starts; Twirl and Knock It Off
  at 20 are the same.

### The owner's notes on the list, and what was decided (2026-11-12)

Done the same day: Tunnel Run is turning only, with its sliding rugs behind a Tracks switch; Pounce is Pounce on Three; Night Light is plain rooms only, 15 levels from one tap; its rooms with
cats that point their own way are Day Light (`daylight/`, in beta).

- [ ] **Day Light: out of beta.** The owner plays it first. Still to settle: a cat of its own (Dottie stands in), its
  place on the front page and in the daily challenge, and whether the sunny room reads well. From the owner's first
  play (2026-11-12): a missing arrow needed marking, so a small red cross now marks each of the plain four ways a cat
  that points its own way leaves out.
- [ ] **Moving up and down: the rest of the games.** Three wins at a level move you up and three losses move you
  down (a loss in a puzzle that can't be lost: a hint, or a Restart after working on it), with Give me another! and
  Change the difficulty on the win card. It's `G.ladder` in `games.js`, in Night Light, Day Light, Open the Door!
  and Toe Beans since 2026-11-12 (README, "Moving up and down"). On hold (the owner, 2026-11-12): not until there's
  data on how it plays in those four. Then bring it to every
  other game with levels or sizes (each sets its own next level today), and fix each README section's wording.
- [ ] **Front page carousel: the owner to try it on a phone again.** The owner's first go on a phone (2026-11-12): it
  moved with a finger but was far too sensitive, a normal swipe flew most of the way along, and it could stop between
  two shelves. Rebuilt the same day so the page moves the row itself: exactly one shelf a swipe (a quarter of the way
  or a flick), never stopping between two (README, first paragraph). Checked with touch in the headless browser only.
- [ ] **One new move a level.** The how-to and the on-ramp are divided in a way that isn't ideal: the walkthrough
  tells the rules up front, and then the levels get harder. Better: each early level brings in one new move, and a
  win on it is the reward. Night Light's and Day Light's new first levels (one tap, then two) are a first go at it.
  Already this way: Knock It Off, High Perch, Laser Pointer, Unravel. Done 2026-11-12: Open the Door! (× and ÷ each
  get a level, so 8 levels, and each new sign gets a spotlight the first time it turns up; GoatCounter's level 3 and
  up are the old levels before then). Also done 2026-11-12: Pounce on Three (each special toy
  shown the first time it's made), Fair Play (no signs at level 1; = and × arrive at level 2 with a spotlight) and
  Under the Blanket (a one-cat level 1, so 11 levels; the U-turn between two cats is a short lesson on the first
  two-cat blanket). Next to look at: which other games teach everything up front.
- [ ] **Toe Beans:** getting that hard with few wins is disheartening; the moving-down rule above is the fix to try.
- [ ] **Toy Box, Twirl and Knock It Off need more** past their hardest level. The owner's picks (2026-11-15), and more
  ideas of the same kind to choose from; each would be one new thing a level, from the level after the top one:
  - Knock It Off, picked (2026-11-15): a second cat to switch to, the lazy Susan (its four squares turn a quarter
    each time the cat steps on it), a spray bottle that watches a row (the cat can't end a move in its line), and the
    robot vacuum that moves each turn. The tray (it carries what's on it) is still being considered. Not picked: the
    puddle, laundry basket, sleeping dog, stack of cups, the human coming home.
  - Toy Box: levels 22 to 27 built 2026-11-15 (catnip mice, picture baskets, a fork, a basket on wheels, gifts, a
    waiting basket; README, Toy Box). The owner to play them; level 23's picture baskets sometimes take a few seconds
    to deal (the solver searches longer), which the page hides by dealing the next level ahead.
  - Twirl: levels 21 to 28 and Endless built 2026-11-15: ribbons pointed at both ends, crossing over and under, knots,
    all three, a mat bigger than the screen (level 25; Fit shows it all since 2026-11-16), one colour, thin ribbons
    (level 27), very long ribbons with crossings and knots (level 28), and a mat that keeps unrolling (README, Twirl).
    The tiny-ribbons level went on 2026-11-16 (the owner's call), and a Grid switch came in the same day.
    The owner to play them on a phone: whether the knots and crossings show well enough at Fit on the big mats, and
    how hard 24 and 26 are. Endless could later take in crossings,
    knots and both-ended ribbons, or speed up as it goes. Not now (the owner, 2026-11-15): the sleeping cat that moves and the
    kitten who bats a ribbon. Not picked: bows, shaped mats.
- [ ] **Wind Up: levels 13 to 21** built 2026-11-15 (catnip, rubber balls, loose yarn, springs, sticky tape, a tipping
  basket, no peeking, hurry, a basket that leans with the weight; README, Wind Up). The owner to play them: whether springs tangle too often or too seldom
  (`TANGLE`, one in eight), how fast yarn unravels (`UNRAVEL`, 7 seconds a size), how far the basket tips (`TIP`), and
  whether 3 seconds is the right hurry. Balanced so far only with a bot that never uses helpers. Also Endless (zoom
  out each time the top size is wound): whether one Shake a run is right, and whether its basket should be deeper.
- [ ] **Zen:** look for more games that could have one (Pounce on Three and Bubbles do).

## Star cats decided, waiting for pictures

Pangur Bán (Pangur) for Cat Burglar and Fitzwilliam Darcy (Fitz) for Pawlette (the owner, 2026-11-12; `ARTWORK.md`,
"Stars decided"). Once their pictures are in `cats/`, put each into its game. Crow (like Ferguson, only much sleeker)
will star in Crow's Drawers, not made yet (`IDEAS.md`); add Crow's poses to `ARTWORK.md` when they come.

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

## Swap-a-Pom: finish the beta

Swap-a-Pom went up as an unlisted beta on 2026-11-13 (`swapapom/`, in `BETA` in `games.js`). Before it joins `GAMES` (and
the front page):
- the owner plays it, and the level goals are tuned from that (they were set with simulated players, who never make a
  swap with no word, which the owner's rule now allows);
- the owner hears the purr on a phone: whether the soft purr while playing is too loud or too quiet (`purring.base`), and
  whether Moonpie should tremble a little the whole time it's on (offered, not asked for yet). On an iPhone the silent
  switch mutes it. She purrs softly the whole time you play, unless sound is off: the owner's call (2026-11-15);
- then move its row from `BETA` to `GAMES` (with the date it joins) and take out its `noindex` line.

## Boing!: the preview, waiting to be made

A preview of Boing! was made on 2026-11-13 (https://claude.ai/artifact/JnemuF5eg6skXE6RLEYADR, the owner's own; the whole
page, rules, level maker and drawing, is in it). The owner was happy with it as it is ("This is fine"), place-and-turn as
`IDEAS.md` describes, with Ferguson as the star. Still to do: make it with the new-game skill, from the preview's code.
- The springs in the preview are cut from `toys/sheets/springs.webp` (standing, leaning, end-on and lying flat, in eight
  colours, 96 px). The README says that sheet has coloured fringes round each spring: check the cuts on a dark background,
  or cut them from `springs-grey.webp` and tint them as the pompoms are.
- Its rooms take up to two seconds to make at the busier levels, so they're made in a Web Worker.
- Unused so far: the arc pose on the sheet.

## The shape of a visit: read it in a week or two

The visit tally went in on 2026-11-17 (README, "Play counts"): "Visit opened on: …", "First game: …" and "… in a row: N"
on the GoatCounter dashboard. Read them after a week or two: what visits open on, which game comes first (and whether
it's the daily challenge), and which games are played again and again. GoatCounter's own export came back empty
(2026-11-16: it keeps only totals), so this is the only way to see it.

## Feedback: what's left

Send feedback went into every game's menu on 2026-11-11 (the card in `games.js`, to the owner's Google Form; README,
"Feedback"). Left for later:
- a link to the puzzle in play: only Pounce Up gives one (`G.feedbackFor`); the other games send their level (from the
  level picker) and the page's address. Each game's Share already knows its puzzle, so each can pass the same data;
- the front page, which has no menu row for it;
- whether the card should also send if GoatCounter loaded on the page ("counted: yes/no"), to see roughly how many
  feedback senders a blocker hides from the counts, and on which platforms (offered 2026-11-16, not picked yet);
- whether a beta's win and miss cards should ask a one-tap "How was that level?" (sent as a GoatCounter event: no
  words, so nothing new leaves the device, and it shows how hard each level feels).

## Sound effects: what's left

Sound went in on 2026-11-14 (README, "Sound"): `G.sound` in `games.js`, on by default, a Sound column on the Settings
page and a Sound switch in every game's menu, the shared win, gold-paw, lose and hint sounds, Pawlinko's and Pounce Up's
own, Swap-a-Pom's purr moved onto it, and a new What's new card. Every sound is the owner's pick from the listening page,
https://claude.ai/artifact/AiHXuVwvwB5CJSBPvgGNKS (the owner's own; its source is the page itself). Still to do:
- **Recordings** (2026-11-15): the owner found CC0 sounds on Freesound (the site refuses this cloud session, API key or
  not, so the owner downloads them), sorted and cut them on Clip Bench (https://claude.ai/artifact/2tqPsC8VEQdJu67RDYZDzE;
  its cuts live in the page's database), and the Keeps (98) went to the listening page as Your recordings. The 19 the
  games use are in `sounds/` (`G.sound.kit.rec(name, vol)`; `ARTWORK.md` lists each); the rest wait in
  `tools/sounds/kept/`. Picked for no moment yet: Cat rub and Fabric grab 4 (the owner wants both used somewhere; Hard
  slide up, meh; Knitting stitch deleted). Each game fetches only the recordings it plays, once sound starts (64 kbps; the most
  any game loads is under 100 KB).
- **Every shelf is done** (2026-11-14), Cat Spells and Curious Cat last; Undo, Bookmark and a life lost sound in every
  game that has them.
- **Objects and actions** (2026-11-15): the shared sounds are in `games.js` (`spring`, `yarnLand`, `glassOver`, `tape`,
  `lemon`, `bell`, `shake`, `catWakes`…), and a game's moment points at one with `G.sound.get`. The owner settled the
  differences: every hiss is Hiss 2 at 15% (`lemon`: Pounce Up's and Tail Chase's lemon, Hide & Seek's woken cat), tape
  is the sticky thhp everywhere, Pounce Up's candle the fwoomp, every bell Toy jingle 8, and every Shake the swish back
  and forth (the universal pick). "Off a table" isn't one thing (a swipe in Pounce Up, a whoosh in Pawlinko, a crash in
  Knock It Off), so it's off the page and each game keeps its own. Still each game's own: a cat waking (a chirp or a
  mew; Yawn and snore, the object row's pick, plays nowhere yet), L-M-N-O-Pom's soft plop, Unravel's Undo blip.
- **The better sounds** (hiss, scratching, chirps, water, meow, big yawn, fabric rustle, crinkle; 2026-11-14) are in the
  games wherever those sounds were picked; the owner is to hear them on the listening page (Better sounds to hear).
- **Per-row volume and length:** `ADJ` in `games.js` holds the owner's own (cat settles: 200%, 130%; Shake: 90%,
  200%), and a recording takes its volume in `rec` (the lemon's hiss at a tenth, Twirl's swish at a fifth).
- **Testers:** the listening page can go to testers (shared from its Share menu); Send opens the site's feedback form
  with their picks in its last field (the link field) and their name in the contact field. The shared tap, put-down and not-allowed sounds (`tap`, `put`,
  `wrong`) are for the rest. Add them a shelf at a time, quick and action games first, each game's own sounds where the
  shared ones don't fit (the listening page can be extended for each shelf, so the owner picks as before).
- **On a phone:** the owner hears it all on an iPhone: the length (`LENGTH` in `games.js`, 55% since the sounds went on too long; the listening page's Length slider tries others), the loudness (`VOLUME` in `games.js`, .47, matching the
  listening page at the 59 the owner last used), and whether Pawlinko gets too busy with several things falling.
- **The Settings page's Every game Sound** sets the games on the front page; a beta game (Swap-a-Pom now) has only its
  menu's switch until it joins.

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
- Window Ledges' Show sets (on by default): the owner never asked for it and isn't sure about it. Keep or take out?
- The grid had "Other Settings" in the Every game row and "Check" on the Cat Logic shelf's row: left out until it's
  clear what they'd do.
- Auto grade (Catdoku, Toydoku, Fridge Magnets) is a heart among each game's own settings, not under Check, so the
  Every game Check never turns lives on; the grid had Catdoku's under Check.

## A sound for tape

The shared `tape` sound (a sticky thhp, in Wind Up, Pounce Up and Tail Chase) was made silent on 2026-11-17: the owner
hates it. Find something better (perhaps a recording in `sounds/`) and put it back in `games.js`.
