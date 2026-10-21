/* ---------- countries and their cats ---------- */
// The 200 countries a trip can ask: the 193 UN members plus Vatican City, Palestine, Taiwan, Kosovo,
// Western Sahara, the Cook Islands and Niue (the same list as World Map Recall).
const NAMES = /*NAMES*/;
// Map pieces that light up with the country they belong to.
const ALIAS = {CYN: "CYP", SOL: "SOM", ALD: "FIN"};
// Continents for Easy's wrong answers, as World Map Recall has them.
const REGION_FIX = {CYP: "Europe", TUR: "Asia", RUS: "Europe"};
// What each cat is called in the clue. None of them names a country: "lynx", never "Iberian lynx".
const CATS = {
  lion: "the lion", tiger: "the tiger", leopard: "the leopard", panther: "the black panther", snow: "the snow leopard",
  clouded: "the clouded leopard", jaguar: "the jaguar", cheetah: "the cheetah", puma: "the puma", lynx: "the lynx",
  bobcat: "the bobcat", caracal: "the caracal", serval: "the serval", ocelot: "the ocelot", margay: "the margay",
  jaguarundi: "the jaguarundi", oncilla: "the oncilla", geoffroy: "Geoffroy's cat", kodkod: "the kodkod",
  andean: "the Andean cat", golden: "the golden cat", leopardcat: "the leopard cat", fishing: "the fishing cat",
  rusty: "the rusty-spotted cat", manul: "Pallas's cat", sand: "the sand cat", blackfoot: "the black-footed cat",
  jungle: "the jungle cat", wildcat: "the wildcat"};
// One cat for each country: a wild cat that lives there (checked against GBIF sightings and the IUCN Red List), or,
// where no wild cat does any more, a housecat that migrated there.
const CLUE = Object.fromEntries(`
DZA cheetah AGO serval BEN lion BWA leopard BFA leopard BDI serval CPV house CMR golden CAF golden TCD cheetah COM house
COG leopard COD serval CIV leopard DJI caracal EGY jungle GNQ golden ERI caracal SWZ serval ETH lion GAB golden GMB serval
GHA golden GIN leopard GNB serval KEN cheetah LSO wildcat LBR leopard LBY caracal MDG house MWI serval MLI caracal MRT sand
MUS house MAR caracal MOZ lion NAM cheetah NER cheetah NGA leopard RWA lion STP house SEN lion SYC house SLE golden SOM leopard
ZAF blackfoot SDS lion SDN lion TZA lion TGO serval TUN wildcat UGA lion ZMB leopard ZWE lion SAH sand
ATG house ARG geoffroy BHS house BRB house BLZ jaguar BOL andean BRA jaguar CAN lynx CHL kodkod COL ocelot CRI margay
CUB house DMA house DOM house ECU oncilla SLV jaguarundi GRD house GTM margay GUY jaguar HTI house HND jaguarundi JAM house
MEX jaguar NIC ocelot PAN ocelot PRY jaguar PER puma KNA house LCA house VCT house SUR margay TTO ocelot USA bobcat
URY margay VEN puma
AFG snow ARM leopard AZE jungle BHR house BGD tiger BTN tiger BRN clouded KHM leopardcat CHN snow GEO lynx IND lion
IDN tiger IRN cheetah IRQ leopard ISR jungle JPN leopardcat JOR sand KAZ caracal KWT sand KGZ snow LAO clouded LBN wildcat
MYS panther MDV house MNG manul MMR clouded NPL snow PRK leopardcat OMN leopard PAK leopard PHL leopardcat QAT house
SAU sand SGP leopardcat KOR leopardcat LKA rusty SYR jungle TJK snow THA fishing TLS house TUR caracal TKM manul
ARE caracal UZB sand VNM leopardcat YEM caracal PSX caracal TWN leopardcat
ALB lynx AND wildcat AUT lynx BLR lynx BEL wildcat BIH lynx BGR wildcat HRV lynx CYP house CZE lynx DNK house EST lynx
FIN lynx FRA lynx DEU wildcat GRC wildcat HUN wildcat ISL house IRL house ITA wildcat LVA lynx LIE lynx LTU lynx
LUX wildcat MLT house MDA wildcat MCO house MNE wildcat NLD wildcat MKD lynx NOR lynx POL lynx PRT lynx ROU lynx RUS tiger
SMR house SRB wildcat SVK lynx SVN lynx ESP lynx SWE lynx CHE lynx UKR lynx GBR house VAT house KOS wildcat
AUS house FJI house KIR house MHL house FSM house NRU house NZL house PLW house PNG house WSM house SLB house TON house
TUV house VUT house COK house NIU house`.trim().split(/\s+/).reduce((a, w, i, all) => (i % 2 ? a : [...a, [w, all[i + 1]]]), []));
// Countries never offered as each other's wrong answer on Easy, however close they are.
const NEVER_WITH = {ISR: ["PSX"], PSX: ["ISR"]};
// Other names typed answers are matched against (Medium's list finds them too).
const AKA = {
  CIV: ["Côte d'Ivoire"], CZE: ["Czech Republic"], MMR: ["Burma"], TLS: ["East Timor"], SWZ: ["Swaziland"], CPV: ["Cabo Verde"],
  COD: ["Democratic Republic of the Congo", "DRC", "Congo-Kinshasa", "Zaire"], COG: ["Congo", "Congo-Brazzaville", "Congo Republic"],
  USA: ["United States of America", "USA", "US", "America"], GBR: ["UK", "Great Britain", "Britain"], MKD: ["Macedonia"],
  KOR: ["Korea", "Republic of Korea"], PRK: ["DPRK"], NLD: ["Holland"], TUR: ["Türkiye"], VAT: ["Vatican", "Holy See"],
  FSM: ["Federated States of Micronesia"], ARE: ["UAE", "Emirates"], CAF: ["CAR"], BIH: ["Bosnia"], TTO: ["Trinidad"],
  ATG: ["Antigua"], KNA: ["Saint Kitts", "St Kitts and Nevis"], LCA: ["St Lucia"], VCT: ["Saint Vincent", "St Vincent and the Grenadines"],
  STP: ["São Tomé", "Sao Tome and Principe"], GMB: ["The Gambia"], BHS: ["The Bahamas"], PSX: ["State of Palestine"],
  LAO: ["Lao PDR"], RUS: ["Russian Federation"], BRN: ["Brunei Darussalam"], VNM: ["Viet Nam"], SAH: ["Sahrawi Republic"],
  PNG: ["PNG"], NZL: ["Aotearoa"], DOM: ["DR"], SDS: ["S Sudan"], GNQ: ["Eq Guinea"]};

/* ---------- names ---------- */
// What a typed name is compared by: no accents, case, punctuation, "the", and "St" read as "Saint".
function norm(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/&/g, " and ")
    .replace(/\bst\b\.?/g, "saint").replace(/[^a-z]+/g, " ").replace(/\bthe\b/g, " ").replace(/\s+/g, " ").trim();
}
const LOOKUP = new Map();
for (const c in NAMES) for (const n of [NAMES[c], ...(AKA[c] || [])]) LOOKUP.set(norm(n), c);
const SORTED = Object.keys(NAMES).sort((a, b) => NAMES[a].localeCompare(NAMES[b]));
// Countries for Medium's list: every country, or those whose name (or other name) has a word starting with what's typed,
// names that start with it first.
function matching(q) {
  q = norm(q); if (!q) return SORTED;
  const starts = [], words = [];
  for (const c of SORTED) {
    const ns = [NAMES[c], ...(AKA[c] || [])].map(norm);
    if (ns.some(n => n.startsWith(q))) starts.push(c);
    else if (ns.some(n => (" " + n).includes(" " + q))) words.push(c);
  }
  return [...starts, ...words];
}

/* ---------- the map ---------- */
// Natural Earth projection (as d3 draws it), fitted so the world is 1000 units wide; y grows down.
const K = 1000 / (2 * Math.PI * 0.8707), WORLD = 1000;
function project(lon, lat) {
  const l = lon * Math.PI / 180, p = lat * Math.PI / 180, p2 = p * p, p4 = p2 * p2;
  return [K * l * (0.8707 - 0.131979 * p2 + p4 * (-0.013791 + p4 * (0.003971 * p2 - 0.001529 * p4))),
    -K * p * (1.007226 + p2 * (0.015085 + p4 * (-0.044475 + 0.028874 * p2 - 0.005916 * p4)))];
}
let world = null;       // {land: Path2D of every country, by: {code: [pieces…]}, main: {code: {box, x, y}}, disputed: Path2D}
function buildWorld(raw, disputedRaw) {
  const land = new Path2D(), by = {}, main = {}, disputed = new Path2D();
  for (const [, , mp] of disputedRaw) for (const poly of mp) for (const ring of poly) {
    ring.forEach(([lon, lat], i) => { const [x, y] = project(lon, lat); if (i) disputed.lineTo(x, y); else disputed.moveTo(x, y); });
    disputed.closePath();
  }
  for (const [code, , , region, , mp] of raw) {
    const owner = ALIAS[code] || code, path = new Path2D();
    let best = null;
    for (const poly of mp) {
      let box = [Infinity, Infinity, -Infinity, -Infinity], area = 0;
      poly.forEach((ring, r) => {
        let prev = null;
        ring.forEach(([lon, lat], i) => {
          const [x, y] = project(lon, lat);
          if (i) path.lineTo(x, y); else path.moveTo(x, y);
          if (!r) { box = [Math.min(box[0], x), Math.min(box[1], y), Math.max(box[2], x), Math.max(box[3], y)]; if (prev) area += prev[0] * y - x * prev[1]; prev = [x, y]; }
        });
        path.closePath();
      });
      if (!best || Math.abs(area) > best.area) best = {area: Math.abs(area), box};
    }
    land.addPath(path);
    (by[owner] = by[owner] || []).push(path);
    if (code === owner && best) main[code] = {box: best.box, x: (best.box[0] + best.box[2]) / 2, y: (best.box[1] + best.box[3]) / 2, region: REGION_FIX[code] || region};
  }
  return {land, by, main, disputed};
}

const canvas = G.$("canvas"), ctx = canvas.getContext("2d");
const view = {x: 0, y: 0, s: 0.5};      // the map point at the middle of the board, and pixels per map unit
let size = {w: 1, h: 1, dpr: 1}, flash = null, drawQueued = false, tween = null;
function resize() {
  const r = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
  size = {w: r.width || 1, h: r.height || 1, dpr};
  canvas.width = Math.round(size.w * dpr); canvas.height = Math.round(size.h * dpr);
  draw();
}
function redraw() { if (!drawQueued) { drawQueued = true; requestAnimationFrame(() => { drawQueued = false; draw(); }); } }
const css = n => getComputedStyle(G.$("board")).getPropertyValue(n).trim();
function draw() {
  const {w, h, dpr} = size;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = css("--water"); ctx.fillRect(0, 0, w, h);
  if (!world) return;
  const code = game && current(), lit = code ? world.by[code] || [] : [], found = flash && flash.code === code;
  const fill = found ? css("--found") : css("--lit"), edge = found ? css("--found-edge") : css("--lit-edge");
  // the map repeats sideways, so the Pacific is all in one piece
  for (const k of [-1, 0, 1]) {
    const tx = w / 2 + (k * WORLD - view.x) * view.s, ty = h / 2 - view.y * view.s;
    if (tx + WORLD / 2 * view.s < 0 || tx - WORLD / 2 * view.s > w) continue;
    ctx.setTransform(dpr * view.s, 0, 0, dpr * view.s, dpr * tx, dpr * ty);
    ctx.fillStyle = css("--land"); ctx.fill(world.land);
    ctx.fillStyle = fill; for (const p of lit) ctx.fill(p);
    ctx.lineJoin = "round";
    // disputed land: grey stripes over whatever colour is under them, and a dashed edge
    ctx.save(); ctx.clip(world.disputed);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.beginPath(); for (let d = -h; d < w; d += 7) { ctx.moveTo(d, h); ctx.lineTo(d + h, 0); }
    ctx.lineWidth = 1.6; ctx.strokeStyle = css("--stripe"); ctx.stroke();
    ctx.restore();
    ctx.lineWidth = 0.9 / view.s; ctx.strokeStyle = css("--border"); ctx.stroke(world.land);
    ctx.setLineDash([4 / view.s, 3 / view.s]); ctx.lineWidth = 1.2 / view.s; ctx.stroke(world.disputed); ctx.setLineDash([]);
    ctx.lineWidth = 1.8 / view.s; ctx.strokeStyle = edge; for (const p of lit) ctx.stroke(p);
    // a gold ring round a country too small to see
    const m = code && world.main[code];
    if (m && Math.max(m.box[2] - m.box[0], m.box[3] - m.box[1]) * view.s < 14) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.beginPath(); ctx.arc(tx + m.x * view.s, ty + m.y * view.s, 16, 0, 2 * Math.PI);
      ctx.lineWidth = 4; ctx.strokeStyle = found ? css("--found-edge") : "#ECA818"; ctx.stroke();
    }
  }
}
// The view that frames a country: its main piece in the middle with room round it for its neighbours.
function frameFor(code) {
  const m = world.main[code], b = m.box;
  const span = Math.min(1100, Math.max(70, (b[2] - b[0]) * 2.2, (b[3] - b[1]) * 2.2));
  return {x: m.x, y: m.y, s: Math.min(size.w, size.h) / span};
}
const clampView = () => {
  view.s = Math.min(Math.max(view.s, Math.min(size.w, size.h) / 1300), 3000);
  view.x = ((view.x + WORLD / 2) % WORLD + WORLD) % WORLD - WORLD / 2;
  view.y = Math.min(Math.max(view.y, -480), 480);
};
function flyTo(t, instant) {
  if (tween) cancelAnimationFrame(tween.raf);
  const from = {...view}, dx = ((t.x - from.x + WORLD * 1.5) % WORLD) - WORLD / 2;   // the short way round
  if (instant || matchMedia("(prefers-reduced-motion: reduce)").matches) { Object.assign(view, t); clampView(); redraw(); return; }
  // zoom out partway on a long trip, then in
  const far = Math.hypot(dx, t.y - from.y), mid = Math.min(from.s, t.s, Math.min(size.w, size.h) / (far * 1.4 || 1));
  const t0 = performance.now(), dur = 900;
  const step = now => {
    const u = Math.min(1, (now - t0) / dur), e = u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
    const ls = u < .5 ? Math.log(from.s) + (Math.log(mid) - Math.log(from.s)) * (e * 2) : Math.log(mid) + (Math.log(t.s) - Math.log(mid)) * (e * 2 - 1);
    view.x = from.x + dx * e; view.y = from.y + (t.y - from.y) * e; view.s = Math.exp(ls);
    clampView(); draw();
    if (u < 1) tween.raf = requestAnimationFrame(step); else tween = null;
  };
  tween = {raf: requestAnimationFrame(step)};
}

// Drag to move, pinch or scroll to zoom.
{
  const pts = new Map();
  const at = e => { const r = canvas.getBoundingClientRect(); return {x: e.clientX - r.left, y: e.clientY - r.top}; };
  const zoomAt = (p, f) => {
    const mx = view.x + (p.x - size.w / 2) / view.s, my = view.y + (p.y - size.h / 2) / view.s;
    view.s *= f; clampView();
    view.x = mx - (p.x - size.w / 2) / view.s; view.y = my - (p.y - size.h / 2) / view.s; clampView();
  };
  canvas.addEventListener("pointerdown", e => { if (tween) { cancelAnimationFrame(tween.raf); tween = null; } canvas.setPointerCapture(e.pointerId); pts.set(e.pointerId, at(e)); });
  canvas.addEventListener("pointermove", e => {
    if (!pts.has(e.pointerId)) return;
    const p = at(e);
    if (pts.size === 1) { const o = pts.get(e.pointerId); view.x -= (p.x - o.x) / view.s; view.y -= (p.y - o.y) / view.s; clampView(); }
    else if (pts.size === 2) {
      const [a, b] = [...pts.entries()].map(([id, q]) => id === e.pointerId ? p : q), [oa, ob] = [...pts.values()];
      const d0 = Math.hypot(oa.x - ob.x, oa.y - ob.y), d1 = Math.hypot(a.x - b.x, a.y - b.y);
      const m0 = {x: (oa.x + ob.x) / 2, y: (oa.y + ob.y) / 2}, m1 = {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2};
      view.x -= (m1.x - m0.x) / view.s; view.y -= (m1.y - m0.y) / view.s;
      if (d0 > 0) zoomAt(m1, d1 / d0);
    }
    pts.set(e.pointerId, p); redraw();
  });
  const up = e => pts.delete(e.pointerId);
  canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up);
  canvas.addEventListener("wheel", e => { e.preventDefault(); zoomAt(at(e), Math.exp(-e.deltaY * (e.deltaMode ? 0.05 : 0.0015))); redraw(); }, {passive: false});
  canvas.addEventListener("keydown", e => {
    const k = {ArrowLeft: [-40, 0], ArrowRight: [40, 0], ArrowUp: [0, -40], ArrowDown: [0, 40]}[e.key];
    if (k) { view.x += k[0] / view.s; view.y += k[1] / view.s; }
    else if (e.key === "+" || e.key === "=") zoomAt({x: size.w / 2, y: size.h / 2}, 1.4);
    else if (e.key === "-") zoomAt({x: size.w / 2, y: size.h / 2}, 1 / 1.4);
    else return;
    e.preventDefault(); clampView(); redraw();
  });
  new ResizeObserver(resize).observe(canvas);
}
G.$("recentreBtn").onclick = () => { if (game && world) flyTo(frameFor(current())); };

/* ---------- a trip ---------- */
const KEY = "catdoku.atlas.v2", TRIP = 10;
// 15 levels: Easy (pick from 4), Medium (type, with the list) and Hard (type, no list), each in 5 steps of geography.
// Step 1 asks large countries with wrong answers spread far apart and of other sizes; step 5 asks mostly small
// countries and islands, with wrong answers that are their nearest neighbours of a similar size.
const MODES = [null, "Easy", "Medium", "Hard"], STEPS = [null, "large countries", "large and medium", "adds small", "adds tiny and islands", "mostly small and islands"];
const modeOf = n => Math.ceil(n / 5), stepOf = n => (n - 1) % 5 + 1, mode = () => modeOf(game.level);
const levelName = n => `${MODES[modeOf(n)]} ${stepOf(n)}`;
for (let n = 1; n <= 15; n++) G.$("levelSel").append(new Option(`${levelName(n)}: ${STEPS[stepOf(n)]}`, n));
const $ = G.$;
let saved = G.load(KEY), settings = saved.settings || {level: 1}, recent = saved.recent || [], game = null, busy = false;
const save = () => G.save(KEY, {settings, recent, game});
const current = () => game.trip[game.i] && game.trip[game.i].c;
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const regionOf = c => (world && world.main[c] ? world.main[c].region : "");

// Countries by size: [km², 1 if it has no land border]. Tiny is under 10,000 km², small under 100,000,
// medium under 500,000.
const SIZE = /*SIZES*/;
const km2 = c => SIZE[c][0], isIsland = c => SIZE[c][1] === 1;
const tier = c => km2(c) >= 500000 ? 4 : km2(c) >= 100000 ? 3 : km2(c) >= 10000 ? 2 : 1;
// Which countries a step asks, and (step 5) which it leans on.
const askable = (c, step) => step === 1 ? tier(c) === 4 : step === 2 ? tier(c) >= 3 : step === 3 ? tier(c) >= 2 && !isIsland(c) : true;
const hardOne = c => tier(c) <= 2 || isIsland(c);
// How far apart two countries' main pieces are on the map, the short way round.
function apart(a, b) {
  const p = world.main[a], q = world.main[b], dx = Math.abs(p.x - q.x);
  return Math.hypot(Math.min(dx, WORLD - dx), p.y - q.y);
}
const sizeGap = (a, b) => Math.abs(Math.log(km2(a) / km2(b)));
// Easy's three wrong names, all from the same continent: far away and of other sizes on step 1, far away on 2,
// one near neighbour on 3, near neighbours of a similar size on 4, and the most alike of all on 5.
function wrongNames(c, step) {
  const all = Object.keys(NAMES).filter(d => d !== c && regionOf(d) === regionOf(c) && !(NEVER_WITH[c] || []).includes(d));
  const byNear = [...all].sort((a, b) => apart(c, a) - apart(c, b));
  const alike = [...all].sort((a, b) => (apart(c, a) / 30 + sizeGap(c, a)) - (apart(c, b) / 30 + sizeGap(c, b)));
  const far = byNear.slice(Math.floor(byNear.length / 2));
  if (step === 1) { const other = far.filter(d => sizeGap(c, d) > Math.log(3)); return shuffle(other.length >= 3 ? other : far).slice(0, 3); }
  if (step === 2) return shuffle(far).slice(0, 3);
  if (step === 3) { const near = shuffle(byNear.slice(0, 4))[0]; return [near, ...shuffle(all.filter(d => d !== near)).slice(0, 2)]; }
  if (step === 4) return shuffle(alike.slice(0, 6)).slice(0, 3);
  return alike.slice(0, 3);
}
// Ten countries for a level, not asked lately where that leaves enough.
function makeTrip(level) {
  const step = stepOf(level), pool = Object.keys(NAMES).filter(c => askable(c, step) && world.main[c]);
  const pick = (from, n) => { const fresh = from.filter(c => !recent.includes(c)); return shuffle(fresh.length >= n ? fresh : from).slice(0, n); };
  let codes;
  if (step === 5) { const hard = pick(pool.filter(hardOne), 7); codes = shuffle([...hard, ...pick(pool.filter(c => !hard.includes(c)), 3)]); }
  else codes = pick(pool, TRIP);
  return codes.map(c => ({c, opts: shuffle([c, ...wrongNames(c, step)])}));
}
const freshCard = () => ({wrong: [], hints: 0, out: []});
function newTrip(level, trip) {
  settings.level = level; $("levelSel").value = level;
  game = {level, trip: trip || makeTrip(level), i: 0, res: [], card: freshCard(), hinted: false, restarted: false, won: false, ...G.freshClock()};
  if (!trip) { recent = [...recent, ...game.trip.map(t => t.c)].slice(-120); }
  save(); show(true);
}

function show(fly) {
  const code = current(), done = game.won;
  // progress dots: green first time, coral after a miss
  $("count").innerHTML = game.trip.map((t, i) => `<i class="${i < game.res.length ? (game.res[i].first ? "ok" : "miss") : i === game.i && !done ? "now" : ""}"></i>`).join("");
  $("count").setAttribute("aria-label", `Cat ${Math.min(game.i + 1, TRIP)} of ${TRIP}`);
  const cat = CATS[CLUE[code]] || "the cat";
  $("clue").innerHTML = done ? "Trip done!" : CLUE[code] === "house" ? "Where did the <b>housecat</b> migrate?" : `Where's ${cat.replace(/^(the )?(.*)$/, (m, the, rest) => `${the || ""}<b>${rest}</b>`)}?`;
  $("reveal").textContent = !done && mode() > 1 && game.card.hints ? reveal(NAMES[code], game.card.hints) : "";
  $("choices").hidden = done || mode() !== 1;
  $("typebox").hidden = done || mode() === 1;
  $("list").hidden = done || mode() !== 2;
  if (mode() === 1 && !done) {
    $("choices").innerHTML = "";
    for (const o of game.trip[game.i].opts) {
      const b = document.createElement("button"); b.textContent = NAMES[o];
      if (game.card.wrong.includes(o)) b.className = "wrong"; else if (game.card.out.includes(o)) b.className = "out";
      else if (o === code && game.card.hints > 2) b.className = "gold";
      b.disabled = game.card.wrong.includes(o) || game.card.out.includes(o);
      b.onclick = () => answer(o, b);
      $("choices").append(b);
    }
  }
  if (mode() === 2 && !done) fillList();
  $("tried").innerHTML = mode() > 1 && !done ? game.card.wrong.map(c => `<span>${NAMES[c]}</span>`).join("") : "";
  $("hintBtn").disabled = done;
  if (world && code && fly) flyTo(frameFor(code), fly === "jump");
  else redraw();
}
// "N o r _ _ _" with the first n letters showing (spaces and hyphens always show).
function reveal(name, n) {
  let k = 0;
  return [...name].map(ch => /[\p{L}]/u.test(ch) ? (k++ < n ? ch : "_") : ch).join(" ").replace(/ {3}/g, "   ");
}

// Medium's list of every country, narrowed to what's typed.
let active = -1;
function fillList() {
  const list = $("list"), cs = matching($("guess").value);
  list.innerHTML = "";
  if (!cs.length) { const li = document.createElement("li"); li.className = "none"; li.textContent = "No country starts like that"; list.append(li); }
  cs.forEach((c, i) => {
    const li = document.createElement("li"); li.role = "option"; li.textContent = NAMES[c]; li.dataset.c = c;
    li.setAttribute("aria-selected", i === active);
    li.onpointerdown = e => e.preventDefault();      // keep the keyboard up on phones
    li.onclick = () => submit(c);
    list.append(li);
  });
}
$("guess").addEventListener("input", () => { active = $("guess").value.trim() ? 0 : -1; if (mode() === 2) { fillList(); $("list").scrollTop = 0; } });
$("guess").addEventListener("keydown", e => {
  if (mode() !== 2 || !["ArrowDown", "ArrowUp"].includes(e.key)) return;
  e.preventDefault();
  const n = $("list").querySelectorAll("li[data-c]").length; if (!n) return;
  active = (active + (e.key === "ArrowDown" ? 1 : -1) + n) % n; fillList();
  const li = $("list").querySelectorAll("li[data-c]")[active]; if (li) li.scrollIntoView({block: "nearest"});
});
$("typebox").addEventListener("submit", e => {
  e.preventDefault();
  const text = $("guess").value, exact = LOOKUP.get(norm(text));
  if (exact) return submit(exact);
  if (mode() === 2) { const li = $("list").querySelectorAll("li[data-c]")[Math.max(active, 0)]; if (li && text.trim()) return submit(li.dataset.c); }
  if (!text.trim()) { G.note("Type the name of the lit country."); return; }
  G.note(`There's no country called “${text.trim()}”. Check the spelling?`);
});
function submit(c) { $("guess").value = ""; active = -1; answer(c); }

function answer(c, btn) {
  if (busy || !game || game.won) return;
  game.started = true;
  const code = current(), card = game.card;
  if (c !== code) {
    if (!card.wrong.includes(c)) card.wrong.push(c);
    G.note(`Not ${NAMES[c]}. Try again!`, 2500);
    save(); show(); if (mode() > 1) $("guess").focus();
    return;
  }
  game.res.push({c, first: !card.wrong.length && !card.hints, hinted: card.hints > 0});
  if (btn) btn.className = "right";
  G.note(card.wrong.length || card.hints ? `${NAMES[c]}, yes.` : `${NAMES[c]}! First try.`, 1800);
  flash = {code}; busy = true; redraw();
  setTimeout(() => {
    flash = null; busy = false;
    game.i++; game.card = freshCard();
    if (game.i >= TRIP) return win();
    save(); show(true);
    if (mode() > 1 && matchMedia("(hover: hover)").matches) $("guess").focus();
  }, 1100);
  save();
}

function win() {
  game.won = true; game.i = TRIP - 1;
  const first = game.res.filter(r => r.first).length, gold = first === TRIP && !game.hinted && !game.restarted;
  const level = game.level, next = gold ? Math.min(15, level + 1) : level;
  G.finishClock(game); save(); show();
  const why = game.hinted ? ` You had a hint, so here's another trip at ${levelName(level)}.`
    : gold ? (next > level ? ` On to ${levelName(next)}!` : "") : ` Find all ${TRIP} on the first try to move up a level.`;
  G.winCard(`${first} of ${TRIP} found on the first try.${why}`, () => { G.closeCard(); newTrip(next); }, "Look at the map", game.result,
    {title: "Trip done!", gold, goldWhy: "Every cat found on the first try!", next: next > level ? `Next: ${levelName(next)}` : "New trip",
     after: G.otherSize($("levelSel"), next, l => newTrip(l), "Or play a different level:")});
  if (typeof PREVIEW !== "undefined") for (const b of $("card").querySelectorAll("button")) if (/share/i.test(b.textContent)) b.remove();
}

// A hint shows, it never answers: Easy crosses out a wrong name (then rings the right one in gold);
// Medium and Hard spell out one more letter of the name.
$("hintBtn").onclick = () => {
  if (!game || game.won || busy) return;
  const code = current(), card = game.card;
  card.hints++; game.hinted = true; game.started = true;
  if (mode() === 1) {
    const left = game.trip[game.i].opts.filter(o => o !== code && !card.wrong.includes(o) && !card.out.includes(o));
    if (left.length) { const o = left[Math.floor(Math.random() * left.length)]; card.out.push(o); G.note(`It isn't ${NAMES[o]}.`); }
    else { card.hints = 3; G.note("It's the one ringed in gold."); }
  } else {
    const letters = [...NAMES[code]].filter(ch => /\p{L}/u.test(ch)).length;
    card.hints = Math.min(card.hints, letters);
    G.note(card.hints >= letters ? "That's the whole name." : "One more letter, under the cat.");
  }
  save(); show();
};
$("restartBtn").onclick = () => { if (!game) return; const t = game.trip, l = game.level; newTrip(l, t); game.restarted = true; save(); };
$("newBtn").onclick = () => newTrip(+$("levelSel").value);
$("levelSel").onchange = () => newTrip(+$("levelSel").value);
$("bestBtn").onclick = () => G.showBests("Best times", game ? game.level : settings.level);
G.setupTimer({name: "atlas", game: () => game, playing: g => !g.won, save, label: levelName, noun: "level"});

// How to play, on the real board.
function walkthrough() {
  if (!game) return;
  const steps = [
    {say: "This country is lit up.", lit: [[0, 0]], tone: "ok"},
    {say: "A cat is hiding in its native environment.", lit: [], els: [$("clue")]},
    {say: mode() === 1 ? "Tap the country's name." : mode() === 2 ? "Type its name, or pick it from the list." : "Type its name, then Go.",
     lit: [], els: [mode() === 1 ? $("choices") : $("typebox")]},
    {say: "Drag or pinch the map to look around.", lit: [[0, 0]], els: [$("recentreBtn")]},
    {say: "Stuck? Hint helps, but costs the gold paw.", lit: [], els: [$("hintBtn")]}];
  G.spotlight({grid: $("grid"), w: 1, h: 1, steps, done: () => { settings.seenHelp = true; save(); }});
}
$("helpBtn").onclick = () => game && game.won ? G.helpLater() : walkthrough();

/* ---------- start ---------- */
function start() {
  G.reopen(() => {
    if (saved.game && saved.game.trip && saved.game.trip.length === TRIP && saved.game.trip.every(t => NAMES[t.c])) {
      game = saved.game; G.checkClock(game); $("levelSel").value = game.level; show("jump");
    } else newTrip(settings.level || 1);
  }, msg => { newTrip(settings.level || 1); G.note(msg, 0); });
  if (!settings.seenHelp) setTimeout(walkthrough, 400);
}
Promise.all(["world.json", "disputed.json"].map(f => fetch(f).then(r => r.json()))).then(([raw, disputed]) => {
  world = buildWorld(raw, disputed); $("loading").remove(); resize(); start();
}).catch(e => { $("loading").textContent = "The map couldn't load. Check your connection and reload."; throw e; });
