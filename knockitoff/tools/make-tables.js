#!/usr/bin/env node
/* Makes the ready-dealt tables for Knock It Off, using the game's own rules (../engine.js).

   For each level it deals twice as many tables as it keeps, counts the traps on each (pushes from the
   starting position that leave the table impossible to clear, like rolling something into a corner it
   can't leave, or a candle beside books), and keeps the tables with the most traps. They're written to
   ../tables/NN.json, which the game loads so a table is ready at once.

   node knockitoff/tools/make-tables.js                 every level, 300 tables each
   node knockitoff/tools/make-tables.js 7 8 --keep 200  just levels 7 and 8, 200 tables each

   Levels run in parallel, one per processor. Run it again after changing the rules or the level list. */
const fs = require("fs"), path = require("path"), os = require("os");
const {fork} = require("child_process");
const E = require("../engine.js");
const OUT = path.join(__dirname, "..", "tables");

// ---------- the table format ----------
// A table is a short string-heavy object: squares are written as two base-36 digits, and things as their
// letter followed by their square, in order (that order gives each thing its id). A roll of paper towel's
// direction (the way its loose end points) is `r`.
const sq = c => c.toString(36).padStart(2, "0");
function pack(t) {
  const off = []; t.on.forEach((v, c) => { if (!v) off.push(c); });
  const o = {w: t.W, h: t.H, c: sq(t.cat), i: t.items.map(it => it.k + sq(it.c)).join(""), b: t.best};
  if (t.walls) o.x = t.walls;
  if (off.length) o.o = off.map(sq).join("");
  if (t.nip && t.nip.length) o.n = t.nip.map(sq).join("");
  if (t.tape && t.tape.length) o.t = t.tape.map(sq).join("");
  const roll = t.items.find(it => it.k === "p"); if (roll) o.r = roll.u;
  return o;
}

// ---------- traps ----------
// Every push the cat could make from the start (walking there first), and how many of them leave the
// table impossible to clear.
function traps(t) {
  const b = E.kioBoard(t), pd = E.kioPushDist(b), pdC = E.kioPushDist(b, b.candleNo);
  b.pd = pd; b.pdC = pdC;
  const occ = new Set(t.items.map(it => it.c)), seen = new Set([t.cat]), q = [t.cat];
  for (let h = 0; h < q.length; h++) for (let d = 0; d < 4; d++) {
    const n = b.nxt[q[h] * 4 + d];
    if (n >= 0 && !seen.has(n) && !occ.has(n) && !b.fixed[n] && !b.tape[n]) { seen.add(n); q.push(n); }
  }
  let count = 0;
  for (const p of seen) for (let d = 0; d < 4; d++) {
    const r = E.kioMove(b, {cat: p, items: t.items, fire: 0}, d);
    if (!r || r.moved < 0) continue;
    if (r.broke) { count++; continue; }
    const f = E.kioClear(r.items, r.fire) ? 0 : E.kioFewest(b, {cat: r.cat, items: E.kioCodes(r.items), fire: r.fire, paper: r.paper, tail: r.tail}, 1500);
    if (f === -1) count++;
  }
  return count;
}

// ---------- one level, in its own process ----------
function makeLevel(n, keep) {
  const tables = [];
  for (let i = 0; i < keep * 2; i++) {
    const t = E.makeKnockItOff(n);
    if (!t) { i--; continue; }
    tables.push({t, traps: traps(t)});
    if (process.send && i % 50 === 49) process.send({n, progress: i + 1, of: keep * 2});
  }
  // the most traps first; among equals, the ones that need more moves
  tables.sort((a, b) => b.traps - a.traps || b.t.best - a.t.best);
  const kept = tables.slice(0, keep);
  for (let i = kept.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [kept[i], kept[j]] = [kept[j], kept[i]]; }
  const file = path.join(OUT, String(n).padStart(2, "0") + ".json");
  fs.writeFileSync(file, JSON.stringify({level: n, tables: kept.map(k => pack(k.t))}) + "\n");
  const avg = kept.reduce((s, k) => s + k.traps, 0) / kept.length;
  return `level ${n}: kept ${kept.length} of ${tables.length}, traps ${kept[kept.length - 1] ? Math.min(...kept.map(k => k.traps)) : 0}+ (average ${avg.toFixed(1)}) -> ${path.relative(process.cwd(), file)}`;
}

if (process.argv[2] === "--child") {
  const n = +process.argv[3], keep = +process.argv[4];
  process.send({n, done: makeLevel(n, keep)});
} else {
  const args = process.argv.slice(2), ki = args.indexOf("--keep");
  const keep = ki >= 0 ? +args.splice(ki, 2)[1] : 300;
  const levels = args.length ? args.map(Number) : Array.from({length: 20}, (_, i) => i + 1);
  fs.mkdirSync(OUT, {recursive: true});
  // hardest first, so the slow levels start early
  const queue = levels.slice().sort((a, b) => b - a);
  const run = () => {
    const n = queue.shift(); if (n === undefined) return;
    const child = fork(__filename, ["--child", n, keep]);
    child.on("message", m => { if (m.done) console.log(m.done); else console.log(`level ${m.n}: ${m.progress}/${m.of}`); });
    child.on("exit", run);
  };
  for (let i = 0; i < Math.min(os.cpus().length, queue.length); i++) run();
}
