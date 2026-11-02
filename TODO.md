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

## Shelf tidy-up

Talked through with the owner on 2026-11-02. Toy Box and Night Light moved to Curious Cat and Cat Pile to Kitten Play
that day (by the test below: Toy Box and Night Light are fixed boards to plan through, and Cat Pile's random pieces
keep coming). What's left is still to weigh, and the reasoning is kept for that. Shelves live in `GROUPS` in `games.js`, and a game's shelf is the fifth field of its row in
`GAMES`. Moving a game changes its tile colour (`SHELF_COLOUR`), where it sits on the front page and in the games menu,
shelf search, and its shelf in `IDEAS.md` and the README's shelf list.

**The test for Curious Cat and Kitten Play.** Curious Cat ("Moves to plan and shapes to fit") gives you a fixed board
to plan your way through, and nothing new turns up while you think. Kitten Play ("Match, pop, sort and chase") keeps
bringing new things (falling toys, the next bubble, birds, the snake moving), so chance and timing count as much as
planning, and you play for a score or a level's goal rather than solving one set position. Cat Trails ("Join, link
and route things") holds together: every game there is drawing or routing lines. Yarn, Catwalk and Tunnel Run are
logic puzzles with one answer, but drawing lines puts them on Trails, and that's on purpose. Nothing on Trails or
Curious Cat belongs on Cat Math or Cat Spells.

Still to weigh, by that test:
- **Pawlette** (mix paint to order), Kitten Play → Curious Cat: a set puzzle to work out, not a quick game.
- Borderline but staying: Pick of the Pile (mahjong solitaire, partly spotting pairs, still a fixed board to clear in
  a good order) and Shelf Life (judged by eye more than planned).

**Retire Cat Travels; Catlas to Kitten Play.** Catlas is the only game on Cat Travels and `IDEAS.md` has no ideas for
that shelf, so it would stay a shelf of one. Catlas ("Name the country where each cat is hiding") is the same kind of
game as Cat Burglar ("Catch the cat that's sneaked into the painting") and Copycat: quick rounds of looking and
finding. So it fits Kitten Play without a new shelf.

**Don't add shelves yet.** A phone shows three tiles across, and every shelf adds a label tile and starts a new row,
so a shelf of two to four games costs a lot of screen for little. Seven shelves (six after Cat Travels goes) is plenty
for about 50 games. Counts on 2026-11-02 after the moves, games on the site / ideas in `IDEAS.md`: Cat Logic 9/14, Cat Math
6/0, Cat Trails 6/6, Cat Spells 8/13, Curious Cat 9/10, Kitten Play 10/8, Cat Travels 1/0.

**Split Kitten Play once its action games arrive.** It's more than one kind of game sharing a shelf. Its ideas fall in
two groups:
- match and pop: Onet-style pairs, SameGame groups, a triple-tile tray; with Pounce, Bubbles, Wind Up, Mew Hue and
  Cat Pile
- action: Kitty Plinko, Paw-ball, Pounce Up, a fling game, kneading in time with the purr; with Tail Chase and Bird
  Watch, and the looking games (Copycat, Cat Burglar, Catlas) could go with them
The action group is two to five games today, too few for a shelf. Once a couple of the shortlisted ones (Kitty Plinko,
Paw-ball, Pounce Up) are built, split it.

**Cat Spells stays one shelf.** With its five shortlisted ideas it would have 13 games, and 21 with every idea, but
there's no natural split: finding words and moving letters to make words are the same kind of game (the owner's call).
Cat Math has no ideas waiting, but six games is a fine shelf; leave it.

**Colour games, just noted.** Cat Mat (flood fill), Mew Hue (slide and mix paint), Shelf Life (colour gradient) and
Pawlette (mix paint to order) are all colour games, spread over Curious Cat and Kitten Play. Nothing to do about it
yet; worth keeping in mind when shelves are next weighed.
