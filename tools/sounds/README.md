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
- Every row has None, Something else (with a box to say what), Another sound… (any sound on the page, searched), and
  its own Volume · Length. Picks are kept by the choice's name (`sc.picks2`), so taking a choice away moves nothing.
- `DROPPED` takes choices off the page (the mrrp, and Moonpie's recordings outside the Moonpie games); a row whose sound in
  the games was one of them shows under Pick again.
- Sounds used in more than one place: each row's pick is recorded (what it would play, with the dice fixed), and rows
  that record the same play the same sound. Recording also finds the rows that offer one of the better sounds of
  2026-11-14 (Better sounds to hear).
- Send opens the site's feedback form (Google Forms) in a new tab with the picks in its last field; Copy instead copies
  them. It's what testers use too.
- The sounds are made as in `games.js` (`G.sound`), at the games' length (the Length slider, 55%) so what's heard here
  is what plays in the games. When a shelf's picks go into the games, mark its sections `inGame` and add its picks to
  `IN_GAME`.
