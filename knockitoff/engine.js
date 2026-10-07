/* The rules of Knock It Off, shared by the game page, its background workers and tools/make-tables.js:
   what each thing does, one step of the cat, the solver that finds the fewest moves, and live table dealing. */
// Directions are numbered 0 up, 1 down, 2 left, 3 right. Walls are a bitmask of sides: 1 top, 2 bottom, 4 left, 8 right.
// Each level: [width, height, things that push, things that roll, things that won't budge, walled sides,
// food bowls, odd-shaped table (0 or 1), fewest moves a table must need, candles, catnip patches, strips of tape,
// rolls of paper towel (0 or 1)].
// (A function, so the worker gets it too.)
function kioLevels(n) {
  return [null,
    [5, 5, 3, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0], [5, 5, 3, 0, 1, 0, 0, 0, 10, 0, 0, 0, 0], [6, 5, 3, 1, 1, 0, 0, 0, 12, 0, 0, 0, 0], [6, 6, 3, 1, 2, 1, 0, 0, 14, 0, 0, 0, 0],
    [6, 6, 3, 1, 2, 1, 1, 0, 15, 0, 0, 0, 0], [6, 6, 3, 1, 2, 1, 1, 1, 15, 0, 0, 0, 0], [7, 6, 3, 1, 3, 1, 1, 0, 18, 1, 0, 0, 0], [7, 6, 4, 2, 3, 1, 1, 1, 18, 0, 2, 0, 0],
    [7, 7, 3, 1, 4, 2, 1, 0, 20, 1, 1, 1, 0], [7, 7, 3, 1, 3, 1, 1, 0, 18, 0, 0, 2, 1], [7, 7, 3, 1, 4, 1, 1, 0, 21, 1, 1, 1, 0], [7, 7, 3, 1, 5, 2, 1, 1, 20, 0, 1, 2, 1],
    [8, 7, 3, 1, 5, 1, 1, 0, 23, 1, 1, 1, 0], [8, 7, 3, 1, 5, 2, 1, 1, 21, 0, 2, 2, 1], [8, 7, 4, 1, 5, 1, 1, 1, 24, 1, 2, 2, 0], [7, 7, 3, 1, 5, 2, 1, 1, 21, 1, 1, 2, 1],
    [8, 7, 3, 2, 6, 2, 1, 1, 24, 1, 2, 2, 0], [8, 8, 3, 1, 7, 2, 1, 1, 23, 0, 2, 2, 1], [8, 8, 3, 1, 7, 2, 1, 1, 24, 1, 3, 2, 0], [8, 8, 3, 1, 7, 2, 1, 1, 24, 1, 2, 2, 1]][n];
}
// What each kind of thing does: 0 pushes one square, 1 rolls, 2 must stay on the table, 3 won't budge,
// 4 the candle (pushes one square, never next to books, and starts a fire when it falls), 5 water (pushes one
// square, and puts the fire out when it falls), 6 the roll of paper towel (see kioRollPush).
function kioCls(k) { return "mshL".includes(k) ? 0 : "gv".includes(k) ? 5 : "yi".includes(k) ? 1 : k === "f" ? 2 : k === "c" ? 4 : k === "p" ? 6 : 3; }
// Moves you have to knock water off after the candle falls.
function kioFireMoves() { return 6; }

// The table ready for moving about on: nxt[c * 4 + d] is the square next to c in direction d,
// -1 if that's off the table and -2 if a wall is in the way. Squares with lemons or books are marked in `fixed`,
// and the squares beside books (where the candle would set them alight) in `bookAdj`.
function kioBoard(t) {
  const {W, H, on, walls} = t, nxt = new Int16Array(W * H * 4), D = [[0, -1], [0, 1], [-1, 0], [1, 0]], WB = [1, 2, 4, 8];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) for (let d = 0; d < 4; d++) {
    const nx = x + D[d][0], ny = y + D[d][1], c = y * W + x, edge = nx < 0 || ny < 0 || nx >= W || ny >= H;
    nxt[c * 4 + d] = edge && (walls & WB[d]) ? -2 : edge || !on[ny * W + nx] ? -1 : ny * W + nx;
  }
  const fixed = new Uint8Array(W * H), bookAdj = new Uint8Array(W * H), cost = new Uint8Array(W * H).fill(1);
  for (const c of t.nip || []) cost[c] = 3;   // catnip: the cat rolls about, and the step counts as 3 moves
  const tape = new Uint8Array(W * H);         // tape: the cat won't step on it, though things slide over it
  for (const c of t.tape || []) tape[c] = 1;
  for (const it of t.items) if (kioCls(it.k) === 3) {
    fixed[it.c] = 1;
    if (it.k === "b") for (let d = 0; d < 4; d++) { const n = nxt[it.c * 4 + d]; if (n >= 0) bookAdj[n] = 1; }
  }
  // With a roll of paper towel about, tape can be papered over later, so it isn't out of bounds for good.
  const roll = t.items.find(it => it.k === "p"), candleNo = roll ? bookAdj : bookAdj.map((v, c) => v | tape[c]);
  return {W, H, on, walls, nxt, fixed, bookAdj, cost, nip: (t.nip || []).length > 0, tape, candleNo, roll: roll ? roll.u : -1};
}
// A push of the roll of paper towel at c in direction d. Its loose end points direction u.
// - Pushed the way it unrolls (d = u), it moves one square and lays paper on the square it leaves and the
//   one it ends on. The paper stays joined to the roll: `tail` counts the squares of joined paper, starting
//   under the roll and running back behind it.
// - Pushed the other way, it rolls like yarn and winds its joined paper back up as it goes. Paper on tape is
//   stuck down, so it tears off there and stays. Like yarn, it stops on tape or on loose paper.
// - Pushed sideways it moves one square, and the joined paper tears off and stays.
// `paper` (a 0/1 array, one per square) is changed in place; `blocked(n)` says if something stands on square n.
// Returns where the roll ends up, whether it fell, the joined paper left and the squares it passed, or null.
function kioRollPush(b, c, u, d, tail, paper, blocked) {
  const OPP = [1, 0, 3, 2], first = b.nxt[c * 4 + d];
  if (first === -2 || (first >= 0 && blocked(first))) return null;
  if (d === u) {
    paper[c] = 1;
    if (first === -1) return {cc: c, fall: true, tail: 0, trail: []};
    paper[first] = 1;
    return {cc: first, fall: false, tail: tail ? tail + 1 : 2, trail: [first]};
  }
  if (d !== OPP[u]) return first === -1 ? {cc: c, fall: true, tail: 0, trail: []} : {cc: first, fall: false, tail: 0, trail: [first]};
  let cc = c, t = tail, fall = false; const trail = [];
  for (;;) {
    const n = b.nxt[cc * 4 + d];
    if (n === -2 || (n >= 0 && blocked(n))) break;
    // leaving cc: wind up the paper under it, unless the paper is stuck to tape
    if (t > 0) { if (b.tape[cc]) t = 0; else { paper[cc] = 0; t--; } }
    if (n === -1) { fall = true; break; }
    cc = n; trail.push(cc);
    if (b.tape[cc] || (paper[cc] && t === 0)) break;
  }
  return {cc, fall, tail: fall ? 0 : t, trail};
}
// One step of the cat in direction d, or null if it can't go. s: {cat, items: [{id, k, c}], fire: moves left to put
// out a fire (0 for none)}. Returns the new cat, items and fire, how many moves the step counts as (3 onto catnip),
// which thing moved and the squares it passed, whether it fell off, and `why` when the step loses the table
// ("bowl", "books" or "fire").
function kioMove(b, s, d) {
  const t = b.nxt[s.cat * 4 + d], paper = new Uint8Array(b.W * b.H);
  for (const c of s.paper || []) paper[c] = 1;
  const taped = c => b.tape[c] && !paper[c];   // paper over tape makes it safe to walk on
  if (t < 0 || taped(t)) return null;
  let fire = s.fire || 0, why = "", doused = false; const cost = b.cost[t];
  const hit = s.items.find(it => it.c === t);
  let res = {cat: t, items: s.items, moved: -1, trail: [], fell: false, paper: s.paper || [], tail: s.tail || 0};
  if (hit) {
    const m = kioCls(hit.k);
    if (m === 3) return null;
    let c = t, fell = false, trail = [];
    if (m === 6) {
      const r = kioRollPush(b, t, hit.u, d, s.tail || 0, paper, n => s.items.some(o => o.c === n));
      if (!r) return null;
      ({cc: c, fall: fell, trail} = r);
      res.tail = r.tail;
      res.paper = []; paper.forEach((v, q) => { if (v) res.paper.push(q); });
    } else for (;;) {
      const n = b.nxt[c * 4 + d];
      if (n === -2) break;
      if (n === -1) { fell = true; break; }
      if (s.items.some(o => o.c === n)) break;
      c = n; trail.push(c);
      if (m !== 1 || b.tape[c] || paper[c]) break;   // rolling things stop on tape or paper
    }
    if (!fell && c === t) return null;
    const items = fell ? s.items.filter(o => o !== hit) : s.items.map(o => o === hit ? {...o, c} : o);
    res = {...res, cat: t, items, moved: hit.id, trail, last: c, fell, kind: hit.k};
    if (fell && m === 2) why = "bowl";
    if (!fell && m === 4 && b.bookAdj[c]) why = "books";
    if (fell && m === 5 && fire > 0 && cost <= fire) { fire = 0; doused = true; }
    if (fell && m === 4) { res.fire = kioFireMoves(); res.lit = true; }
  }
  if (!res.lit) {
    if (fire > 0 && !doused) { fire = Math.max(0, fire - cost); if (fire === 0) why = why || "fire"; }
    res.fire = fire; res.doused = doused;
  }
  res.why = why; res.broke = !!why; res.cost = cost;
  return res;
}
function kioClear(items, fire) { return !fire && items.every(it => kioCls(it.k) === 2 || kioCls(it.k) === 3); }

// Fewest pushes a thing on each square needs to go over the edge, with nothing else in the way (255: never).
// `avoid` marks squares the thing mustn't stop on: tape (the cat could never reach it again), and for the candle
// the squares beside books too.
// With a roll of paper towel on the table, tape might get papered over, so it's left out of the count.
function kioPushDist(b, avoid = b.roll >= 0 ? null : b.tape) {
  const N = b.W * b.H, OPP = [1, 0, 3, 2], pd = new Uint8Array(N).fill(255), no = c => b.fixed[c] || (avoid && avoid[c]);
  for (let changed = true; changed;) {
    changed = false;
    for (let c = 0; c < N; c++) if (b.on[c] && !no(c)) for (let d = 0; d < 4; d++) {
      const p = b.nxt[c * 4 + OPP[d]];
      if (p < 0 || b.fixed[p] || (b.roll < 0 && b.tape[p])) continue;
      const n = b.nxt[c * 4 + d], v = n === -1 ? 1 : n >= 0 && !no(n) && pd[n] < 255 ? pd[n] + 1 : 255;
      if (v < pd[c]) { pd[c] = v; changed = true; }
    }
  }
  return pd;
}
// Fewest moves to clear the table. It searches push by push: between pushes the cat walks the shortest way,
// so a push costs the walk to the square behind the thing plus one. It looks first where the moves so far
// plus the fewest pushes still needed is smallest. Returns the moves, -1 if the table can't be cleared, or -2
// if finding out would mean looking at more than `limit` positions.
// s: {cat, items: [code], fire, paper: [square], tail} with code = square * 8 + what it does (kioCls), lemons
// and books left out; paper and tail as in kioRollPush.
function kioFewest(b, s, limit) {
  const N = b.W * b.H, OPP = [1, 0, 3, 2], FIRE = kioFireMoves();
  const pd = b.pd || (b.pd = kioPushDist(b)), pdC = b.pdC || (b.pdC = kioPushDist(b, b.candleNo));
  const need = items => { let h = 0; for (const code of items) { const m = code & 7; if (m === 0 || m === 5) h += pd[code >> 3]; else if (m === 4) h += pdC[code >> 3]; else if (m === 1 || m === 6) h += 1; } return h; };
  const has = (items, m) => items.some(code => (code & 7) === m);
  const done = (items, r) => !r && items.every(code => (code & 7) === 2);
  const r0 = s.fire || 0;
  if (done(s.items, r0)) return 0;
  if ((has(s.items, 4) || r0) && !has(s.items, 5)) return -1;   // a fire with no water left to put it out
  const key = (cat, r, items, tail, paper) => String.fromCharCode(cat, r, tail, items.length, ...items, ...paper);
  const h0 = need(s.items); if (h0 >= 255) return -1;
  const p0 = (s.paper || []).slice().sort((x, y) => x - y), t0 = s.tail || 0;
  const best = new Map([[key(s.cat, r0, s.items, t0, p0), 0]]), buckets = [];
  buckets[h0] = [{cat: s.cat, items: s.items, r: r0, g: 0, tail: t0, paper: p0}];
  const occ = new Int16Array(N), dist = new Int16Array(N), queue = new Int16Array(N), pap = new Uint8Array(N);
  const taped = c => b.tape[c] && !pap[c];
  let goal = Infinity, expanded = 0;
  for (let f = h0; f < buckets.length && f < goal; f++) {
    const bucket = buckets[f]; if (!bucket) continue;
    for (let bi = 0; bi < bucket.length; bi++) {
      const st = bucket[bi], g = st.g;
      if (best.get(key(st.cat, st.r, st.items, st.tail, st.paper)) < g) continue;
      if (++expanded > limit) return -2;
      occ.fill(-1); st.items.forEach((code, i) => { occ[code >> 3] = i; });
      pap.fill(0); for (const c of st.paper) pap[c] = 1;
      dist.fill(-1); dist[st.cat] = 0; queue[0] = st.cat;
      if (!b.nip) for (let hh = 0, t = 1; hh < t; hh++) {
        const c = queue[hh];
        for (let d = 0; d < 4; d++) { const n = b.nxt[c * 4 + d]; if (n >= 0 && dist[n] < 0 && !b.fixed[n] && !taped(n) && occ[n] < 0) { dist[n] = dist[c] + 1; queue[t++] = n; } }
      } else {   // with catnip some steps cost 3, so walk the squares in order of distance
        const byDist = [[st.cat]];
        for (let dd = 0; dd < byDist.length; dd++) for (const c of byDist[dd] || []) {
          if (dist[c] !== dd) continue;
          for (let d = 0; d < 4; d++) {
            const n = b.nxt[c * 4 + d];
            if (n < 0 || b.fixed[n] || taped(n) || occ[n] >= 0) continue;
            const nd = dd + b.cost[n];
            if (dist[n] < 0 || nd < dist[n]) { dist[n] = nd; (byDist[nd] || (byDist[nd] = [])).push(n); }
          }
        }
      }
      for (let i = 0; i < st.items.length; i++) {
        const code = st.items[i], c = code >> 3, m = code & 7;
        if (taped(c)) continue;   // out of reach: the cat won't step onto the tape to push it
        for (let d = 0; d < 4; d++) {
          const p = b.nxt[c * 4 + OPP[d]];
          if (p < 0 || dist[p] < 0) continue;
          let cc = c, fall = false, tail = st.tail, paper = st.paper;
          if (m === 6) {
            const before = pap.slice(), rp = kioRollPush(b, c, b.roll, d, st.tail, pap, n => b.fixed[n] || occ[n] >= 0);
            if (rp) { cc = rp.cc; fall = rp.fall; tail = rp.tail; paper = []; pap.forEach((v, q) => { if (v) paper.push(q); }); }
            pap.set(before);
            if (!rp) continue;
          } else for (;;) {
            const n = b.nxt[cc * 4 + d];
            if (n === -2) break;
            if (n === -1) { fall = true; break; }
            if (b.fixed[n] || occ[n] >= 0) break;
            cc = n;
            if (m !== 1 || b.tape[cc] || pap[cc]) break;   // rolling things stop on tape or paper
          }
          if (!fall && cc === c) continue;
          if (fall && m === 2) continue;
          if (!fall && m === 4 && (b.bookAdj[cc] || pdC[cc] === 255)) continue;   // books alight, or stuck for good
          if (!fall && (m === 0 || m === 5) && pd[cc] === 255) continue;          // stuck for good
          // stopped on bare tape: out of reach for good, since paper can't go under it
          if (!fall && m !== 2 && b.tape[cc] && !paper.includes(cc)) continue;
          const step = dist[p] + b.cost[c];
          let r = 0;
          if (st.r) {   // a fire is burning: water must go over within the moves left
            if (fall && m === 5) { if (step > st.r) continue; }
            else { if (step >= st.r) continue; r = st.r - step; }
          } else if (fall && m === 4) r = FIRE;
          const items = st.items.slice();
          if (fall) items.splice(i, 1); else { items[i] = cc * 8 + m; items.sort((x, y) => x - y); }
          if ((r || has(items, 4)) && !has(items, 5)) continue;
          const cost = g + step, k = key(c, r, items, tail, paper);
          if (cost >= goal) continue;
          const prev = best.get(k);
          if (prev !== undefined && prev <= cost) continue;
          best.set(k, cost);
          if (done(items, r)) { goal = cost; continue; }
          const fn = cost + need(items);
          if (fn >= goal) continue;
          (buckets[fn] || (buckets[fn] = [])).push({cat: c, items, r, g: cost, tail, paper});
        }
      }
    }
  }
  return goal === Infinity ? -1 : goal;
}
function kioCodes(items) { return items.filter(it => kioCls(it.k) !== 3).map(it => it.c * 8 + kioCls(it.k)).sort((x, y) => x - y); }

// Deal a table for level n: random things on a random table, kept only if it can be cleared and needs enough moves.
function makeKnockItOff(n) {
  const [W, H, np, nr, nf, nw, nb, odd, minSteps, nc, nn, nt, npt] = kioLevels(n), rnd = () => Math.random();
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  for (let tries = 0; tries < 300; tries++) {
    const on = new Array(W * H).fill(1);
    if (odd) {   // cut a block from a corner (an L) or from the middle of a side (a U)
      const cw = 2 + Math.floor(rnd() * (W / 2 - 1)), ch = 2 + Math.floor(rnd() * (H / 2 - 1));
      const x0 = rnd() < .6 ? (rnd() < .5 ? 0 : W - cw) : Math.floor((W - cw) / 2), y0 = rnd() < .5 ? 0 : H - ch;
      for (let y = y0; y < y0 + ch; y++) for (let x = x0; x < x0 + cw; x++) on[y * W + x] = 0;
    }
    let walls = 0; const sides = shuffle([1, 2, 4, 8]);
    for (let i = 0; i < nw; i++) walls |= sides[i];
    const cells = shuffle([...Array(W * H).keys()].filter(c => on[c]));
    const pushes = shuffle("mgsvhL".split("")), rolls = shuffle("yi".split("")), still = shuffle("lb".split(""));
    // a candle needs some water on the table
    if (nc && !pushes.slice(0, np).some(k => "gv".includes(k))) { const w = pushes.indexOf("g"); [pushes[0], pushes[w]] = [pushes[w], pushes[0]]; }
    const items = []; let i = 0;
    for (let j = 0; j < nf; j++) items.push({id: items.length, k: nc && j === 0 ? "b" : still[j % 2], c: cells[i++]});
    for (let j = 0; j < np; j++) items.push({id: items.length, k: pushes[j % 6], c: cells[i++]});
    for (let j = 0; j < nr; j++) items.push({id: items.length, k: rolls[j % 2], c: cells[i++]});
    for (let j = 0; j < nb; j++) items.push({id: items.length, k: "f", c: cells[i++]});
    for (let j = 0; j < nc; j++) items.push({id: items.length, k: "c", c: cells[i++]});
    for (let j = 0; j < (npt || 0); j++) items.push({id: items.length, k: "p", c: cells[i++], u: Math.floor(rnd() * 4)});
    const cat = cells[i], nip = cells.slice(i + 1, i + 1 + nn), free = new Set(cells.slice(i + 1 + nn)), tape = [];
    // strips of tape, two or three squares long, on empty squares
    for (let k = 0, tries2 = 0; k < nt && tries2 < 40; tries2++) {
      const start = [...free][Math.floor(rnd() * free.size)], dx = rnd() < .5 ? 1 : 0, dy = 1 - dx, len = 2 + Math.floor(rnd() * 2), strip = [];
      for (let q = 0, x = start % W, y = Math.floor(start / W); q < len; q++, x += dx, y += dy) {
        const c = y * W + x; if (x >= W || y >= H || !free.has(c)) break; strip.push(c);
      }
      if (strip.length < 2) continue;
      strip.forEach(c => { free.delete(c); tape.push(c); }); k++;
    }
    const t = {N: n, W, H, on, walls, cat, items, nip, tape};
    const b = kioBoard(t); b.pd = kioPushDist(b); b.pdC = kioPushDist(b, b.candleNo);
    if (items.some(it => { const m = kioCls(it.k); return ((m === 0 || m === 1 || m === 5 || m === 6) && b.pd[it.c] === 255) || (m === 4 && b.pdC[it.c] === 255); })) continue;
    const best = kioFewest(b, {cat, items: kioCodes(items), fire: 0}, npt ? 60000 : 25000);
    if (best >= minSteps) return Object.assign(t, {best});
  }
  return null;
}
// For a table in play: the fewest moves left, and (with q.first) a first step on one way to do it.
function kioAdvice(q) {
  const b = kioBoard(q), fewest = kioFewest(b, {cat: q.cat, items: kioCodes(q.items), fire: q.fire || 0, paper: q.paper, tail: q.tail}, q.limit);
  if (!q.first || fewest <= 0) return {fewest, first: -1};
  for (let d = 0; d < 4; d++) {
    const r = kioMove(b, q, d);
    if (!r || r.broke) continue;
    const f = kioClear(r.items, r.fire) ? 0 : kioFewest(b, {cat: r.cat, items: kioCodes(r.items), fire: r.fire, paper: r.paper, tail: r.tail}, q.limit);
    if (f >= 0 && f + r.cost === fewest) return {fewest, first: d};
  }
  return {fewest, first: -1};
}

if (typeof module !== "undefined") module.exports = {kioLevels, kioCls, kioFireMoves, kioBoard, kioRollPush, kioMove, kioClear, kioPushDist, kioFewest, kioCodes, makeKnockItOff, kioAdvice};
