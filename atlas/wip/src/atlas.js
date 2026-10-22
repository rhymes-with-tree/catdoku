/* ---------- countries and their cats ---------- */
// The 200 countries a trip can ask: the 193 UN members plus Vatican City, Palestine, Taiwan, Kosovo,
// Western Sahara, the Cook Islands and Niue (the same list as World Map Recall).
const NAMES = /*NAMES*/;
// Territories quizzed alongside the countries: every place with an ISO country code of its own, named with the
// country it belongs to ("Greenland (Denmark)"). Either answer is right on its own; naming the country too is a bonus.
const DEPS = /*DEPS*/;
const nameOf = c => NAMES[c] || (DEPS[c] && DEPS[c][0]) || (c.startsWith("dz:") && DISPUTES[c.slice(3)] ? DISPUTES[c.slice(3)].name : c);
const PLACES = [...Object.keys(NAMES), ...Object.keys(DEPS)];
const OWNERS = [...new Set(Object.values(DEPS).map(d => d[1]))];
// Map pieces that light up with the country they belong to.
const ALIAS = {CYN: "CYP", SOL: "SOM", ALD: "FIN"};
// Continents for Easy's wrong answers, as World Map Recall has them.
const REGION_FIX = {CYP: "Europe", TUR: "Asia", RUS: "Europe", HMD: "Oceania", ATF: "Africa"};
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
// where no wild cat does any more, a housecat that migrated there; a cat exploring, where no one lives at all.
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
TUV house VUT house COK house NIU house
GRL house GUF jaguar SJM house NCL house FLK house PRI house ATF empty SGS empty PYF house REU house GLP house MTQ house
FRO house HKG leopardcat IMN house GUM house CUW house HMD empty MYT house MNP house TCA house VIR house CYM house BES house
SPM house SHN house ABW house IOA house VGB house IOT house WLF house JEY house ASM house AIA house MSR house BMU house
MAF house GGY house SXM house NFK house PCN house BLM house MAC house TKL house ATC empty`.trim().split(/\s+/).reduce((a, w, i, all) => (i % 2 ? a : [...a, [w, all[i + 1]]]), []));
// Each cat's Wikipedia page, for its photo and a link to read more: the exact species where the clue's plain name
// covers several (the lynx in Spain is the Iberian lynx). Housecats and explorers get the page on cats.
const WIKI = {
  lion: "Lion", tiger: "Tiger", leopard: "Leopard", panther: "Black panther", snow: "Snow leopard", clouded: "Clouded leopard",
  jaguar: "Jaguar", cheetah: "Cheetah", puma: "Cougar", lynx: "Eurasian lynx", bobcat: "Bobcat", caracal: "Caracal",
  serval: "Serval", ocelot: "Ocelot", margay: "Margay", jaguarundi: "Jaguarundi", oncilla: "Oncilla", geoffroy: "Geoffroy's cat",
  kodkod: "Kodkod", andean: "Andean mountain cat", golden: "African golden cat", leopardcat: "Leopard cat", fishing: "Fishing cat",
  rusty: "Rusty-spotted cat", manul: "Pallas's cat", sand: "Sand cat", blackfoot: "Black-footed cat", jungle: "Jungle cat",
  wildcat: "European wildcat", house: "Cat", empty: "Cat"};
const WIKI_HERE = {CAN: "Canada lynx", ESP: "Iberian lynx", PRT: "Iberian lynx", LSO: "African wildcat", TUN: "African wildcat",
  LBN: "African wildcat", BRN: "Sunda clouded leopard", PHL: "Sunda leopard cat"};
const wikiTitle = code => WIKI_HERE[code] || WIKI[CLUE[code]] || "Cat";
// The page's lead photo and who took it, fetched by the player's browser from Wikipedia and Wikimedia Commons
// (the photos' licences ask for the photographer and licence to be named). Once per page, then kept.
const wikiPics = {};
function wikiPic(title) {
  const plain = html => new DOMParser().parseFromString(html || "", "text/html").body.textContent.trim();
  return wikiPics[title] = wikiPics[title] || fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(title.replace(/ /g, "_")))
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(async s => {
      const pic = {page: s.content_urls?.desktop?.page || "https://en.wikipedia.org/wiki/" + encodeURIComponent(title.replace(/ /g, "_")),
        src: s.thumbnail?.source, credit: ""};
      const file = s.originalimage?.source && decodeURIComponent(s.originalimage.source.split("/").pop());
      if (!pic.src || !file) return pic;
      pic.file = "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(file);
      try {
        const q = await fetch("https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=extmetadata&titles=File:" + encodeURIComponent(file)).then(r => r.json());
        const m = Object.values(q.query.pages)[0].imageinfo[0].extmetadata;
        pic.credit = [plain(m.Artist?.value), m.LicenseShortName?.value].filter(Boolean).join(", ");
      } catch (e) {}
      return pic;
    })
    .catch(() => { delete wikiPics[title]; return {page: "https://en.wikipedia.org/wiki/" + encodeURIComponent(title.replace(/ /g, "_"))}; });
}
// The cat's photo beside the clue, with "Iberian lynx on Wikipedia" and the photo credit under it.
function showCatPic(code) {
  const box = $("wildpic");
  box.hidden = $("catWiki").hidden = !code;
  if (!code) return;
  const title = wikiTitle(code);
  if (box.dataset.title === title) return;
  box.dataset.title = title;
  $("catImg").hidden = true; $("catImg").removeAttribute("src");
  $("catMore").textContent = title + " on Wikipedia"; $("catMore").href = "https://en.wikipedia.org/wiki/" + encodeURIComponent(title.replace(/ /g, "_"));
  $("catCredit").textContent = "";
  wikiPic(title).then(pic => {
    if (box.dataset.title !== title) return;
    $("catMore").href = $("catImgLink").href = pic.page;
    if (pic.src) { $("catImg").src = pic.src; $("catImg").alt = "Photo: " + title; $("catImg").onload = () => { $("catImg").hidden = false; }; }
    if (pic.credit) { $("catCredit").textContent = "Photo: " + pic.credit; $("catCredit").href = pic.file; }
  });
}
// Countries never offered as each other's wrong answer on Pick, however close: both claim land the map stripes as
// disputed (and Israel and Palestine, the owner's call).
const NEVER_WITH = {};
for (const [a, b] of [["RUS", "UKR"], ["ISR", "SYR"], ["ISR", "PSX"], ["MAR", "SAH"], ["IND", "PAK"], ["IND", "CHN"], ["SDN", "SDS"]])
  (NEVER_WITH[a] = NEVER_WITH[a] || []).push(b), (NEVER_WITH[b] = NEVER_WITH[b] || []).push(a);
// "Greenland Denmark" or "Greenland (Denmark)" typed in one go: the territory and its country, or null.
function bothNames(text) {
  const n = norm(text);
  for (const d in DEPS) for (const name of [DEPS[d][0], ...(AKA[d] || [])]) {
    const k = norm(name);
    if (n.startsWith(k + " ")) { const o = LOOKUP.get(n.slice(k.length + 1)); if (o && NAMES[o]) return [d, o]; }
  }
  return null;
}
// The disputed-territory round: each place has a sentence with blanks, {0} for the place itself and {1}, {2}... for
// the countries in its dispute (codes in `who`). Every name in `aka` also counts for the place; naming them earns bonuses.
// The sentences say who controls and who claims, never who's right.
const DISPUTES = {
  crimea: {name: "Crimea", aka: ["Crimean Peninsula", "Krym"], s: "{0} is controlled by {1} and claimed by {2}.", who: ["RUS", "UKR"]},
  donbas: {name: "Donbas", aka: ["Donbass", "Donetsk and Luhansk", "Donetsk", "Luhansk"], s: "Most of the {0} is controlled by {1} and claimed by {2}.", who: ["RUS", "UKR"]},
  golan: {name: "Golan Heights", aka: ["Golan", "Jawlan"], s: "The {0} are controlled by {1} and claimed by {2}.", who: ["ISR", "SYR"]},
  wsahara: {name: "Western Sahara", aka: ["Sahrawi Arab Democratic Republic", "Sahrawi Republic", "SADR", "Southern Provinces"], s: "Most of {0} is controlled by {1}, and the Sahrawi Republic claims all of it.", who: ["MAR"]},
  kashmir: {name: "Kashmir", aka: ["Jammu and Kashmir", "Azad Kashmir", "Gilgit-Baltistan", "Ladakh"], s: "{0} is divided between {1}, {2} and {3}, and none of the lines between them is an agreed border.", who: ["IND", "PAK", "CHN"]},
  aksaichin: {name: "Aksai Chin", aka: [], s: "{0} is controlled by {1} and claimed by {2}.", who: ["CHN", "IND"]},
  arunachal: {name: "Arunachal Pradesh", aka: ["Zangnan", "South Tibet"], s: "{0} is controlled by {1} and claimed by {2}.", who: ["IND", "CHN"]},
  abkhazia: {name: "Abkhazia", aka: ["Apsny"], s: "{0} governs itself with {1}'s backing and is claimed by {2}.", who: ["RUS", "GEO"]},
  sossetia: {name: "South Ossetia", aka: ["Tskhinvali Region", "Alania"], s: "{0} governs itself with {1}'s backing and is claimed by {2}.", who: ["RUS", "GEO"]},
  transnistria: {name: "Transnistria", aka: ["Pridnestrovie", "Transdniestria"], s: "{0} governs itself and is claimed by {1}.", who: ["MDA"]},
  ncyprus: {name: "Northern Cyprus", aka: ["North Cyprus", "TRNC", "Turkish Republic of Northern Cyprus"], s: "{0} governs itself, is recognised only by {1}, and is claimed by {2}.", who: ["TUR", "CYP"]},
  somaliland: {name: "Somaliland", aka: ["Republic of Somaliland"], s: "{0} governs itself and is claimed by {1}.", who: ["SOM"]},
  abyei: {name: "Abyei", aka: [], s: "{0} is claimed by both {1} and {2}.", who: ["SDN", "SDS"]},
  ilemi: {name: "Ilemi Triangle", aka: ["Ilemi"], s: "The {0} is controlled by {1} and claimed by {2}.", who: ["KEN", "SDS"]},
  kurils: {name: "Kuril Islands", aka: ["Kurils", "Southern Kurils", "Northern Territories", "Chishima"], s: "The southern {0} are controlled by {1} and claimed by {2}.", who: ["RUS", "JPN"]},
  karabakh: {name: "Nagorno-Karabakh", aka: ["Artsakh", "Karabakh", "Mountainous Karabakh"], s: "{0} was fought over by {1} and {2}; Azerbaijan has controlled it since 2023.", who: ["ARM", "AZE"]},
  kosovo: {name: "Kosovo", aka: ["Kosova", "Republic of Kosovo"], s: "{0} declared independence from {1}, which still claims it.", who: ["SRB"]},
  taiwan: {name: "Taiwan", aka: ["Republic of China", "Formosa", "Chinese Taipei"], s: "{0} governs itself and is claimed by {1}.", who: ["CHN"]},
  palestine: {name: "Palestine", aka: ["State of Palestine", "Palestinian territories", "West Bank and Gaza"], s: "{0} is recognised as a state by most UN members; its borders with {1} are not agreed.", who: ["ISR"]},
  korea: {name: "Korean Peninsula", aka: ["Korea"], s: "The {0} is divided between {1} and {2}, and each claims all of it.", who: ["PRK", "KOR"]},
  falklands: {name: "Falkland Islands", aka: ["Falklands", "Malvinas", "Islas Malvinas"], s: "The {0} are governed by the {1} and claimed by {2}.", who: ["GBR", "ARG"]},
  chagos: {name: "Chagos Islands", aka: ["Chagos Archipelago", "British Indian Ocean Territory"], s: "The UN backs {1}'s claim to the {0}, which the {2} took in 1965.", who: ["MUS", "GBR"]},
  belize: {name: "Belize", aka: [], s: "{1} claims about half of {0}.", who: ["GTM"]},
  essequibo: {name: "Essequibo", aka: ["Guayana Esequiba"], s: "{1} claims the {0} region, about two-thirds of {2}.", who: ["VEN", "GUY"]}};
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
  PNG: ["PNG"], NZL: ["Aotearoa"], DOM: ["DR"], SDS: ["S Sudan"], GNQ: ["Eq Guinea"],
  GRL: ["Kalaallit Nunaat"], FLK: ["Falklands", "Malvinas", "Islas Malvinas"], FRO: ["Faeroe Islands", "Faroes"],
  SGS: ["South Georgia"], ATF: ["French Southern Lands", "Kerguelen"], HMD: ["Heard Island"], SJM: ["Svalbard and Jan Mayen"],
  SHN: ["Saint Helena", "St Helena"], IOA: ["Christmas Island", "Cocos Islands", "Cocos (Keeling) Islands"],
  IOT: ["Chagos", "British Indian Ocean Territory", "BIOT"], BES: ["Caribbean Netherlands", "Bonaire", "Saba", "Sint Eustatius"],
  BLM: ["St Barts", "St Barths", "Saint-Barthélemy"], MAF: ["St Martin", "Saint-Martin"], VIR: ["US Virgin Islands", "USVI"],
  VGB: ["BVI"], TCA: ["Turks and Caicos"], CYM: ["Caymans"], PYF: ["Tahiti"], WLF: ["Wallis"], MNP: ["Northern Marianas"],
  SPM: ["St Pierre and Miquelon"], ATC: ["Ashmore Reef"], MAC: ["Macau"], HKG: ["HK"]};

/* ---------- names ---------- */
// What a typed name is compared by: no accents, case, punctuation, "the", and "St" read as "Saint".
function norm(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/&/g, " and ")
    .replace(/\bst\b\.?/g, "saint").replace(/[^a-z]+/g, " ").replace(/\bthe\b/g, " ").replace(/\s+/g, " ").trim();
}
const LOOKUP = new Map();
for (const c of PLACES) for (const n of [nameOf(c), ...(AKA[c] || [])]) LOOKUP.set(norm(n), c);
const SORTED = [...PLACES].sort((a, b) => nameOf(a).localeCompare(nameOf(b)));
// Countries for Medium's list: every country, or those whose name (or other name) has a word starting with what's typed,
// names that start with it first.
// (Only countries, when it's the bonus question of whose a territory is.)
function matching(q, countriesOnly) {
  const from = countriesOnly ? SORTED.filter(c => NAMES[c]) : SORTED;
  q = norm(q); if (!q) return from;
  const starts = [], words = [];
  for (const c of from) {
    const ns = [nameOf(c), ...(AKA[c] || [])].map(norm);
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
function buildWorld(raw, disputedRaw, dzRaw) {
  const land = new Path2D(), by = {}, main = {}, disputed = new Path2D();
  for (const [, , mp] of disputedRaw) for (const poly of mp) for (const ring of poly) {
    ring.forEach(([lon, lat], i) => { const [x, y] = project(lon, lat); if (i) disputed.lineTo(x, y); else disputed.moveTo(x, y); });
    disputed.closePath();
  }
  // the disputed round's shapes light up like places, but aren't drawn as land of their own
  for (const [code, mp] of dzRaw) raw.push([code, "", "", "", "", mp]);
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
    if (!code.startsWith("dz:")) land.addPath(path);
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
const KEY = "catdoku.catlas.v1", TRIP = 10, TRIES = 2;
// Levels are the owner's three lists of places: Easy, Medium and Hard (TIERS: 1, 2, 3).
// A level's trip mixes in easier places: Easy is 10 Easy; Medium 7 Medium + 3 Easy; Hard 6 Hard + 3 Medium + 1 Easy.
const LEVELS = [null, "Easy", "Medium", "Hard"];
const TIERS = /*TIERS*/;
const MIX = [null, [[1, 10]], [[2, 7], [1, 3]], [[3, 6], [2, 3], [1, 1]]];
// Never asked on Hard, however a trip is mixed.
const NOT_ON_HARD = ["USA", "MEX", "CAN", "RUS", "BRA", "AUS", "IND", "CHN"];
// Regions, and the ones each level offers. Where a continent has too few places at a level, it's paired with
// another (Europe & Africa, Asia & Oceania). Easy Americas also asks Panama and Jamaica, to make up 10.
const REGIONS = {world: ["World", null], americas: ["Americas", ["Americas"]], africa: ["Africa", ["Africa"]], asia: ["Asia", ["Asia"]],
  europe: ["Europe", ["Europe"]], oceania: ["Australia and Oceania", ["Oceania"]], eurafrica: ["Europe & Africa", ["Europe", "Africa"]],
  asiaoceania: ["Asia & Oceania", ["Asia", "Oceania"]]};
const REGIONS_AT = [null, ["world", "americas", "eurafrica", "asiaoceania"], ["world", "americas", "africa", "europe", "asiaoceania"],
  ["world", "americas", "africa", "asia", "europe", "oceania"]];
const EASY_EXTRA = {americas: ["PAN", "JAM"]};
// Moving up a level, a region that the next level splits goes to its first part.
const REGION_UP = {eurafrica: "europe", asiaoceania: "asia"};
// How the answer is given: always the player's choice, List by default.
const STYLES = {pick: ["Pick", "Choose from 4 names. Makes it easier."], list: ["List", "Type, with a list of every place to choose from."],
  type: ["Type", "Type the name with no list. Makes it harder."]};
const STYLE_ORDER = ["pick", "list", "type"];
const $ = G.$;
let saved = G.load(KEY), settings = Object.assign({level: 1, region: "world", style: "list"}, saved.settings), recent = saved.recent || [], game = null, busy = false;
const save = () => G.save(KEY, {settings, recent, game});
const current = () => game.trip[game.i] && game.trip[game.i].c;
const style = () => settings.style;
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const regionOf = c => (world && world.main[c] ? world.main[c].region : "");
// Best times are kept by level and answer style: the level times 10 plus 1, 2 or 3 for Pick, List or Type.
const bestKey = g => (g.mode === "disputed" ? 90 : g.level * 10) + STYLE_ORDER.indexOf(g.style) + 1;
const keyName = n => `${n >= 90 ? "Disputed land" : LEVELS[Math.floor(n / 10)]} · ${STYLES[STYLE_ORDER[n % 10 - 1]][0]}`;

// Countries by size: [km², 1 if it has no land border], for how alike two places are.
const SIZE = /*SIZES*/;
const km2 = c => SIZE[c][0];
// How far apart two places' main pieces are on the map, the short way round.
function apart(a, b) {
  const p = world.main[a], q = world.main[b], dx = Math.abs(p.x - q.x);
  return Math.hypot(Math.min(dx, WORLD - dx), p.y - q.y);
}
const sizeGap = (a, b) => Math.abs(Math.log(km2(a) / km2(b)));
// Pick's three wrong names, all from the same continent. Easy: other Easy places, spread out and of other sizes;
// Medium: one near neighbour and two others; Hard: the nearest look-alikes (near, and of a similar size).
function wrongNames(c, level) {
  let all = PLACES.filter(d => d !== c && world.main[d] && regionOf(d) === regionOf(c) && !(NEVER_WITH[c] || []).includes(d));
  if (all.length < 6) all = PLACES.filter(d => d !== c && world.main[d] && !(NEVER_WITH[c] || []).includes(d)).sort((a, b) => apart(c, a) - apart(c, b)).slice(0, 8);
  const byNear = [...all].sort((a, b) => apart(c, a) - apart(c, b));
  if (level === 1) {
    const easy = all.filter(d => TIERS[d] === 1), fair = all.filter(d => TIERS[d] <= 2), from = easy.length >= 3 ? easy : fair.length >= 3 ? fair : all;
    const far = [...from].sort((a, b) => apart(c, b) - apart(c, a)).slice(0, Math.max(3, Math.ceil(from.length / 2)));
    const other = far.filter(d => sizeGap(c, d) > Math.log(3));
    return shuffle(other.length >= 3 ? other : far).slice(0, 3);
  }
  if (level === 2) { const near = shuffle(byNear.slice(0, 3))[0]; return [near, ...shuffle(all.filter(d => d !== near)).slice(0, 2)]; }
  const alike = [...all].sort((a, b) => (apart(c, a) / 30 + sizeGap(c, a)) - (apart(c, b) / 30 + sizeGap(c, b)));
  return shuffle(alike.slice(0, 4)).slice(0, 3);
}
// Ten places for a level and region, not asked lately where that leaves enough.
function makeTrip(level, region) {
  const conts = REGIONS[region][1], extra = level === 1 ? EASY_EXTRA[region] || [] : [];
  const tierOf = c => extra.includes(c) ? 1 : TIERS[c];
  const pool = PLACES.filter(c => world.main[c] && (!conts || conts.includes(regionOf(c))) && tierOf(c) <= level && !(level === 3 && NOT_ON_HARD.includes(c)));
  const pick = (from, n) => { const fresh = from.filter(c => !recent.includes(c)); return shuffle(fresh.length >= n ? fresh : from).slice(0, n); };
  let codes = [];
  for (const [t, n] of MIX[level]) codes.push(...pick(pool.filter(c => tierOf(c) === t && !codes.includes(c)), n));
  // a region short of one kind of place makes up the rest from the others it has
  if (codes.length < TRIP) codes.push(...pick(pool.filter(c => !codes.includes(c)), TRIP - codes.length));
  return shuffle(codes).map(c => DEPS[c] ? {c, opts: shuffle([c, ...wrongNames(c, level)]), owners: shuffle([DEPS[c][1], ...shuffle(OWNERS.filter(o => o !== DEPS[c][1])).slice(0, 3)])}
    : {c, opts: shuffle([c, ...wrongNames(c, level)])});
}
const freshCard = () => ({wrong: [], hints: 0, out: []});
function fillRegions(level, region) {
  const sel = $("regionSel"); sel.innerHTML = "";
  for (const r of REGIONS_AT[level]) sel.append(new Option(REGIONS[r][0], r));
  sel.value = REGIONS_AT[level].includes(region) ? region : REGIONS_AT[level].includes(REGION_UP[region]) ? REGION_UP[region] : "world";
  return sel.value;
}
function newTrip(level, region, trip) {
  settings.round = "countries"; showMode();
  region = fillRegions(level, region);
  settings.level = level; settings.region = region; $("levelSel").value = level;
  game = {level, region, style: style(), trip: trip || makeTrip(level, region), i: 0, res: [], card: freshCard(), hinted: false, restarted: false, won: false, ...G.freshClock()};
  if (!trip) recent = [...recent, ...game.trip.map(t => t.c)].slice(-120);
  save(); show(true);
}
// Switching how answers are given works mid-trip; the trip's time and share count the easiest style used.
function setStyle(s) {
  settings.style = s; $("styleSel").value = s; $("styleHint").textContent = STYLES[s][1];
  if (game && !game.won && STYLE_ORDER.indexOf(s) < STYLE_ORDER.indexOf(game.style)) game.style = s;
  active = -1; save(); if (game) show();
}

function show(fly) {
  if (game.mode === "disputed") return showDz(fly);
  const code = current(), done = game.won;
  // progress dots: green on the first try, coral after a miss
  $("count").innerHTML = game.trip.map((t, i) => `<i class="${i < game.res.length ? (game.res[i].first ? "ok" : "miss") : i === game.i && !done ? "now" : ""}"></i>`).join("");
  $("count").setAttribute("aria-label", `Cat ${Math.min(game.i + 1, TRIP)} of ${TRIP}`);
  const cat = CATS[CLUE[code]] || "the cat", bonus = !done && game.card.bonus === "ask";
  $("clue").innerHTML = done ? "Trip done!" : bonus ? `Bonus: which country does <b>${nameOf(code)}</b> belong to?`
    : CLUE[code] === "house" ? "Where did the <b>housecat</b> migrate?" : CLUE[code] === "empty" ? "Where's the <b>cat</b> exploring where no one lives?"
    : `Where's ${cat.replace(/^(the )?(.*)$/, (m, the, rest) => `${the || ""}<b>${rest}</b>`)}?`;
  showCatPic(done || bonus ? null : code);
  $("skipBtn").hidden = !bonus;
  $("reveal").textContent = !done && !bonus && style() !== "pick" && game.card.hints ? reveal(nameOf(code), game.card.hints) : "";
  $("choices").hidden = done || style() !== "pick";
  $("typebox").hidden = done || style() === "pick";
  $("list").hidden = done || style() !== "list";
  if (style() === "pick" && !done) {
    $("choices").innerHTML = "";
    for (const o of bonus ? game.trip[game.i].owners : game.trip[game.i].opts) {
      const b = document.createElement("button"); b.textContent = nameOf(o);
      if (bonus) { b.onclick = () => answerBonus(o, b); $("choices").append(b); continue; }
      if (game.card.wrong.includes(o)) b.className = "wrong"; else if (game.card.out.includes(o)) b.className = "out";
      else if (o === code && game.card.hints > 2) b.className = "gold";
      b.disabled = game.card.wrong.includes(o) || game.card.out.includes(o);
      b.onclick = () => answer(o, b);
      $("choices").append(b);
    }
  }
  if (style() === "list" && !done) fillList();
  $("tried").innerHTML = style() !== "pick" && !done && !bonus ? game.card.wrong.map(c => `<span>${nameOf(c)}</span>`).join("") : "";
  $("hintBtn").disabled = done || bonus;
  if (world && code && fly) flyTo(frameFor(code), fly === "jump");
  else redraw();
}
// "N o r _ _ _" with the first n letters showing (spaces and hyphens always show).
function reveal(name, n) {
  let k = 0;
  return [...name].map(ch => /[\p{L}]/u.test(ch) ? (k++ < n ? ch : "_") : ch).join(" ");
}

// The List style's list of every place, narrowed to what's typed.
let active = -1;
function fillList() {
  const list = $("list"), dz = game.mode === "disputed";
  const cs = dz ? (q => DZ_LIST().filter(c => !norm(q) || (" " + norm(nameOf(c))).includes(" " + norm(q))))($("guess").value) : matching($("guess").value, game.card.bonus === "ask");
  list.innerHTML = "";
  if (!cs.length) { const li = document.createElement("li"); li.className = "none"; li.textContent = "No country starts like that"; list.append(li); }
  cs.forEach((c, i) => {
    const li = document.createElement("li"); li.setAttribute("role", "option"); li.textContent = nameOf(c); li.dataset.c = c;
    li.setAttribute("aria-selected", i === active);
    li.onpointerdown = e => e.preventDefault();      // keep the keyboard up on phones
    li.onclick = () => dz ? dzGuess(nameOf(c)) : submit(c);
    list.append(li);
  });
}
$("guess").addEventListener("input", () => { active = $("guess").value.trim() ? 0 : -1; if (style() === "list") { fillList(); $("list").scrollTop = 0; } });
$("guess").addEventListener("keydown", e => {
  if (style() !== "list" || !["ArrowDown", "ArrowUp"].includes(e.key)) return;
  e.preventDefault();
  const n = $("list").querySelectorAll("li[data-c]").length; if (!n) return;
  active = (active + (e.key === "ArrowDown" ? 1 : -1) + n) % n; fillList();
  const li = $("list").querySelectorAll("li[data-c]")[active]; if (li) li.scrollIntoView({block: "nearest"});
});
$("typebox").addEventListener("submit", e => {
  e.preventDefault();
  const text = $("guess").value;
  if (game.mode === "disputed") {
    const li = style() === "list" && active >= 0 && $("list").querySelectorAll("li[data-c]")[active];
    return dzGuess(li ? li.textContent : text);
  }
  const exact = LOOKUP.get(norm(text)), both = !exact && bothNames(text);
  if (game.card.bonus === "ask") {
    if (exact && NAMES[exact]) { $("guess").value = ""; return answerBonus(exact); }
  } else if (exact) return submit(exact);
  else if (both) { game.card.bonus = both[1] === DEPS[both[0]][1] ? "given" : undefined; return submit(both[0]); }
  if (style() === "list") { const li = $("list").querySelectorAll("li[data-c]")[Math.max(active, 0)]; if (li && text.trim()) return submit(li.dataset.c); }
  if (!text.trim()) { G.note("Type the name of the lit country."); return; }
  G.note(`There's no ${game.card.bonus === "ask" ? "country" : "country or territory"} called “${text.trim()}”. Check the spelling?`);
});
function submit(c) { $("guess").value = ""; active = -1; if (game.card.bonus === "ask") answerBonus(c); else answer(c); }
const focusTyping = () => { if (style() !== "pick" && matchMedia("(hover: hover)").matches) $("guess").focus(); };

// Each place gets TRIES guesses; after that it's shown and counts as missed.
function answer(c, btn) {
  if (busy || !game || game.won) return;
  game.started = true;
  const code = current(), card = game.card;
  if (c !== code) {
    if (!card.wrong.includes(c)) card.wrong.push(c);
    if (card.wrong.length >= TRIES) {
      game.res.push({c: code, first: false, found: false, hinted: card.hints > 0});
      G.note(`It's ${nameOf(code)}.`, 2600);
      busy = true; save(); show();
      setTimeout(() => { busy = false; advance(); }, 1800);
      return;
    }
    G.note(`Not ${nameOf(c)}. One more try!`, 2500);
    save(); show(); if (style() !== "pick") $("guess").focus();
    return;
  }
  const given = card.bonus === "given";
  game.res.push({c, first: !card.wrong.length && !card.hints, found: true, hinted: card.hints > 0, ...(DEPS[c] ? {bonus: given} : {})});
  if (btn) btn.className = "right";
  const name = given ? `${nameOf(c)} (${nameOf(DEPS[c][1])})` : nameOf(c);
  G.note(card.wrong.length || card.hints ? `${name}, yes.${given ? " Bonus!" : ""}` : `${name}! First try.${given ? " Bonus!" : ""}`, 1800);
  flash = {code}; busy = true; redraw();
  setTimeout(() => {
    flash = null; busy = false;
    if (DEPS[c] && !given) { card.bonus = "ask"; save(); show(); focusTyping(); }
    else advance();
  }, 1100);
  save();
}
// The bonus for a territory: one try at the country it belongs to.
function answerBonus(o, btn) {
  if (busy || game.card.bonus !== "ask") return;
  const code = current(), owner = DEPS[code][1], got = o === owner;
  game.res[game.res.length - 1].bonus = got; game.card.bonus = "done";
  if (btn) btn.className = got ? "right" : "wrong";
  G.note(got ? `${nameOf(owner)}! Bonus!` : `It belongs to ${nameOf(owner)}.`, 2200);
  busy = true; save();
  setTimeout(() => { busy = false; advance(); }, got ? 900 : 1600);
}
$("skipBtn").onclick = () => { if (game.card.bonus !== "ask" || busy) return; if (game.mode === "disputed") { game.card.bonus = "done"; save(); return dzNext(); } game.card.bonus = "done"; G.note(`It belongs to ${nameOf(DEPS[current()][1])}.`, 2200); save(); advance(); };
function advance() {
  game.i++; game.card = freshCard();
  if (game.i >= TRIP) return win();
  save(); show(true); focusTyping();
}

// Moving up (no hints, no Restart): 8 or more on the first try, or 7 and a bonus, or all 10 found within their tries.
// Otherwise the next trip is the same level and region. Gold paw: all 10 on the first try, no hints.
function win() {
  game.won = true; game.i = TRIP - 1;
  const first = game.res.filter(r => r.first).length, found = game.res.filter(r => r.found).length, bonuses = game.res.filter(r => r.bonus).length;
  const clean = !game.hinted && !game.restarted;
  const up = clean && (first >= 8 || (first >= 7 && bonuses >= 1) || found === TRIP);
  const gold = clean && first === TRIP;
  const level = game.level, next = up ? Math.min(3, level + 1) : level, region = next > level ? REGION_UP[game.region] && !REGIONS_AT[next].includes(game.region) ? REGION_UP[game.region] : game.region : game.region;
  game.level = level; G.finishClock(Object.assign(game, {level: bestKey(game)}));
  game.level = level; save(); show();
  const deps = game.res.filter(r => "bonus" in r), bonusLine = deps.length ? ` Bonus: ${bonuses} of ${deps.length} territories' countries named.` : "";
  const where = r => `${LEVELS[next]}${r === "world" ? "" : ` (${REGIONS[r][0]})`}`;
  const why = game.hinted ? ` You had a hint, so here's another trip at ${where(region)}.`
    : game.restarted ? ` You restarted, so here's another trip at ${where(region)}.`
    : next > level ? ` On to ${where(region)}!`
    : up ? "" : " Get 8 on the first try (or 7 and a bonus), or find all 10, to move up.";
  G.winCard(`${first} of ${TRIP} on the first try, ${found} found.${bonusLine}${why}`, () => { G.closeCard(); newTrip(next, region); }, "Look at the map", game.result,
    {title: "Trip done!", gold, goldWhy: "Every cat found on the first try!", next: next > level ? `Next: ${LEVELS[next]}` : "New trip",
     after: G.otherSize($("levelSel"), next, l => newTrip(l, region), "Or play a different level:")});
  if (typeof PREVIEW !== "undefined") for (const b of $("card").querySelectorAll("button")) if (/share/i.test(b.textContent)) b.remove();
}

// A hint shows, it never answers: Pick crosses out a wrong name (then rings the right one in gold);
// List and Type spell out one more letter of the name.
$("hintBtn").onclick = () => {
  if (!game || game.won || busy) return;
  const code = current(), card = game.card;
  card.hints++; game.hinted = true; game.started = true;
  if (game.mode === "disputed") { G.note("The first empty blank gets one more letter."); save(); return show(); }
  if (style() === "pick") {
    const left = game.trip[game.i].opts.filter(o => o !== code && !card.wrong.includes(o) && !card.out.includes(o));
    if (left.length) { const o = left[Math.floor(Math.random() * left.length)]; card.out.push(o); G.note(`It isn't ${nameOf(o)}.`); }
    else { card.hints = 3; G.note("It's the one ringed in gold."); }
  } else {
    const letters = [...nameOf(code)].filter(ch => /\p{L}/u.test(ch)).length;
    card.hints = Math.min(card.hints, letters);
    G.note(card.hints >= letters ? "That's the whole name." : "One more letter, under the cat.");
  }
  save(); show();
};
$("restartBtn").onclick = () => { if (!game) return; if (game.mode === "disputed") newDzTrip(game.trip); else newTrip(game.level, game.region, game.trip); game.restarted = true; save(); };
$("newBtn").onclick = () => settings.round === "disputed" ? newDzTrip() : newTrip(+$("levelSel").value, $("regionSel").value);
$("levelSel").onchange = () => newTrip(+$("levelSel").value, $("regionSel").value);
$("regionSel").onchange = () => newTrip(+$("levelSel").value, $("regionSel").value);
for (const s of STYLE_ORDER) $("styleSel").append(new Option(STYLES[s][0], s));
$("styleSel").onchange = () => setStyle($("styleSel").value);
$("bestBtn").onclick = () => G.showBests("Best times", game ? bestKey(game) : settings.level * 10 + STYLE_ORDER.indexOf(settings.style) + 1);
G.setupTimer({name: "catlas", game: () => game, playing: g => !g.won, save, label: keyName, noun: "level"});

// How to play, on the real board.
function walkthrough() {
  if (!game) return;
  const steps = [
    {say: "A cat is hiding here.", lit: [[0, 0]], tone: "ok", els: [$("clue")]},
    {say: style() === "pick" ? "Tap the country's name." : style() === "list" ? "Type its name, or pick it from the list." : "Type its name, then Go.",
     lit: [], els: [style() === "pick" ? $("choices") : $("typebox")]},
    {say: "You get two tries for each.", lit: [], els: [style() === "pick" ? $("choices") : $("typebox")]},
    {say: "Drag or pinch the map to look around.", lit: [[0, 0]], els: [$("recentreBtn")]},
    {say: "Choose how you answer here.", lit: [], els: [$("styleSel")]},
    {say: "Stuck? Hint helps, but costs the gold paw.", lit: [], els: [$("hintBtn")]}];
  G.spotlight({grid: $("grid"), w: 1, h: 1, steps, done: () => { settings.seenHelp = true; save(); }});
}
$("helpBtn").onclick = () => game && game.won ? G.helpLater() : walkthrough();

/* ---------- the disputed-territory round ---------- */
// A separate mode: 10 disputed places, each a sentence to fill in. One answer box (or chips on Pick, or the list):
// a right guess fills whichever blank it belongs to. 3 wrong guesses and the rest are shown. Once a place is
// filled in, each of its other names is a bonus (Skip moves on). Gold paw: all 10 with no wrong guess and no hint.
const DZ_TRIES = 3;
const dzOf = c => DISPUTES[c.slice(3)];
// The blanks still to fill: index 0 is the place, then its countries.
const dzBlanks = d => [d.name, ...d.who.map(nameOf)];
const dzKnown = (d, i) => i === 0 ? [d.name, ...d.aka] : [nameOf(d.who[i - 1]), ...(AKA[d.who[i - 1]] || [])];
function makeDzTrip() {
  const ids = Object.keys(DISPUTES).filter(k => world.by["dz:" + k]);
  const fresh = ids.filter(k => !recent.includes("dz:" + k));
  return shuffle(fresh.length >= TRIP ? fresh : ids).slice(0, TRIP).map(k => {
    const d = DISPUTES[k], apartFrom = d.who.flatMap(w => NEVER_WITH[w] || []).filter(c => !d.who.includes(c));   // never Israel beside Palestine...
    const others = shuffle(Object.keys(DISPUTES).filter(o => o !== k && !apartFrom.some(c => nameOf(c) === DISPUTES[o].name))).slice(0, 2).map(o => DISPUTES[o].name);
    const near = PLACES.filter(c => NAMES[c] && !d.who.includes(c) && !apartFrom.includes(c) && world.main[c] && world.main[d.who[0]]).sort((a, b) => apart(d.who[0], a) - apart(d.who[0], b)).slice(0, 2).map(nameOf);
    const altDecoys = shuffle(Object.keys(DISPUTES).filter(o => o !== k).flatMap(o => DISPUTES[o].aka)).slice(0, 3);
    return {c: "dz:" + k, chips: shuffle([...dzBlanks(d), ...others, ...near]), altChips: shuffle([...d.aka, ...altDecoys])};
  });
}
function newDzTrip(trip) {
  settings.round = "disputed";
  game = {mode: "disputed", level: 9, region: "world", style: style(), trip: trip || makeDzTrip(), i: 0, res: [], card: dzCard(), hinted: false, restarted: false, won: false, ...G.freshClock()};
  if (!trip) recent = [...recent, ...game.trip.map(t => t.c)].slice(-120);
  save(); showMode(); show(true);
}
const dzCard = () => ({filled: [], wrong: [], hints: 0, alts: [], bonus: undefined});
function dzSentence(d, card) {
  const blank = i => {
    if (card.filled.includes(i)) return `<b>${esc(dzBlanks(d)[i])}</b>`;
    const first = card.filled.length === 0 || ![...dzBlanks(d).keys()].some(j => j < i && !card.filled.includes(j));
    const hint = first && card.hints ? dzBlanks(d)[i].slice(0, card.hints) : "";
    return `<span class="blank">${esc(hint)}${"_".repeat(Math.max(3, 8 - hint.length))}</span>`;
  };
  return d.s.replace(/\{(\d)\}/g, (m, i) => blank(+i)).replace(/^(\w)/, x => x.toUpperCase());
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
function showDz(fly) {
  const t = game.trip[game.i], d = dzOf(t.c), card = game.card, done = game.won, bonus = !done && card.bonus === "ask";
  $("count").innerHTML = game.trip.map((x, i) => `<i class="${i < game.res.length ? (game.res[i].first ? "ok" : "miss") : i === game.i && !done ? "now" : ""}"></i>`).join("");
  $("clue").classList.add("dz");
  $("clue").innerHTML = done ? "Round done!" : dzSentence(d, card);
  showCatPic(null);
  const left = d.aka.filter(a => !card.alts.includes(a));
  $("reveal").classList.toggle("note", bonus);
  $("reveal").textContent = bonus ? `Bonus: name another name for ${d.name} (${left.length} more)` + (card.alts.length ? ` · ${card.alts.join(", ")}` : "") : "";
  $("skipBtn").hidden = !bonus; $("skipBtn").textContent = "Skip the bonus";
  $("choices").hidden = done || style() !== "pick"; $("typebox").hidden = done || style() === "pick"; $("list").hidden = done || style() !== "list";
  if (style() === "pick" && !done) {
    $("choices").innerHTML = "";
    for (const name of bonus ? t.altChips : t.chips) {
      const b = document.createElement("button"); b.textContent = name;
      const used = bonus ? card.alts.includes(name) : dzBlanks(d).some((x, i) => x === name && card.filled.includes(i));
      if (used) b.className = "right"; if (card.wrong.includes(name)) b.className = "wrong";
      b.disabled = used || card.wrong.includes(name);
      b.onclick = () => dzGuess(name);
      $("choices").append(b);
    }
  }
  if (style() === "list" && !done) fillList();
  $("tried").innerHTML = style() !== "pick" && !done ? card.wrong.map(w => `<span>${esc(w)}</span>`).join("") : "";
  $("hintBtn").disabled = done || bonus;
  if (world && fly) flyTo(frameFor(t.c), fly === "jump"); else redraw();
}
// The list for the round: every disputed place and every country.
const DZ_LIST = () => [...Object.keys(DISPUTES).map(k => "dz:" + k), ...Object.keys(NAMES)].sort((a, b) => nameOf(a).localeCompare(nameOf(b)));
function dzGuess(text) {
  if (busy || !game || game.won || !text.trim()) return;
  game.started = true;
  const t = game.trip[game.i], d = dzOf(t.c), card = game.card, n = norm(text);
  if (card.bonus === "ask") {
    const alt = d.aka.find(a => norm(a) === n);
    if (alt && !card.alts.includes(alt)) { card.alts.push(alt); G.note(`${alt}! Bonus!`, 1600); game.res[game.res.length - 1].bonus = card.alts.length; }
    else if (alt) G.note("You've named that one.");
    else { G.note(`${d.name} isn't also called “${text.trim()}”.`, 2000); if (style() === "pick" && !card.wrong.includes(text)) card.wrong.push(text); }
    $("guess").value = "";
    if (card.alts.length === d.aka.length) { save(); return setTimeout(dzNext, 900); }
    save(); show(); return;
  }
  const i = dzBlanks(d).findIndex((x, j) => !card.filled.includes(j) && dzKnown(d, j).some(k => norm(k) === n));
  $("guess").value = ""; active = -1;
  if (i < 0) {
    const already = dzBlanks(d).findIndex((x, j) => card.filled.includes(j) && dzKnown(d, j).some(k => norm(k) === n));
    if (already >= 0) { G.note("That one's filled in already."); return; }
    card.wrong.push(text.trim());
    if (card.wrong.length >= DZ_TRIES) {
      card.filled = [...dzBlanks(d).keys()];
      game.res.push({c: t.c, first: false, found: false, hinted: card.hints > 0});
      G.note("Here's the whole sentence.", 2600); busy = true; save(); show();
      return setTimeout(() => { busy = false; dzNext(); }, 2600);
    }
    G.note(`“${text.trim()}” doesn't fit this one. ${DZ_TRIES - card.wrong.length} more ${DZ_TRIES - card.wrong.length === 1 ? "try" : "tries"}.`, 2500);
    save(); show(); focusTyping(); return;
  }
  card.filled.push(i);
  if (i === 0 && norm(d.name) !== n) { const alt = d.aka.find(a => norm(a) === n); if (alt) card.alts.push(alt); }
  if (card.filled.length < dzBlanks(d).length) { G.note("Yes!", 1200); save(); show(); focusTyping(); return; }
  game.res.push({c: t.c, first: !card.wrong.length && !card.hints, found: true, hinted: card.hints > 0, bonus: card.alts.length});
  G.note(card.wrong.length || card.hints ? "Filled in." : "All of it, first try!", 1600);
  flash = {code: t.c}; busy = true; save(); show();
  setTimeout(() => {
    flash = null; busy = false;
    if (d.aka.some(a => !card.alts.includes(a))) { card.bonus = "ask"; save(); show(); focusTyping(); } else dzNext();
  }, 1100);
}
function dzNext() {
  game.i++; game.card = dzCard();
  if (game.i >= TRIP) return dzWin();
  save(); show(true); focusTyping();
}
function dzWin() {
  game.won = true; game.i = TRIP - 1;
  const first = game.res.filter(r => r.first).length, found = game.res.filter(r => r.found).length, bonuses = game.res.reduce((s, r) => s + (r.bonus || 0), 0);
  const gold = !game.hinted && !game.restarted && first === TRIP;
  G.finishClock(Object.assign(game, {level: 90 + STYLE_ORDER.indexOf(game.style) + 1}));
  game.level = 9; save(); show();
  G.winCard(`${first} of ${TRIP} filled in with no wrong guesses, ${found} in all. ${bonuses} other ${bonuses === 1 ? "name" : "names"} named.`, () => { G.closeCard(); newDzTrip(); }, "Look at the map", game.result,
    {title: "Round done!", gold, goldWhy: "Every sentence right, first try!", next: "New round"});
  if (typeof PREVIEW !== "undefined") for (const b of $("card").querySelectorAll("button")) if (/share/i.test(b.textContent)) b.remove();
}
// Countries trips or the disputed round: the round has no levels or regions.
function showMode() {
  const dz = settings.round === "disputed";
  $("roundSel").value = dz ? "disputed" : "countries";
  for (const id of ["levelSel", "regionSel"]) $(id).closest("label").hidden = dz;
  $("clue").classList.toggle("dz", dz);
  $("newBtn").textContent = dz ? "New round" : "New trip";
  $("guess").placeholder = dz ? "Type a place or country" : "Type a country";
  if (!dz) $("reveal").classList.remove("note");
}
$("roundSel").onchange = () => { if ($("roundSel").value === "disputed") newDzTrip(); else { settings.round = "countries"; showMode(); newTrip(settings.level || 1, settings.region || "world"); } };

/* ---------- start ---------- */
function start() {
  setStyle(STYLES[settings.style] ? settings.style : "list");
  G.reopen(() => {
    const g = saved.game;
    if (g && g.trip && g.trip.length === TRIP && g.trip.every(t => PLACES.includes(t.c) || (t.c.startsWith("dz:") && DISPUTES[t.c.slice(3)])) && REGIONS[g.region]) {
      game = g; G.checkClock(game); settings.round = g.mode === "disputed" ? "disputed" : "countries"; showMode();
      if (g.mode !== "disputed") { $("levelSel").value = game.level; fillRegions(game.level, game.region); }
      show("jump");
    } else if (settings.round === "disputed") newDzTrip();
    else newTrip(settings.level || 1, settings.region || "world");
  }, msg => { newTrip(settings.level || 1, settings.region || "world"); G.note(msg, 0); });
  if (!settings.seenHelp) setTimeout(walkthrough, 400);
}
Promise.all(["world.json", "disputed.json", "dz.json"].map(f => fetch(f).then(r => r.json()))).then(([raw, disputed, dz]) => {
  world = buildWorld(raw, disputed, dz); $("loading").remove(); resize(); start();
}).catch(e => { $("loading").textContent = "The map couldn't load. Check your connection and reload."; throw e; });
