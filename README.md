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

## Patches

A third puzzle in `patches/`: sew a quilt by giving every patch one of four fabrics so no two patches that share a seam match.
Patches with a button come already sewn. Every quilt is generated in the browser and checked to have exactly one solution.

## Sunbeams

A fourth puzzle in `sunbeams/`, a cat-themed Shikaku: every number is a cat, and each cat needs a rectangle of sunlight with exactly that many squares, until the whole floor is sunny.
Each sunbeam gets a sleeping cat of the right size and shape, stretched out to fill it. The cat pictures live in `cats/` so any game can use them.
