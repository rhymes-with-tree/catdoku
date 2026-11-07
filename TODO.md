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

## Controls: one shared way for what's written many times

From a side-by-side table of every game's controls (2026-11-07), checked against the pages. Each is a helper for
`games.js` that the games then move onto, one game at a time; most also make the games behave the same.

- **Undo:** 29 pages write their own `undo` and history list. A shared `G.history` (push, undo, restart, ⌘Z) would
  also let Return to Bookmark and Restart work the same everywhere (Bookmark already undoes through the game's Undo).
- **Bookmark:** `G.guesser` runs it in 7 games, but Toydoku and Fair Play have their own Bookmark code. Move them over.
- **Checking, three kinds with mixed names:** Auto check (rule breaks go red as you play: Patches, Sunbeams, Fair Play,
  High Perch, Toydoku, Scratch That); Audit (a one-off check: Catdoku, Fridge Magnets, Purrfect Square); and wrong
  answers costing a life, called Audit as-you-go in Catdoku and Auto grade in Toydoku (the same thing). One name for
  each and one helper; then see whether Catdoku wants Auto check and Fridge Magnets and Purrfect Square an as-you-go.
- **Notes, four ways:** Catdoku's paws and Auto Notes; Toydoku's Pencil (ON/OFF badge) and Clear notes; a Notes button
  and Auto Notes in Open the Door!, High Perch and Window Ledges; Shift with a number in Mewstermind. The three
  digit-pad games could share one pad helper (digits, ⌫, Notes, Auto Notes).
- **Mark tools:** Hide & Seek's Mark, Fair Play's Mark (×), Cross Stitch's Dot, Treat Time's Keep, Catdoku's Erase and
  Scratch That's Dot first switch all change what a tap does. One helper for the button, its pressed look and its key
  (Scratch That's would become a button like the rest).
- **Numbers, five ways:** a switch in Yarn ("Show numbers"), Toydoku, Purrmutation and Wind Up ("Numbers"), and a
  button shown only after a win in Open the Door!. One `G.numbers` switch with one name, kept per game like `G.slower`.
- **Zoom, three ways:** Twirl (Fit, Zoom In, Zoom Out), Cat Burglar (+ and − in the frame's corner) and Catlas (+, −,
  Recentre). One helper beside `G.fullScreen`.
- **Lives and revives:** "Wait, I'm only mostly dead!" is written out in Catdoku, Toydoku, Hide & Seek, Twirl and Cat
  Burglar, and Catlas has lives of its own. One `G.lives`.
- **Finishing:** Complete (Catdoku) and Check (Mewstermind) do the same job. Give up is only in Keyboard Cat, Spelling
  String and Cat Burglar, though Tangle and Hide & Seek have no Restart either.
- **Helpers:** Shake (Toy Box, Bubbles, Wind Up, Pawlinko) and Shuffle or Mix (Toy Box, Pick of the Pile, Mew Hue,
  Keyboard Cat). The icon badge is shared; the uses left and what each costs are not.
- **Switches:** 21 pages write their own switch markup and keep its setting their own way. A `G.switch({id, label,
  line, key})` would also give the line under it and its first-time tip.
- **Hints:** Catlas and Cat Burglar don't use `G.hinter`.

## README: corrections found with the controls table

- Bookmark's list leaves out Window Ledges (it has Bookmark through `G.guesser`), and "one helper runs it" isn't yet
  true of Toydoku and Fair Play (see above).
- Hints: Toydoku's words are quiet too (read out only by VoiceOver), not only Toe Beans'; and "every game's hints work
  through `G.hinter`" leaves out Catlas and Cat Burglar.
- Junk Drawer's Auto Notes fades the magnets no word left uses, more like Pick of the Pile's Dim stuck blocks than the
  other Auto Notes; perhaps a different name.

## A More menu, and what goes on the board (proposal, not decided)

Talked through on 2026-11-07. Sort every control by how often it's used while playing:

**Into a More (…) menu at the far right of the title, beside Games** (things used once a visit, or set once and left):
- the page tools: Share, Best times, How to play, Keys, Toys (all of today's row under the title, so `pageTools` is
  the one place to change)
- the switches that change how the board looks: Numbers, Fabric patterns, Twisty ribbons, Show sets, Shelf, Cats, Dim
  stuck blocks
- the switches that change how strict it is, set once: Auto check, Audit as-you-go / Auto grade, Auto Notes, Dot first,
  Turning, Reverse, Slower
- Give up (rarely wanted, and out of reach of a stray tap)
- an Every game section at the bottom: today's challenge (the game's name, in gold, with the streak line; a link
  from any other game, and on the challenge game itself its solved or not), the toy chest (one choice for every game,
  so it can be reached from any of them, not only the toy games), the front page, and Add to Home Screen (only in a
  browser, not once it's opened from the home screen; Safari can't be asked to add it, so it shows how: Share, then
  Add to Home Screen). The Games menu already has the front page and today's challenge at its top; these are a
  shortcut, not a move. Keep the badge under Games on the challenge game, since it's why you came.

**Into New's menu with the levels**, as they decide the next puzzle: Yarn's colours, Catlas's answer style, Knit
Pick's words.

**Stay in the action row:** Hint, Undo, Restart, Bookmark and Return to Bookmark, Audit, Complete or Check, and New
below the board. The timer stays in the status line.

**On the board, or right at its edge** (part of the play itself, near the thumb, as Toydoku already does):
- pads and palettes: digits, letters, toys, fabrics, paints, with ⌫, Enter, Notes and Pencil beside them
- tools that change what a tap does: Erase, Mark, Dot, Keep, Flip
- zoom and full screen in a corner of the board, as Cat Burglar's + and − already are (Twirl and Catlas too)
- the action games' controls: ◀ ▶ ▼, Turn, Drop, Swat, Pause
- helpers that act on the board: Shake, Shuffle, Mix it up, Peek, Wipe, Pawlinko's and Toy Box's helpers

To weigh first:
- Apple discourages a ☰ menu for an app's main places, but an ellipsis More button for secondary actions is ordinary
  (a pull-down button); use … and keep Games as it is.
- Walkthrough steps and first-time tips point at switches and page tools (`spotlight` `els`). In a menu they'd need
  to open it, or point at … and say what's in it.
- Half the switches lose their always-visible line saying what they do; the menu should keep those lines.
- Sideways on a phone, the column beside the board gets shorter, which helps.
