# Moving Day: the simulated players

`rules.js` reads the rules (`movingRules`) out of `movingday/index.html`, so these always test what the page plays.

- `node sim3.js [from] [to] [rooms]`: deals rooms at each level and plays them with the careful player (who sets
  whether a room is dealt: it must win, and where there's energy, nap at least once with no cat mischief) and the
  careless one (snacks at once, feeds whoever). Prints the tries a deal took, the careful player's naps, and how often
  the careless one wins or is sent to bed.
- `node rand.js`: a player making random moves, 300 rooms a level, to find dead ends (it should win every one).
