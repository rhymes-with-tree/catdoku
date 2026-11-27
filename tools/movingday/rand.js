const R = require("./rules.js")();
for (let n = 1; n < R.LEVELS.length; n++) {
  let won = 0, full = 0, roomy = 0, ex = null;
  for (let s = 0; s < 300; s++) {
    const g = R.deal(n, s * 31 + 1); let r = R.rngOf(s + 99);
    for (let k = 0; k < 800 && !g.won; k++) {
      let cs = R.choices(g);
      if (!cs.length) { if (R.shoo(g).length) continue; break; }
      R.doChoice(g, cs[Math.floor(r() * cs.length)]);
    }
    if (g.won) won++; else if (g.sq.some(x => !x.item && !x.box)) { roomy++; ex = ex || g.sq.filter(x => x.item).map(x => x.item).join(","); } else full++;
  }
  console.log(`L${n}: random player won ${won}/300, jammed full ${full}, stuck with room ${roomy}${ex ? " e.g. " + ex : ""}`);
}
