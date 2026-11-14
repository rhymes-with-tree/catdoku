# The listening page

`sound-check.html` is the source of the Sound Check page the owner picks every sound from, published as an artifact
(https://claude.ai/artifact/AiHXuVwvwB5CJSBPvgGNKS, the owner's own). It's kept here so it can't be lost: edit it here,
then publish it again to the same artifact with the three Moonpie clips beside it (`purr-short.mp3`, `snore-one.mp3`,
`snore-two.mp3`, short cuts of the recordings in `cats/`; the page loads them by those names).

How it's laid out:
- `SECTIONS` holds every game's rows of choices. The shelf being picked has `current: true` and shows at the top under
  "New to pick", with a dot on each row not heard yet; a shelf already in the games has `inGame: true` and is folded
  away under its shelf's name, its rows marked with what's in the games (`IN_GAME`, the owner's picks).
- Each shelf's sections are added as a block (`PROWL`, `KITTEN`, `LOGIC`, `MATH`…) and named in `SHELVES`.
- Copy my picks copies the current shelf's picks, and any change to what's in the games.
- The sounds are made as in `games.js` (`G.sound`), at the games' length (the Length slider, 55%) so what's heard here
  is what plays in the games. When a shelf's picks go into the games, mark its sections `inGame` and add its picks to
  `IN_GAME`.
