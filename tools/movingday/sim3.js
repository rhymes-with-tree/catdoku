const mk = require("./rules.js");
const args = process.argv.slice(2), n0 = +args[0] || 1, n1 = +args[1] || 12, per = +args[2] || 80;
const R = mk();
const avg = a => (a.reduce((x, y) => x + y, 0) / a.length).toFixed(2);
for (let n = n0; n <= n1; n++) {
  let tries = [], pw = 0, bed = 0, pn = [], pc = [], cn = [], ms = [], t0 = Date.now(), fails = 0;
  for (let s = 0; s < per; s++) {
    const g = R.deal(n, s * 1013 + 7); tries.push(g.tries); if (g.tries > 80) fails++;
    const c = R.play(R.clone(g), true); cn.push(c.naps);
    const p = R.play(R.clone(g)); if (p.won) pw++; if (p.bed) bed++; pn.push(p.naps); pc.push(p.crimes || 0); ms.push(p.moves);
  }
  console.log(`L${String(n).padEnd(2)} tries ${avg(tries)} max ${Math.max(...tries)}${fails ? ` FAILED ${fails}` : ""} | careful naps ${avg(cn)} | careless: won ${Math.round(pw / per * 100)}%, bed ${Math.round(bed / per * 100)}%, naps ${avg(pn)}, mischief ${avg(pc)} | moves ${avg(ms)} | ${((Date.now() - t0) / per).toFixed(0)}ms`);
}
