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

## More games

Linked from the top of every page, and sharing Catdoku's look and home-screen app:

- **Yarn** (`yarn/`): draw one strand from 1 through every number in order, filling every square.
- **Shikaku** (`shikaku/`): split the board into rectangles; each holds one number equal to its area.
- **Four Colors** (`four-colors/`): color a map with four colors so no two neighboring regions match.

Every puzzle is generated in the browser and checked to have exactly one solution.
Shared styling and helpers live in `games.css` and `games.js`.
