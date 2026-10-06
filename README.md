# Catdoku

A cat-themed logic puzzle in a single HTML file. Place one 🐱 in every row, every column, and every color region — and no two cats may touch, not even diagonally.

## Play

Open `index.html` in any modern browser. No build step or dependencies.

## Features

- Board sizes from 5 × 5 to 14 × 14, each with a unique solution
- Puzzles generated in a background Web Worker, with the next one prefetched
- Auto grade and auto exclude toggles
- Paw marks (🐾) by tapping or dragging, with an erase mode
- Undo, restart, audit, and lives with revives
- Wins move you up a size; a win that needed Audit or a revive, or running out of lives, keeps you at the same size
- Progress saved in `localStorage`
- Cat photos, facts, and breeds from public cat APIs (all optional; the game works offline)

## Yarn

A second puzzle in `yarn/`, linked from the top of every page and sharing Catdoku's look and home-screen app.
Lead one strand through balls of yarn from lightest to darkest, passing through every square once.
Every puzzle is generated in the browser and checked to have exactly one solution.
Shared styling and helpers live in `games.css` and `games.js`.

Every game has a timer that starts on your first move and pauses while the page is in the background or a card is open. Tap it to hide the time.
Your fastest times for each game and size are kept on your device and shown under Best times.
Share sends a link to the exact puzzle, either fresh or with your moves so far (to ask for help). The puzzle travels inside the link, so no server is involved.
Every game moves you up as you win: the next puzzle is a size bigger (or, in Toy Box, the next level). If you needed help (in Catdoku, Audit or running out of lives; in Toy Box, a helper or a jam), you stay at the same size or level. The finishing card, and Catdoku's out-of-lives and Toy Box's jam cards, always let you pick a different size or level instead.

## Patches

A third puzzle in `patches/`: sew a quilt by giving every patch one of four fabrics so no two patches that share a seam match.
Patches with a button come already sewn. Every quilt is generated in the browser and checked to have exactly one solution.

## Sunbeams

A fourth puzzle in `sunbeams/`, a cat-themed Shikaku: every number is a cat, and each cat needs a rectangle of sunlight with exactly that many squares, until the whole floor is sunny.
Each sunbeam gets a sleeping cat of the right size and shape, stretched out to fill it. The cat pictures live in `cats/` so any game can use them.

## Toy Box

A fifth game in `toybox/`, a cat-toy sorting game. Tap a wicker basket to tip its front toys onto a winding ball track; each toy drops into the first basket it reaches whose front toy matches, or the first empty basket, so timing a tap decides where toys go. Toys go once round before they can return to their own basket. If the two front toys differ, the one you tap is the one sent, and a toy can only leave once the whole row in front of it has gone. A toy alone in its row sits in the middle, so it reads as the front of the basket. Short tips pop up the first time two different front toys appear and the first time the track is nearly full. Fill a basket with eight of one toy and it's carried off, basket and all, so there are fewer baskets to work with as you go.
There are 21 levels, picked from a list at the top; they get harder up to level 21: up to nine of the ten kinds of toy, a track that shrinks from 16 spaces to 5, more hidden toys and more split pairs. The track holds fewer toys as levels go on, and more toys start hidden in the back rows of baskets (a level hides none, or at least four toys of at least two kinds). From level 4 some matching pairs are dealt split up, so toys aren't always side by side with their match. If the track fills and nothing can find a basket, it jams. Every level is checked by a solver in a background Web Worker before it's dealt, so it can always be won with the right timing (the solver follows the same first-basket rule, and treats which rolling toy reaches an empty basket first as the player's choice). Toys are pictures from the shared toy library in `toys/`: ten kinds, one per palette colour, and each level picks one picture per colour (drawn stand-ins are used if a picture is missing). Each level has one of each helper: Shake a basket (rearranges one basket you pick), Shuffle all baskets (picks the mix that gives the most rolling toys somewhere to go), Lose a color (takes away every toy of one color) and Add a small basket (holds two toys). When the track jams, any helpers left are offered. Toys lets players leave out any toy pictures they don't like (kept on their device). Levels use up to nine colours, so at most one whole colour can be left out; a dealt level swaps it for a colour it doesn't use, which the solver doesn't mind since kinds are only labels to it. There's a timer with best times for each level, and a cat photo when you finish a level. There's no share link for Toy Box.

## Pounce

A sixth game in `pounce/`, a match-3 game with the toys from the toy library. Swap two toys next to each other (drag one onto the other, or tap one then the other) to line up three or more of a kind, and catch the toys each level asks for before the moves run out. Toys above drop into the gaps and new ones fall in, so one swap can set off more lines. Four in a line makes a toy with the zoomies that clears its row or column when it's matched, an L or T makes a bouncy toy that clears the squares around it, and five makes catnip, which clears every toy of the kind it's swapped with. Swapping two special toys sets both off. If no swap is left, the toys are shaken up. After a few seconds with nothing happening, two toys that can be swapped give a little wiggle.
There are 20 levels with more kinds of toy, more kinds to catch and more of each as you go; the move limits were tuned with a simulated player so it wins nearly every time at level 1 and about half the time at level 20. Running out of moves offers five more moves once per level (and then the level comes round again) or a fresh try. There's a timer with best times for each level, and a cat photo when you finish a level. Arrow keys and Space work too. At the end of the level list, Zen has no goals, no move limit and no timer, and just counts the toys you catch; it keeps your place in the levels for when you go back. Toys lets players leave out any toy pictures they don't like (kept on their device); a colour with no pictures left isn't dealt, and at least six colours have to stay in play since the bigger levels and zen use six kinds.

## Twirl

A seventh game in `twirl/`. Satin ribbons cover the whole mat; tap one and it slides off the way its pointed end points, following its own path, but only if nothing is in the way. A blocked tap costs a life, as in Catdoku: three lives, and running out offers a restart, new ribbons, or three more lives (up to nine). There are 20 levels, from an 18 × 27 mat of shorter ribbons to a 28 × 42 mat of long, winding ones; a level finished on the first three lives moves you up. Big mats zoom (pinch, − and +, or Ctrl/⌘ + scroll) and you drag to look around.
Every ribbon wears its own colourway from `colorways.js` (shared with Yarn), chosen to stand apart from the ribbons it touches. Early levels have solid ribbons in a mix of flat and twisty textures, which makes them easy to tell apart; later levels shade each ribbon through its colourway (ombré) and use one flat texture, so you follow ribbons by shape. Ribbons come as coils, spirals, staircases, zigzags and winding paths.
Mats are made by covering every square with ribbons, then pointing each one and playing the board through: when nothing can move, a ribbon is turned round (or, as a last resort, cut in two) so something can, choosing the one that opens up latest so few moves are open at once. The playthrough is a solution, and the board is played through again to be sure, so every mat can be cleared.

## Toe Beans

An eighth game in `toebeans/`, a numbers puzzle on a cat's paw. Six numbers sit in tiles above the paw; the paw's four toe beans are + − × ÷ and its big pad shows the goal. Tap a number, a toe bean, then another number: the two combine and the answer takes the second number's place. Make the goal exactly (you don't have to use every number) and every pad on the paw fills at once, in a real paw pad colour (pink, rose, cinnamon, chocolate, grey or black) picked for that game.
There are 10 levels; higher ones have bigger goals that need more steps (two at level 1, five at level 10). Hitting the goal moves you up a level. If you're stuck, Finish here ends the game with your closest number: within 10 keeps your level, further off moves you back one, and the card shows one way it could have been made. Undo is free. Little paws at the top show your last five games. Every goal is checked in a background Web Worker to need exactly the level's number of steps. There's a timer with best times for each level, a share link, and a cat photo when you hit the goal.

## Knock It Off

A ninth game in `knockitoff/`: a cat pushes things off a tabletop. Walk into a thing to push it one square; push it past the edge and it falls off with a crash. The cat can only push, never pull, only one thing at a time, and never steps off the table. Mugs, glasses, succulents, vases and phones push one square; balls of yarn and pencils roll until they hit something; lamps and piles of books won't budge; grey walls along a side stop things falling there. Your food bowl has to stay on the table, so knocking it off ("Not that one!") offers Undo or Restart. A lit candle pushes one square too, but it mustn't end up next to a pile of books ("Fire!"), and once it falls off you have 6 moves to knock off a glass of water or a vase to put the fire out ("The fire spread!"); a flame by the table and a count beside the moves show the fire while it burns. A key under the table shows what to knock off, what to protect and what won't budge.
Swipe or use the arrow keys (or WASD) to step, or tap a square and the cat walks there the shortest way. Undo and Restart are free. Hint shows the next step on one of the shortest ways to clear the table, and after each move a note says if something has got stuck for good.
There are 20 levels, from a 5 × 5 table with three things up to 8 × 8 tables with lamps, books, walls, rolling things, a food bowl and an L- or U-shaped table. Something new arrives at each of the first seven levels: lamps and books at level 2, rolling things at 3, walls at 4, the food bowl at 5, odd-shaped tables at 6 and the candle at 7; after that the tables grow and mix everything, with a candle on every other level. Each table is dealt at random in a background Web Worker and kept only if it can be cleared and needs at least a set number of moves for its level; the same search finds the fewest moves possible. It searches push by push (the cat walks the shortest way between pushes), skips squares a thing could never be pushed off from, and keeps count of the fire's moves. Clearing the table moves you up a level unless you used a hint, and clearing it in the fewest moves possible without a hint earns a gold paw. There's a timer with best times for each level, a share link, and a cat photo when you clear a table.

## Toy library

`toys/` holds 32 cat toy pictures for any game to use: 256 × 256 WebP with a clear background, named by what they are (`wiffle-red`, `fish`, `cork-paw`…). The ones in `toys/` are recoloured to the games' palette; `toys/original/` has the same toys in their first colours, and `toys/earlier/` an earlier set.

## License

The code is under the [MIT License](LICENSE), so you're welcome to learn from it and reuse it.
The artwork (the cat pictures and app icons) is all rights reserved; see [ARTWORK.md](ARTWORK.md).
