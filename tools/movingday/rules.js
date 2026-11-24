/* ---------- the rules (plain functions in one, tested in Node, then pasted into the page) ---------- */
// Moving Day: you've just moved in. Tap a box to unpack it: what's inside spills onto the nearest free floor. Drag
// two of the same thing together to make the next one along (two shoes make a pair); a finished thing goes away in its
// place. Clear the floor to win. From the kitchen on, everything you do takes energy; food gives it back; run out and
// you nap, and each cat you haven't fed gets up to mischief.
function movingRules() {
  // Each kind of thing: its names step by step, and where it goes once it's finished (its last step), or what it does.
  //  home: the place it's put away in; eat: energy it gives at each step; treat: the cats eat it; build: once
  //  finished, it's built where its home's outline is; fragile: knocked off, it breaks (from the breakages level on)
  const KINDS = {
    sh: {n: ["shoe", "pair of shoes"], home: "rack"},
    bk: {n: ["book", "two books", "pile of books"], home: "shelf"},
    ky: {n: ["key", "bunch of keys"], home: "hook"},
    eb: {n: ["empty box", "flattened boxes"], home: "door"},
    mg: {n: ["mug", "two mugs", "set of mugs"], home: "cupboard", fragile: 1},
    pl: {n: ["plate", "stack of plates"], home: "cupboard", fragile: 1},
    bi: {n: ["biscuit", "plate of biscuits"], eat: [2, 6]},
    kb: {n: ["kibble", "fish treat", "bowl of food"], treat: true},
    ke: {n: ["kettle"], home: "counter"},
    br: {n: ["loaf of bread"], home: "counter"},
    bu: {n: ["butter"], home: "fridge"},
    te: {n: ["cup of tea"], eat: [6]},
    to: {n: ["buttered toast"], eat: [5]},
    lb: {n: ["licked butter"], home: "door"},
    cu: {n: ["cushion", "pile of cushions"], home: "sofa"},
    pt: {n: ["succulent", "pair of succulents"], home: "sill", fragile: 1},
    fp: {n: ["plank", "two planks", "bookcase kit"], home: "shelf", build: 1},
    so: {n: ["sock", "pair of socks"], home: "drawers"},
    pi: {n: ["pillow", "pair of pillows"], home: "bed"},
    td: {n: ["teddy bear"], home: "bed"},
    pf: {n: ["photo frame", "two photo frames"], home: "drawers", fragile: 1},
    bc: {n: ["box cutter"], home: "drawers", tool: 1},
    gl: {n: ["glue"], home: "drawers", tool: 1},
    pe: {n: ["pen", "handful of pens", "pot of pens"], home: "desk"},
    nb: {n: ["notebook", "stack of notebooks"], home: "desk"},
  };
  // Two different things that go together: [a, b, makes, kept] (kept stays where it was: the kettle boils again)
  const COMBOS = [["ke1", "mg1", "te1", "ke1"], ["br1", "bu1", "to1", ""]];
  const PLACES = {
    door: "front door", rack: "shoe rack", shelf: "bookcase", hook: "key hook",
    cupboard: "cupboard", counter: "counter", fridge: "fridge",
    sofa: "sofa", sill: "windowsill", drawers: "chest of drawers", bed: "bed", desk: "desk",
  };
  // A broken thing is written with a "!" in front ("!mg1"): it can't be merged or put away until it's glued.
  const base = it => it[0] === "!" ? it.slice(1) : it, broken = it => it[0] === "!";
  const kindOf = it => KINDS[base(it).slice(0, 2)], kindId = it => base(it).slice(0, 2), stepOf = it => +base(it).slice(2), top = it => kindOf(it).n.length;
  const nameOf = it => (broken(it) ? "broken " : "") + kindOf(it).n[stepOf(it) - 1];
  const finished = it => !broken(it) && stepOf(it) === top(it);
  // The levels. size: the room W × H; places: the furniture things go away in, [id, x, y, wide, unbuilt] on the
  // room's squares; things: how many of each kind at its first step (some come already paired); boxes: how many;
  // empties: empty boxes stay on the floor (flatten two, take them out the door); labels: boxes say what's in them;
  // paws: how many labels a cat wrote (they may be wrong); cutter: the box cutter's in a box, and until it's out,
  // unpacking costs double; breaks: how many things come out broken (the glue's in a box too); stacked: how many
  // boxes stand on another; energy: [most, to start with]; crimes: what the cats can do and how many per nap;
  // combos; cats and wants: what each hungry cat asks for, one at a time.
  const KIT = ["knock", "tip", "butter", "boxnap"], LIV = ["knock", "tip", "hide", "boxnap"];
  const kib = (n, w) => Array.from({length: n}, () => w.slice());
  const LEVELS = [null,
    {room: "Hallway", size: [5, 4], places: [["rack", 0, 0, 2], ["shelf", 4, 0]], things: {sh: 4, bk: 4}, boxes: 3},
    {room: "Hallway", size: [5, 5], places: [["rack", 0, 0, 2], ["hook", 2, 0], ["shelf", 4, 0], ["door", 2, 4]], things: {sh: 6, bk: 8, ky: 6}, boxes: 6, labels: 1, empties: 1},
    {room: "Kitchen", size: [6, 5], places: [["cupboard", 0, 0], ["door", 3, 4]], things: {mg: 8, pl: 4, bi: 6}, boxes: 6, labels: 1, empties: 1,
      energy: [10, 8], crimes: [KIT, 1], cats: 2, wants: kib(2, ["kb1", "kb1", "kb1"])},
    {room: "Kitchen", size: [6, 5], places: [["cupboard", 0, 0], ["counter", 2, 0, 2], ["fridge", 5, 0], ["door", 3, 4]], things: {mg: 10, pl: 4, bi: 6, ke: 1, br: 1, bu: 1}, boxes: 8,
      labels: 1, empties: 1, energy: [10, 8], crimes: [KIT, 1], cats: 2, combos: 1, wants: kib(2, ["kb1", "kb1", "kb1"])},
    {room: "Kitchen", size: [7, 5], places: [["cupboard", 1, 0], ["counter", 3, 0, 2], ["fridge", 6, 0], ["door", 3, 4]], things: {mg: 10, pl: 6, bi: 6, ke: 1, br: 1, bu: 1}, boxes: 8,
      labels: 1, empties: 1, energy: [10, 8], crimes: [KIT, 1], cats: 2, combos: 1, wants: [["kb2", "kb1", "kb2"], ["kb1", "kb2", "kb2"]]},
    {room: "Kitchen", size: [7, 6], places: [["cupboard", 0, 0], ["counter", 2, 0, 2], ["fridge", 6, 0], ["door", 3, 5]], things: {mg: 12, pl: 8, bi: 14, ke: 1, br: 1, bu: 1}, boxes: 10,
      labels: 1, empties: 1, energy: [10, 8], crimes: [KIT, 2], cats: 3, combos: 1, wants: [["kb2", "kb1", "kb2"], ["kb1", "kb2", "kb1"], ["kb3", "kb1"]]},
    {room: "Living room", size: [7, 5], places: [["sofa", 0, 0, 2], ["sill", 3, 0], ["shelf", 6, 0, 1, 1], ["door", 3, 4]], things: {cu: 8, pt: 4, bk: 8, fp: 4, bi: 12}, boxes: 9,
      labels: 1, empties: 1, energy: [10, 8], crimes: [LIV, 1], cats: 2, wants: [["kb2", "kb1", "kb2"], ["kb1", "kb2", "kb1"]]},
    {room: "Living room", size: [7, 6], places: [["sofa", 2, 0, 2], ["sill", 5, 0], ["shelf", 0, 0, 1, 1], ["door", 3, 5]], things: {cu: 8, pt: 6, bk: 8, fp: 4, bi: 14}, boxes: 10,
      labels: 1, paws: 3, empties: 1, energy: [10, 8], crimes: [LIV, 2], cats: 2, wants: [["kb2", "kb1", "kb2"], ["kb1", "kb2", "kb2"]]},
    {room: "Bedroom", size: [7, 5], places: [["bed", 0, 0, 2], ["drawers", 4, 0], ["door", 3, 4]], things: {so: 10, pi: 4, td: 2, bi: 10}, boxes: 8,
      labels: 1, paws: 2, cutter: 1, empties: 1, energy: [10, 8], crimes: [LIV, 2], cats: 2, wants: [["kb2", "kb1", "kb2"], ["kb1", "kb2", "kb2"]]},
    {room: "Bedroom", size: [7, 6], places: [["bed", 0, 0, 2], ["drawers", 4, 0], ["shelf", 6, 0], ["door", 3, 5]], things: {so: 8, pi: 4, pf: 6, bk: 4, bi: 22}, boxes: 10,
      labels: 1, paws: 2, cutter: 1, breaks: 3, empties: 1, energy: [10, 8], crimes: [LIV, 2], cats: 3, wants: [["kb2", "kb1"], ["kb1", "kb2"], ["kb2", "kb2"]]},
    {room: "Study", size: [7, 6], places: [["desk", 0, 0, 2], ["shelf", 3, 0], ["drawers", 6, 0], ["door", 3, 5]], things: {pe: 12, nb: 6, bk: 8, pf: 4, bi: 28}, boxes: 12,
      labels: 1, paws: 2, cutter: 1, breaks: 2, stacked: 4, empties: 1, energy: [10, 8], crimes: [LIV, 2], cats: 3, wants: [["kb2", "kb1"], ["kb1", "kb2"], ["kb2", "kb1"]]},
    {room: "The whole flat", size: [8, 6], energy: [12, 10], places: [["cupboard", 0, 0], ["sofa", 1, 0, 2], ["shelf", 4, 0, 1, 1], ["desk", 5, 0, 2], ["drawers", 7, 0], ["door", 3, 5]],
      things: {mg: 8, cu: 6, bk: 8, fp: 4, pe: 8, pf: 4, so: 6, bi: 30}, boxes: 14,
      labels: 1, paws: 3, cutter: 1, breaks: 3, stacked: 4, empties: 1, crimes: [[...LIV, "butter"], 2], cats: 3, wants: [["kb2", "kb1", "kb2"], ["kb1", "kb2", "kb1"], ["kb2", "kb2"]]},
  ];
  function rngOf(seed) { return () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const shuffle = (a, r) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // A square: item ("sh1", "!mg1" broken) or ""; box: null or {inside: [items], label: kind, "misc" or "", paw: a cat
  // wrote it, open, under: the box it stands on, or null}; cat: the cat curled up in the empty box here (-1 none) and
  // how many more moves it stays; fix: what stands here for good, "p:cupboard" (furniture) or "c:0" (a cat's cushion).
  function makeLevel(n, seed) {
    const L = LEVELS[n], r = rngOf(seed), [W, H] = L.size, N = W * H;
    // the things, at their first step; now and then two come already together
    const things = [];
    const wants = (L.wants || []).map(w => w.slice());
    const kb = wants.flat().reduce((a, it) => a + (1 << (stepOf(it) - 1)), 0);
    const all = {...L.things}; if (kb) all.kb = kb; if (L.cutter) all.bc = 1; if (L.breaks) all.gl = 1;
    for (const k in all) {
      let c = all[k];
      while (c > 0) { if (c >= 2 && KINDS[k].n.length > 1 && !KINDS[k].build && r() < 0.18) { things.push(k + 2); c -= 2; } else { things.push(k + 1); c--; } }
    }
    // a few fragile things come out broken
    if (L.breaks) { const fr = shuffle(things.map((it, i) => i).filter(i => KINDS[things[i].slice(0, 2)].fragile), r); for (const i of fr.slice(0, L.breaks)) things[i] = "!" + things[i]; }
    // packed by kind: each kind gets its share of the boxes, then one thing swaps between two boxes (those say MISC)
    const B = L.boxes, by = {};
    for (const it of shuffle(things, r)) (by[kindId(it)] = by[kindId(it)] || []).push(it);
    const ks = Object.keys(by), total = things.length;
    const share = ks.map(k => Math.max(1, Math.min(by[k].length, Math.floor(by[k].length / total * B))));
    while (share.reduce((a, b) => a + b, 0) < B) { const k = ks.map((k, j) => j).filter(j => share[j] < by[ks[j]].length).sort((a, b) => by[ks[b]].length / share[b] - by[ks[a]].length / share[a])[0]; if (k === undefined) break; share[k]++; }
    while (share.reduce((a, b) => a + b, 0) > B) { const k = share.indexOf(Math.max(...share)); share[k]--; }
    const boxes = [];
    ks.forEach((k, j) => { const a = by[k]; for (let b = 0; b < share[j]; b++) boxes.push(a.slice(Math.round(b * a.length / share[j]), Math.round((b + 1) * a.length / share[j]))); });
    if (B >= 5) {
      const a = Math.floor(r() * boxes.length); let b = Math.floor(r() * boxes.length);
      if (kindId(boxes[a][0]) === kindId(boxes[b][0])) b = boxes.findIndex(x => kindId(x[0]) !== kindId(boxes[a][0]));
      if (b >= 0 && a !== b) { const i = Math.floor(r() * boxes[a].length), j = Math.floor(r() * boxes[b].length); [boxes[a][i], boxes[b][j]] = [boxes[b][j], boxes[a][i]]; }
    }
    shuffle(boxes, r);
    const roomKinds = Object.keys(all);
    const boxOf = inside => {
      const kinds = [...new Set(inside.map(kindId))];
      return {inside, label: !L.labels ? "" : kinds.length === 1 ? kinds[0] : "misc", paw: false, open: false, under: null};
    };
    const bx = boxes.map(boxOf);
    // the cats write a few labels themselves, and get them wrong as often as not (never the box cutter's)
    if (L.paws) for (const b of shuffle(bx.filter(b => !b.inside.includes("bc1")), r).slice(0, L.paws)) { b.paw = true; if (r() < 0.6) b.label = roomKinds.filter(k => k !== b.label && k !== "bc" && k !== "gl")[Math.floor(r() * (roomKinds.length - 2))] || b.label; }
    // some boxes stand on others (never the one with the box cutter)
    const tops = [];
    if (L.stacked) for (let k = 0; k < L.stacked; k++) { const i = bx.findIndex((b, j) => !tops.includes(j) && !b.inside.includes("bc1") && !b.under); if (i >= 0) tops.push(i); }
    const stand = bx.filter((b, j) => !tops.includes(j));
    tops.forEach((t, k) => { const below = stand.filter(b => !b.under && !b.inside.includes("bc1"))[k % stand.length]; if (below && !below.under) { const top = bx[t]; top.under = {...below, under: null}; Object.assign(below, top); } else stand.push(bx[t]); });
    const sq = Array.from({length: N}, () => ({item: "", box: null, cat: -1, stay: 0, fix: ""}));
    const places = L.places.map(([id, x, y, w = 1, unbuilt]) => { for (let k = 0; k < w; k++) sq[y * W + x + k].fix = "p:" + id; return {id, at: y * W + x, w, got: [], ...(unbuilt ? {built: false} : {})}; });
    const door = places.find(p => p.id === "door"), inDoor = i => door && Math.abs(i % W - door.at % W) + Math.abs((i / W | 0) - (door.at / W | 0)) <= 1;
    // the cats sit on cushions round the sides of the room, out of the doorway
    const ncats = L.cats || 0, edge = shuffle(sq.map((_, i) => i).filter(i => !sq[i].fix && !inDoor(i) && (i % W === 0 || i % W === W - 1 || (i / W | 0) === H - 1)), r);
    for (let c = 0; c < ncats; c++) sq[edge[c]].fix = "c:" + c;
    // the boxes stand anywhere else, but not in front of the door, where you come in
    const spots = shuffle(sq.map((_, i) => i).filter(i => !sq[i].fix && !(i === door?.at - W)), r);
    stand.forEach((b, k) => { sq[spots[k]].box = b; });
    const cats = Array.from({length: ncats}, (_, c) => ({wants: wants[c] || [], ate: false}));
    const g = {n, seed, W, H, sq, places, cats, rs: seed ^ 0x5bd1e995, won: false, naps: 0, moves: 0, log: [], bed: false};
    if (L.energy) { g.emax = L.energy[0]; g.energy = L.energy[1]; }
    return g;
  }
  const clone = g => JSON.parse(JSON.stringify(g));
  const L_ = g => LEVELS[g.n];
  const movable = s => s.item && s.cat < 0;
  function nbrs(g, i) { const x = i % g.W, y = i / g.W | 0, out = []; if (x) out.push(i - 1); if (x < g.W - 1) out.push(i + 1); if (y) out.push(i - g.W); if (y < g.H - 1) out.push(i + g.W); return out; }
  const isFree = s => !s.item && !s.box && !s.fix;
  // the free squares nearest square i, nearest first (by steps across the floor, then reading order)
  function nearestFree(g, i) {
    const d = (a, b) => Math.abs(a % g.W - b % g.W) + Math.abs((a / g.W | 0) - (b / g.W | 0));
    return g.sq.map((s, j) => j).filter(j => isFree(g.sq[j])).sort((a, b) => d(i, a) - d(i, b) || a - b);
  }
  // two things that go together: a combination the room has, or the glue on something broken
  function combo(g, a, b) {
    if (a === "gl1" && broken(b)) return ["gl1", b, base(b), "gl1"];
    if (b === "gl1" && broken(a)) return ["gl1", a, base(a), "gl1"];
    if (!L_(g).combos) return null;
    return COMBOS.find(c => (c[0] === a && c[1] === b) || (c[0] === b && c[1] === a)) || null;
  }
  // energy: unpacking a box, merging, moving and putting a thing away take one each; at none, you nap
  const energyOn = g => g.energy !== undefined;
  // every move that does something counts down the time a cat stays curled up in a box
  function tick(g) { g.moves++; for (const s of g.sq) if (s.cat >= 0 && --s.stay <= 0) s.cat = -1; }
  // with nothing else to do, a cat in a box gets bored and hops out
  function shoo(g) { const out = []; for (const s of g.sq) if (s.cat >= 0) { out.push(s.cat); s.cat = -1; s.stay = 0; } return out; }
  function spend(g, n = 1) {
    tick(g);
    if (!energyOn(g)) return null;
    g.energy -= n;
    return g.energy <= 0 ? nap(g) : null;
  }
  // What a drag from i to j does: "move", "swap", "merge", "combo", or null.
  function canMove(g, i, j) {
    const a = g.sq[i], b = g.sq[j];
    if (i === j || !movable(a) || b.box || b.fix || b.cat >= 0) return null;
    if (!b.item) return "move";
    if (b.item === a.item && !finished(a.item) && !broken(a.item)) return "merge";
    if (combo(g, a.item, b.item)) return "combo";
    return "swap";
  }
  function move(g, i, j) {
    const how = canMove(g, i, j); if (!how) return null;
    const a = g.sq[i], b = g.sq[j];
    // moving a thing across the floor takes energy too, so where things land matters
    if (how === "move") { b.item = a.item; a.item = ""; return {how, nap: spend(g)}; }
    if (how === "swap") { [a.item, b.item] = [b.item, a.item]; return {how, nap: spend(g)}; }
    if (how === "merge") { b.item = kindId(b.item) + (stepOf(b.item) + 1); a.item = ""; return {how, nap: spend(g)}; }
    const c = combo(g, a.item, b.item), keptA = a.item === c[3];
    b.item = c[2]; a.item = c[3] && (keptA || a.item === c[0] || a.item === c[1]) ? c[3] : "";
    return {how, nap: spend(g)};
  }
  // The box cutter: until it's out of its box, unpacking a box costs 2.
  const cutterHid = g => L_(g).cutter && g.sq.some(s => s.box && (s.box.inside.includes("bc1") || (s.box.under && s.box.under.inside.includes("bc1"))));
  const openCost = g => cutterHid(g) ? 2 : 1;
  // Tap a box: open it (energy), and its things come out onto the nearest free floor, as many as fit. A box on top
  // of another: once it's empty, it comes off (an empty box beside it) and the one under it can be opened.
  function openBox(g, i) {
    const s = g.sq[i]; if (!s.box) return null;
    const room = nearestFree(g, i);
    if (!room.length) return "room";
    const out = [], wasShut = !s.box.open, cost = openCost(g);
    s.box.open = true;
    while (s.box.inside.length && room.length) { const j = room.shift(); g.sq[j].item = s.box.inside.shift(); out.push(j); }
    let emptied = false;
    if (!s.box.inside.length) {
      if (s.box.under) {
        if (!L_(g).empties) { s.box = s.box.under; emptied = true; }
        else if (room.length) { g.sq[room[0]].item = "eb1"; out.push(room[0]); s.box = s.box.under; emptied = true; }
      } else { s.box = null; emptied = true; if (L_(g).empties) s.item = "eb1"; }
    }
    const r = {out, emptied};
    if (wasShut) r.nap = spend(g, cost); else tick(g);
    return r;
  }
  // Where a thing can go away: its home, if that's in this room, once it's finished. The last odd ones of a kind,
  // too few to make another finished one (counting the boxes), go away as they are. A kit goes to its outline.
  function placeFor(g, it) {
    if (broken(it)) return "";
    const k = kindOf(it), p = k.home && g.places.find(p => p.id === k.home);
    if (!p) return "";
    if (k.build) return p.built === false && finished(it) ? p.id : "";
    if (p.built === false) return "";
    if (it === "gl1" && anyBroken(g)) return "";   // the glue stays out while anything's broken
    if (finished(it) || count(g, kindId(it)) < 1 << (k.n.length - 1)) return p.id;
    return "";
  }
  const glueOut = g => g.sq.some(s => s.item === "gl1" || (s.box && [s.box, s.box.under].some(b => b && b.inside.includes("gl1"))));
  const anyBroken = g => g.sq.some(s => (s.item && broken(s.item)) || (s.box && [s.box, s.box.under].some(b => b && b.inside.some(broken))));
  // How far a thing is from a place (1 right beside it).
  function distTo(g, i, id) {
    const p = g.places.find(p => p.id === id); if (!p) return 99;
    let best = 99;
    for (let k = 0; k < p.w; k++) { const j = p.at + k; best = Math.min(best, Math.abs(i % g.W - j % g.W) + Math.abs((i / g.W | 0) - (j / g.W | 0))); }
    return best;
  }
  const carry = () => 1;
  function canPut(g, i, id) {
    const s = g.sq[i]; if (!movable(s)) return "";
    if (placeFor(g, s.item) === id) return kindOf(s.item).build ? "build" : "put";
    if (id === "counter" && s.item === "mg1" && L_(g).combos && g.places.find(p => p.id === "counter").got.includes("ke1")) return "tea";
    return "";
  }
  function putAway(g, i, id) {
    const how = canPut(g, i, id); if (!how) return null;
    const s = g.sq[i], p = g.places.find(p => p.id === id);
    const cost = carry(g, i, id);
    if (how === "tea") { s.item = "te1"; return {how, cost, nap: spend(g, cost)}; }
    if (how === "build") { p.built = true; s.item = ""; }
    else { p.got.push(s.item); s.item = ""; }
    // carrying it there takes energy too (but the last one away doesn't send you to sleep: you're moved in!)
    if (checkWon(g)) { tick(g); if (energyOn(g)) g.energy = Math.max(0, g.energy - cost); return {how, cost}; }
    return {how, cost, nap: spend(g, cost)};
  }
  const food = it => !broken(it) && !!kindOf(it).eat;
  function eat(g, i) {
    const s = g.sq[i]; if (!energyOn(g) || !movable(s) || !food(s.item)) return null;
    const v = kindOf(s.item).eat[stepOf(s.item) - 1], before = g.energy;
    g.energy = Math.min(g.emax, g.energy + v); s.item = ""; tick(g);
    checkWon(g); return {gained: g.energy - before, wasted: before + v - g.energy};
  }
  // A cat takes what it's asking for; a treat no cat is asking for, any cat will take. A fed cat naps with you
  // (until your next nap), and a cat curled up in a box comes out for it.
  function canFeed(g, i, c) {
    const s = g.sq[i], cat = g.cats[c]; if (!cat || !movable(s) || !kindOf(s.item).treat) return false;
    return cat.wants[0] === s.item || !g.cats.some(o => o.wants[0] === s.item);
  }
  function feed(g, i, c) {
    if (!canFeed(g, i, c)) return null;
    const cat = g.cats[c]; if (cat.wants[0] === g.sq[i].item) cat.wants.shift(); cat.ate = true; g.sq[i].item = ""; tick(g);
    for (const s of g.sq) if (s.cat === c) s.cat = -1;
    checkWon(g); return {};
  }
  function checkWon(g) { g.won = g.sq.every(s => !s.item && !s.box); return g.won; }

  // A nap: you wake with energy again, but while you slept, each cat that hasn't eaten since your last nap might
  // get up to something. The choices come from the game's own random state, so Undo and Restart replay them.
  const NAPS = 3;   // a fourth nap and you're asleep for the night: the room's lost
  function nap(g) {
    const L = L_(g), r = rngOf(g.rs); g.rs = Math.floor(r() * 4294967296) | 0;
    g.naps++;
    if (g.naps > NAPS) { g.bed = true; return {done: [], bed: true}; }
    g.energy = Math.max(6, Math.ceil(g.emax * 0.6));
    const done = [], fed = g.cats.filter(c => c.ate).length;
    const who = shuffle(g.cats.map((c, k) => k).filter(k => !g.cats[k].ate), r);
    const [kinds, many] = L.crimes || [[], 0];
    for (const c of who.slice(0, many)) {
      for (const crime of shuffle(kinds.slice(), r)) { const d = commit(g, crime, c, r); if (d) { done.push(d); break; } }
    }
    for (const c of g.cats) c.ate = false;
    g.log.push(done);
    return {done, fed};
  }
  function commit(g, crime, c, r) {
    const pickOf = a => a[Math.floor(r() * a.length)];
    if (crime === "knock") {   // knocks something put away back onto the floor, as the two halves it was made from
      const ps = g.places.filter(p => p.id !== "door" && p.got.length);
      if (!ps.length) return null;
      const p = pickOf(ps), k = Math.floor(r() * p.got.length), it = p.got[k];
      const halves = stepOf(it) >= 2 ? 2 : 1, room = nearestFree(g, p.at); if (room.length < halves) return null;
      p.got.splice(k, 1);
      const half = stepOf(it) >= 2 ? kindId(it) + (stepOf(it) - 1) : it, smash = L_(g).breaks && kindOf(it).fragile && glueOut(g);   // (only while the glue is out to mend it)
      const at = room.slice(0, halves); at.forEach((j, x) => { g.sq[j].item = smash && x === 0 ? "!" + half : half; });
      return {crime, cat: c, it, place: p.id, at, smash};
    }
    if (crime === "butter") {   // licks the butter, on the floor or in the fridge
      const on = g.sq.map((s, i) => i).filter(i => g.sq[i].item === "bu1" && g.sq[i].cat < 0);
      if (on.length) { const i = pickOf(on); g.sq[i].item = "lb1"; return {crime, cat: c, at: [i]}; }
      const f = g.places.find(p => p.id === "fridge"), k = f ? f.got.indexOf("bu1") : -1;
      const room = nearestFree(g, f ? f.at : 0); if (k < 0 || !room.length) return null;
      f.got.splice(k, 1); g.sq[room[0]].item = "lb1"; return {crime, cat: c, at: [room[0]]};
    }
    if (crime === "tip") {   // tips a box out onto the floor (no energy of yours spent)
      const bs = g.sq.map((s, i) => i).filter(i => g.sq[i].box && !g.sq[i].box.open && !g.sq[i].box.under && nearestFree(g, i).length); if (!bs.length) return null;
      const i = pickOf(bs), s = g.sq[i], room = nearestFree(g, i), at = [];
      s.box.open = true;
      while (s.box.inside.length && room.length) { const j = room.shift(); g.sq[j].item = s.box.inside.shift(); at.push(j); }
      if (!s.box.inside.length) { s.box = null; if (L_(g).empties) s.item = "eb1"; }
      return {crime, cat: c, at, box: i};
    }
    if (crime === "hide") {   // hides a thing from the floor in a box still shut (a sock under the bed, a pen in the post)
      const things = g.sq.map((s, i) => i).filter(i => movable(g.sq[i]) && g.sq[i].item !== "eb1" && !kindOf(g.sq[i].item).tool);
      const bs = g.sq.map((s, i) => i).filter(i => g.sq[i].box && !g.sq[i].box.open);
      if (!things.length || !bs.length) return null;
      const i = pickOf(things), b = pickOf(bs), it = g.sq[i].item;
      g.sq[b].box.inside.push(it); g.sq[i].item = "";
      if (g.sq[b].box.label && g.sq[b].box.label !== kindId(it)) g.sq[b].box.label = "misc";
      return {crime, cat: c, it, at: [b]};
    }
    if (crime === "boxnap") {   // curls up in an empty box: it can't be moved until the cat's had 6 of your moves, or a treat
      const es = g.sq.map((s, i) => i).filter(i => g.sq[i].item === "eb1" && g.sq[i].cat < 0); if (!es.length) return null;
      const i = pickOf(es); g.sq[i].cat = c; g.sq[i].stay = 6; return {crime, cat: c, at: [i]};
    }
    return null;
  }

  // Everything that could be done that moves the room on (for hints, the plain player and seeing when you're stuck).
  // Each: [kind, ...args]. Swaps and plain moves aren't counted.
  function choices(g) {
    const out = [], L = L_(g);
    g.sq.forEach((s, i) => {
      if (!movable(s)) return;
      const p = placeFor(g, s.item); if (p) out.push(["put", i, p]);
      if (energyOn(g) && food(s.item)) out.push(["eat", i]);
      g.cats.forEach((c, k) => { if (canFeed(g, i, k)) out.push(["feed", i, k]); });
      if (s.item === "mg1" && L.combos && g.places.some(p => p.id === "counter" && p.got.includes("ke1"))) out.push(["tea", i]);
    });
    const seen = {};
    g.sq.forEach((s, i) => {
      if (!movable(s)) return;
      for (const it in seen) {
        const j = seen[it];
        if (it === s.item && !finished(it) && !broken(it)) out.push(["merge", j, i]);
        else if (combo(g, it, s.item)) out.push(["combo", j, i]);
      }
      if (seen[s.item] === undefined) seen[s.item] = i;
    });
    const anyFree = g.sq.some(isFree);
    g.sq.forEach((s, i) => { if (s.box && anyFree) out.push(["open", i]); });
    return out;
  }
  function doChoice(g, c) {
    if (c[0] === "put") return putAway(g, c[1], c[2]);
    if (c[0] === "tea") return putAway(g, c[1], "counter");
    if (c[0] === "eat") return eat(g, c[1]);
    if (c[0] === "feed") return feed(g, c[1], c[2]);
    if (c[0] === "merge" || c[0] === "combo") return move(g, c[1], c[2]);
    if (c[0] === "open") return openBox(g, c[1]);
  }
  const stuck = g => !g.won && (g.bed || !choices(g).length);   // (shoo any cats in boxes first)

  // How much of a kind is left in the room (counted at its first step), on the floor and in the boxes: for the last
  // odd ones, and to keep a mug back for the set rather than boiling it. Each box will be an empty box.
  function count(g, k) {
    let n = 0; const add = it => { if (kindId(it) === k) n += 1 << (stepOf(it) - 1); };
    const addBox = b => { b.inside.forEach(add); if (k === "eb" && L_(g).empties) n++; if (b.under) addBox(b.under); };
    for (const s of g.sq) { if (s.item) add(s.item); if (s.box) addBox(s.box); }
    return n;
  }

  // A plain player: put away and feed whatever it can, eat when it's tired, merge the first pair it sees, else
  // unpack the first box. careful: only eat what won't be wasted, merge food first, boil only spare mugs, feed each
  // cat once between naps, and look for the box cutter first.
  function next(g, careful) {
    const cs = choices(g), L = L_(g);
    const of = k => cs.filter(c => c[0] === k);
    if (of("put").length) return of("put")[0];
    const feeds = of("feed").filter(c => !careful || !g.cats[c[2]].ate);
    if (feeds.length) return feeds[0];
    if (careful === "rush" && of("open").length) return of("open")[0];
    if (energyOn(g)) {
      const val = c => kindOf(g.sq[c[1]].item).eat[stepOf(g.sq[c[1]].item) - 1];
      const eats = of("eat").sort((a, b) => val(b) - val(a));
      if (careful) {
        const fit = eats.filter(c => g.energy + val(c) <= g.emax);
        if (g.energy <= 3 && eats.length) return fit[0] || eats[eats.length - 1];
      } else if (g.energy <= g.emax - 2 && eats.length) return eats[0];   // a careless player snacks straight away
    }
    // the mugs a set doesn't need can be boiled into tea, when you'd drink it
    const spare = L.combos ? count(g, "mg") % 4 : 0;
    const isTea = c => (c[0] === "combo" && [g.sq[c[1]].item, g.sq[c[2]].item].includes("mg1") && [g.sq[c[1]].item, g.sq[c[2]].item].includes("ke1")) || c[0] === "tea";
    const tea = cs.filter(isTea);
    if (careful && spare && tea.length && g.energy <= 4) return tea[0];
    if (!careful && tea.length && g.energy <= 2) return tea[0];
    const merges = of("merge"), others = of("combo").filter(c => !isTea(c));
    const glue = others.filter(c => [g.sq[c[1]].item, g.sq[c[2]].item].includes("gl1"));
    if (glue.length) return glue[0];
    const foodFirst = careful ? merges.filter(c => food(g.sq[c[1]].item)) : [];
    if (foodFirst.length) return foodFirst[0];
    if (merges.length) return merges[0];
    if (careful && others.length) return others[0];
    let opens = of("open");
    if (careful && cutterHid(g)) { const cut = opens.filter(c => g.sq[c[1]].box.label === "bc"); if (cut.length) return cut[0]; }
    const openOnes = opens.filter(c => g.sq[c[1]].box.open);
    if (openOnes.length) return openOnes[0];
    if (opens.length) return opens[0];
    if (tea.length) return tea[0];
    if (others.length) return others[0];
    if (of("eat").length) return of("eat")[0];
    if (of("feed").length) return of("feed")[0];
    return null;
  }
  function play(g, careful = false) {
    g.minFree = g.sq.length;
    for (let steps = 0; steps < 900; steps++) {
      g.minFree = Math.min(g.minFree, g.sq.filter(isFree).length);
      const crimes = g.log.reduce((a, d) => a + d.length, 0);
      if (g.won) return {won: true, naps: g.naps, crimes, moves: g.moves, minFree: g.minFree};
      if (g.bed) return {won: false, bed: true, naps: g.naps, crimes, moves: g.moves, minFree: g.minFree};
      const c = next(g, careful);
      if (!c) { if (shoo(g).length) continue; return {won: false, naps: g.naps, crimes, moves: g.moves, minFree: g.minFree}; }
      doChoice(g, c);
    }
    return {won: false, naps: g.naps, moves: g.moves, loop: true};
  }
  // Deal a room a careful player can clear, and where there's energy, one where it naps (everyone does) but keeps
  // the cats out of mischief by feeding them first (the gold paw); trying other seeds if not.
  function deal(n, seed) {
    for (let k = 0; ; k++) {
      const s = (seed + k * 7919) | 0, g = makeLevel(n, s);
      const care = play(clone(g), true);
      const ok = care.won && (!energyOn(g) || (care.crimes === 0 && care.naps >= 1));
      if (ok || k > 80) { g.tries = k + 1; return g; }
    }
  }
  return {NAPS, base, broken, cutterHid, openCost, distTo, carry, shoo, count, KINDS, COMBOS, PLACES, LEVELS, rngOf, makeLevel, clone, nbrs, canMove, move, openBox, placeFor, canPut, putAway,
    eat, canFeed, feed, choices, doChoice, stuck, next, play, deal, nameOf, stepOf, finished, food, kindOf, kindId, nearestFree, energyOn, checkWon, spend, combo};
}
if (typeof module !== "undefined") module.exports = movingRules;
