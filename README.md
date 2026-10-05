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

## Patches

A third puzzle in `patches/`: sew a quilt by giving every patch one of four fabrics so no two patches that share a seam match.
Patches with a button come already sewn. Every quilt is generated in the browser and checked to have exactly one solution.

## Sunbeams

A fourth puzzle in `sunbeams/`, a cat-themed Shikaku: every number is a cat, and each cat needs a rectangle of sunlight with exactly that many squares, until the whole floor is sunny.
Each sunbeam gets a sleeping cat of the right size and shape, stretched out to fill it. The cat pictures live in `cats/` so any game can use them.

## Toy Box (prototype)

A sorting game in `toybox/`, not linked from the other pages yet. Tap a wicker basket to tip its front toys onto a winding ball track; each toy drops into the first basket it reaches whose front toy matches, or the first empty basket, so timing a tap decides where toys go. Toys go once round before they can return to their own basket. If the two front toys differ, the one you tap is the one sent. Fill a basket with eight of one toy and it's carried off, basket and all, so there are fewer baskets to work with as you go.
Levels get harder until about level 21: up to all nine kinds of toy, a track that shrinks from 16 spaces to 5, more hidden toys and more split pairs. The track holds fewer toys as levels go on, and more toys start hidden in the back rows of baskets (a level hides none, or at least four toys of at least two kinds). From level 4 some matching pairs are dealt split up, so toys aren't always side by side with their match. If the track fills and nothing can find a basket, it jams. Every level is checked by a solver in a background Web Worker before it's dealt, so it can always be won with the right timing (the solver follows the same first-basket rule, and treats which rolling toy reaches an empty basket first as the player's choice). Toys are pictures in `toybox/toys/` (256 × 256 WebP with a clear background, nine kinds, one per colour; some colours have more than one picture and each level picks one), with drawn stand-ins if a picture is missing. Each level has one shake (rearranges one basket you pick), one shuffle (mixes every basket, picking the mix that gives the most rolling toys somewhere to go), one rainbow (takes away every toy of one kind) and one small basket (holds two toys). When the track jams, any helpers left are offered.

## License

The code is under the [MIT License](LICENSE), so you're welcome to learn from it and reuse it.
The artwork (the cat pictures and app icons) is all rights reserved; see [ARTWORK.md](ARTWORK.md).
