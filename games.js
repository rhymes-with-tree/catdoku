/* Shared helpers for the Catdoku family of games: links between games,
   saved progress, background puzzle building, and the win card. */
const G = (() => {
  // Every game: name, folder, one line about it, its colour in the games menu, its shelf (see GROUPS),
  // words to find it by in search (the puzzle it's based on and what it's like), and for games added from
  // 2026-10-18 on, the date it was added (so the daily challenge gives it a few days first; see daily).
  const GAMES = [
    ["Catdoku", "catdoku", "Help Higgins give every cat its own territory", "#BD5538", "logic", "queens star battle"],
    ["Yarn", "yarn", "Lead one strand through every ball", "#E16A4A", "lines", "zip path"],
    ["Patches", "patches", "Sew a four-fabric quilt", "#73A7AE", "logic", "map four colour color quilt"],
    ["Sunbeams", "sunbeams", "Every cat gets a warm spot", "#ECA818", "logic", "shikaku rectangles"],
    ["Toy Box", "toybox", "Help Laya put every toy back in its basket", "#B3B94B", "quick", "sort ball sort"],
    ["Pounce", "pounce", "Line up three of a kind for Crunch to pounce on", "#6AA673", "quick", "match 3 match-3 three in a row"],
    ["Twirl", "twirl", "Clear every ribbon off the mat so Bugsy can nap", "#B94588", "teasers", "ribbons unblock"],
    ["Toe Beans", "toebeans", "Make the number on the big pad", "#DD9DAD", "numbers", "countdown 24 sums arithmetic maths math"],
    ["Knock It Off", "knockitoff", "Help Fred push everything off the table", "#7885BA", "teasers", "push sokoban table"],
    ["Hide & Seek", "hideseek", "Find Jan Brady and friends hiding in the boxes", "#C9A26B", "logic", "minesweeper mines boxes"],
    ["Pawlette", "pawlette", "Mix colours: zen out, or swipe and line them up", "#9874CA", "quick", "colour color mixing paint zen"],
    ["Tangle", "tangle", "Untangle the yarn the cat got into", "#3C8681", "lines", "untangle planarity knots"],
    ["Catwalk", "catwalk", "Link the perches of a giant cat tower", "#A98663", "lines", "bridges hashi"],
    ["Fair Play", "tango", "Share two toys out fairly", "#B94588", "logic", "tango binary takuzu unruly"],
    ["Bubbles", "bubbles", "Bat bubbles up and pop three of a kind", "#5FA0C8", "quick", "bubble shooter pop"],
    ["Open the Door!", "opendoor", "Solve the puzzle so the cat can get through!", "#4E577D", "numbers", "kenken calcudoku keen sums sudoku"],
    ["Tunnel Run", "tunnelrun", "Assemble the tunnels for Bowtie to run through", "#7E63B8", "lines", "net pipes netslide"],
    ["Copycat", "copycat", "Find the boxes with matching toys", "#D08A4E", "quick", "memory pairs concentration"],
    ["Night Light", "nightlight", "Help Dottie get every cat to close its eyes", "#3A3358", "teasers", "lights out flip"],
    ["Unravel", "unravel", "Cover every line with one strand of yarn", "#E16A4A", "lines", "one line euler draw"],
    ["Tail Chase", "tailchase", "Help Jan Brady catch the toys without getting tangled", "#C9773F", "quick", "snake action"],
    ["Keyboard Cat", "keyboardcat", "Make words from the keys that still work", "#8D78AD", "words", "spelling bee"],
    ["If It Fits", "iffits", "Build the box, and Bugsy comes to sit in it", "#C4925C", "teasers", "tangram shapes"],
    ["High Perch", "highperch", "Raise every cat tree to just the right height", "#8E5E3E", "logic", "skyscrapers towers futoshiki sudoku latin square"],
    ["Fuzzy Spelling", "fuzzyspelling", "Slide the letters until the bar spells a word", "#B94588", "words", "thruline"],
    ["Cat-astrophe", "catastrophe", "Help Crunch dye the whole rug one colour", "#73A7AE", "teasers", "flood fill colour color"],
    ["Laser Pointer", "laserpointer", "Bounce the dot past every cat", "#E16A4A", "lines", "mirrors laser light"],
    ["Treat Time", "treattime", "Help Higgins give every cat just enough treats", "#ECA818", "numbers", "sumplete sums"],
    ["Up a Tree", "upatree", "Help Dottie climb the cat tree, one letter at a time", "#6AA673", "words", "word ladder weaver doublets"],
    ["Toydoku", "toydoku", "Help Laya give every row, column and box one of each toy", "#B3B94B", "logic", "sudoku solo number place latin square"],
    ["Scratch That", "scratchthat", "Save the sofa from Dottie!", "#8D78AD", "logic", "light up akari lamps lighting scratching posts"],
    ["Pick of the Pile", "pickpile", "Help Fred put the toy blocks away in pairs", "#7885BA", "teasers", "mahjong solitaire mahjongg shanghai tile match pairs"],
    ["Fridge Magnets", "magnets", "Help Crunch put every letter back on the fridge", "#BD5538", "words", "unolingo crossword alphabet letters", "2026-10-19"],
    ["Purrfect Square", "purrfect", "Make every row, column and diagonal add up the same", "#ECA818", "numbers", "magic square sums arithmetic maths math", "2026-10-20"],
    ["Catlas", "atlas", "Name the country where each cat is hiding", "#5FA0C8", "travels", "geography countries world map quiz seterra flags places territories wild cats", "2026-10-22"],
    ["Cat Burglar", "catburglar", "Catch the cat that's sneaked into the painting", "#4E577D", "quick", "hidden object find spot seek paintings art museum met where's waldo wally", "2026-10-22"],
  ];
  // The shelves the front page and the games menu sort the games onto, in order: key (also a plain name for it,
  // for search), heading, one line.
  const GROUPS = [
    ["logic", "Cat Logic", "Fill the grid by its rules; every puzzle has one answer"],
    ["numbers", "Cat Math", "Sums and arithmetic"],
    ["lines", "Cat Trails", "Join, link and route things"],
    ["words", "Cat Spells", "Spell, find and climb words"],
    ["teasers", "Curious Cat", "Moves to plan and shapes to fit"],
    ["quick", "Kitten Play", "Match, pop, sort and chase"],
    ["travels", "Cat Travels", "Countries, maps and places"],
  ];
  const $ = id => document.getElementById(id);

  /* ---------- the daily challenge ---------- */
  // One game a day is today's challenge, the same game for everyone on a given date: win any puzzle in it that
  // day (in Pawlette, clear 3 lines in one Swipe game) to do it. The games come round in cycles: the first, from
  // DAILY_START, begins with Catdoku and then takes the rest in a shuffled order; each later cycle is shuffled
  // afresh, never the same game two days running. A new game (one with an added date) joins the first cycle
  // that starts at least DAILY_WAIT days after it was added, so it has a few days on the site first.
  const DAILY_START = "2026-10-18", DAILY_WAIT = 3, DAILY = "catdoku.daily.v1";
  const dayNum = ymd => { const [y, m, d] = ymd.split("-").map(Number); return Math.round(Date.UTC(y, m - 1, d) / 864e5); };
  const today = () => { const t = new Date(); return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`; };
  const ymdOf = n => new Date(n * 864e5).toISOString().slice(0, 10);
  function seeded(seed) { return () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  // The slug of the challenge on a date (today if none given).
  function daily(ymd = today()) {
    const day = dayNum(ymd) - dayNum(DAILY_START);
    if (day < 0) return GAMES[0][1];
    let start = 0, last = null;
    for (let c = 0; ; c++) {
      const joined = GAMES.filter(g => !g[6] || dayNum(g[6]) + DAILY_WAIT <= dayNum(DAILY_START) + start).map(g => g[1]);
      const rnd = seeded(c + 1), order = joined.slice();
      for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      if (c === 0) { order.splice(order.indexOf(GAMES[0][1]), 1); order.unshift(GAMES[0][1]); }
      else if (order[0] === last) order.push(order.shift());
      if (day < start + order.length) return order[day - start];
      start += order.length; last = order[order.length - 1];
    }
  }
  // The dates the challenge was done on this device, and the streak: days in a row up to today, or up to
  // yesterday while today's is still to do.
  const dailyDates = () => { const d = load(DAILY).done; return Array.isArray(d) ? d : []; };
  function dailyStreak() {
    const done = new Set(dailyDates());
    let n = dayNum(today());
    if (!done.has(ymdOf(n))) n--;
    let k = 0; while (done.has(ymdOf(n - k))) k++;
    return k;
  }
  const dailyDoneToday = () => dailyDates().includes(today());
  let CURRENT = null;   // the game on this page, from nav
  let HOME = "../";     // the front page, from nav's base
  // A win just now on this page (in Pawlette, 3 lines cleared in one Swipe game): if it's today's challenge, mark
  // it done. Called at the moment of winning (finishClock), never when a solved puzzle is reopened, so an old
  // win doesn't count for today. Returns the line for the win card, or "".
  let justDone = false;   // whether the latest win on this page is the one that did today's challenge
  function dailyWon() {
    justDone = false;
    if (!CURRENT || CURRENT !== daily() || dailyDoneToday()) return "";
    save(DAILY, {done: dailyDates().concat(today()).slice(-400)}); track(`Daily challenge done: ${CURRENT}`);
    const b = $("dailyBadge"); if (b) b.refresh();
    justDone = true;
    return dailyLine();
  }
  // The win card's line, only for the win that did today's challenge (later wins that day leave it to the badge).
  function dailyLine() {
    if (!justDone) return "";
    const k = dailyStreak();
    return `Today's challenge solved! ${k > 1 ? `${k}-day streak!` : "Come back tomorrow for a new challenge!"}`;
  }

  // Favorite games, picked with a star and kept on this device in the order they were picked, for the Favorites
  // row on the front page and in the menu.
  const FAVS = "catdoku.favorites.v1";
  const favorites = () => { const f = load(FAVS).games; return Array.isArray(f) ? f.filter(s => GAMES.some(g => g[1] === s)) : []; };
  function toggleFavorite(slug) {
    const f = favorites(), on = !f.includes(slug);
    save(FAVS, {games: on ? [...f, slug] : f.filter(s => s !== slug)});
    track(`${on ? "Favorited" : "Unfavorited"} ${slug}`);
    return on;
  }
  // A star button that adds a game to the favorites or takes it off; every star for that game on the page follows,
  // and `onChange` runs after (to redraw a Favorites row). `withLabel` adds a word, for a game's own page.
  function favStar(slug, onChange, withLabel) {
    const b = document.createElement("button"), name = (GAMES.find(g => g[1] === slug) || [slug])[0];
    b.type = "button"; b.className = "favStar" + (withLabel ? " labelled" : ""); b.dataset.slug = slug;
    b.onclick = e => {
      e.preventDefault(); e.stopPropagation();
      const on = toggleFavorite(slug);
      document.querySelectorAll(".favStar").forEach(x => x.dataset.slug === slug && x.refresh());
      if (onChange) onChange();
      if (withLabel) note(on ? `${name} is in your favorites, at the top of the front page.` : `${name} is out of your favorites.`, 3500);
    };
    b.refresh = () => {
      const on = favorites().includes(slug);
      b.innerHTML = `<span class="st">${on ? "★" : "☆"}</span>` + (withLabel ? "<span>Favorite</span>" : "");
      b.setAttribute("aria-pressed", String(on));
      b.setAttribute("aria-label", on ? `${name} is a favorite. Tap to take it off.` : `Add ${name} to favorites`);
      b.title = on ? "In your favorites" : "Add to favorites";
    };
    b.refresh(); return b;
  }
  // Whether a game matches what's typed in a search box: every word typed is found in its name, line, shelf (its
  // heading, plain name or line) or search words.
  const matches = (g, q) => {
    const hay = [g[0], g[2], g[5], ...(GROUPS.find(x => x[0] === g[4]) || [])].join(" ").toLowerCase().replace(/[^a-z0-9 ]/g, "");
    return q.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean).every(w => hay.includes(w));
  };

  // The games menu: an "All games" button that opens a grid of every game, with this one marked.
  // Game pages sit one folder below the front page, so links start with ../ unless `base` says otherwise.
  function nav(current, base = "../") {
    CURRENT = current || null; HOME = base || "./";
    const el = $("games"); el.innerHTML = "";
    const btn = document.createElement("button");
    btn.className = "gamesBtn"; btn.type = "button";
    btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-controls", "gamesPanel");
    btn.innerHTML = `<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>All ${GAMES.length} games<span class="caret" aria-hidden="true">▾</span>`;
    const panel = document.createElement("div");
    panel.className = "gamesPanel"; panel.id = "gamesPanel"; panel.hidden = true;
    const home = document.createElement("a");
    home.className = "gameTile home"; home.href = base || "./";
    home.innerHTML = "<b>Front page</b><small>Every game at a glance</small>";
    // a search box, then your favorites, then every game on its shelf
    const search = document.createElement("input");
    search.type = "search"; search.className = "gamesSearch"; search.placeholder = "Search games (try “word” or “sudoku”)";
    search.setAttribute("aria-label", "Search games");
    const tile = g => {
      const [name, slug, blurb, color] = g, a = document.createElement("a");
      a.className = "gameTile"; a.style.setProperty("--tile", color);
      a.href = `${base}${slug}/`; a.dataset.slug = slug;
      if (slug === current) a.setAttribute("aria-current", "page");
      const b = document.createElement("b"); b.textContent = name;
      const sm = document.createElement("small"); sm.textContent = slug === current ? "You're here" : blurb;
      a.append(b, sm);
      // the star sits beside the link, not in it, so tapping it doesn't open the game
      const w = document.createElement("div"); w.className = "favWrap"; w.dataset.slug = slug;
      w.append(a, favStar(slug, drawFavs)); return w;
    };
    const section = (title, games) => {
      const sec = document.createElement("section"); sec.className = "gamesGroup";
      const h = document.createElement("h3"); h.textContent = title;
      const grid = document.createElement("div"); grid.className = "gamesGrid";
      grid.append(...games.map(tile)); sec.append(h, grid); return sec;
    };
    const favs = section("Favorites", []);
    function drawFavs() {
      const list = favorites().map(s => GAMES.find(g => g[1] === s));
      favs.querySelector(".gamesGrid").replaceChildren(...list.map(tile));
      favs.hidden = !list.length || !!search.value.trim();
    }
    const shelves = GROUPS.map(([key, title]) => section(title, GAMES.filter(g => g[4] === key)));
    const none = document.createElement("p"); none.className = "gamesNone"; none.hidden = true; none.textContent = "No games match that.";
    const dslug = daily(), dgame = GAMES.find(g => g[1] === dslug);
    const todays = section(dailyDoneToday() ? "Today's challenge: done" : "Today's challenge", [dgame]);
    panel.append(home, todays, search, favs, ...shelves, none);
    drawFavs();
    search.oninput = () => {
      const q = search.value.trim();
      favs.hidden = !!q || !favorites().length;
      todays.hidden = !!q;
      for (const sec of shelves) {
        let any = false;
        for (const w of sec.querySelectorAll(".favWrap")) { const hit = !q || matches(GAMES.find(g => g[1] === w.dataset.slug), q); w.hidden = !hit; any = any || hit; }
        sec.hidden = !any;
      }
      none.hidden = !q || shelves.some(sec => !sec.hidden);
    };
    const show = open => { panel.hidden = !open; btn.setAttribute("aria-expanded", String(open)); };
    btn.onclick = e => { e.stopPropagation(); show(panel.hidden); };
    document.addEventListener("click", e => { if (!panel.hidden && !el.contains(e.target)) show(false); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !panel.hidden) { show(false); btn.focus(); } });
    // on a game's page, its own star beside the menu button
    const row = document.createElement("div"); row.className = "gamesRow"; row.append(btn);
    if (current) row.append(favStar(current, drawFavs, true));
    el.append(row, panel);
    // on today's challenge, a badge under the menu button says so
    if (current && current === dslug) {
      const badge = document.createElement("span"); badge.className = "dailyBadge"; badge.id = "dailyBadge";
      const set = () => { const done = dailyDoneToday(), k = dailyStreak(); badge.textContent = done ? `Today's challenge: solved!${k > 1 ? ` ${k}-day streak!` : ""}` : current === "pawlette" ? "Today's challenge: can you clear 3 lines in Swipe?" : "Today's challenge: can you solve one?"; badge.classList.toggle("done", done); };
      set(); badge.refresh = set; el.append(badge);
    }
  }


  function load(key) { try { return JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { return {}; } }
  function save(key, data) { try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {} }

  // Build puzzles off the main thread. `fns` are plain functions; `entry` is the one to call with the size.
  function builder(fns, entry) {
    let worker = null, id = 0;
    const pending = new Map();
    try {
      const src = fns.map(f => f.toString()).join("\n") +
        `\nonmessage = e => postMessage({id: e.data.id, p: ${entry}(e.data.n)});`;
      worker = new Worker(URL.createObjectURL(new Blob([src], {type: "text/javascript"})));
      worker.onmessage = e => { const r = pending.get(e.data.id); pending.delete(e.data.id); r && r.res(e.data.p); };
      // If the worker can't run (some pages block them), build waiting puzzles here instead of hanging.
      worker.onerror = () => {
        worker = null;
        for (const {res, n} of pending.values()) setTimeout(() => res(self[entry](n)), 0);
        pending.clear();
      };
    } catch (e) { worker = null; }
    const make = self[entry];
    const generate = n => new Promise(res => {
      if (worker) { const k = ++id; pending.set(k, {res, n}); worker.postMessage({id: k, n}); }
      else setTimeout(() => res(make(n)), 30);
    }).then(p => p || generate(n));
    let spare = null;
    return {
      take(n) { const p = spare && spare.n === n ? spare.p : generate(n); spare = null; return p; },
      prefetch(n) { if (!spare || spare.n !== n) spare = {n, p: generate(n)}; },
    };
  }

  function openCard(title, text, btns, media, after) {
    const card = $("card"); card.innerHTML = "";
    const h = document.createElement("h2"); h.textContent = title; card.append(h);
    const s = document.createElement("div"); s.className = "stripe"; card.append(s);
    if (text) { const p = document.createElement("p"); p.textContent = text; card.append(p); }
    if (media) card.append(media);
    const row = document.createElement("div"); row.className = "btns";
    for (const [label, fn, primary] of btns) {
      const b = document.createElement("button"); b.textContent = label; if (primary) b.className = "primary";
      b.onclick = fn; row.append(b);
    }
    card.append(row); if (after) card.append(after);
    $("overlay").classList.add("show");
    const first = row.querySelector("button"); if (first) first.focus();
  }
  function closeCard() { $("overlay").classList.remove("show"); }

  // Moving up: after a clean win the next puzzle is one size bigger, up to the largest the page's size
  // list offers. The finishing cards also offer every other size, so players can always choose.
  const sizeUp = (N, sel) => Math.min(Math.max(...[...sel.options].map(o => +o.value)), N + 1);
  function otherSize(sel, current, choose, text = "Or play a different size:") {
    const wrap = document.createElement("label"); wrap.className = "pick";
    const pick = document.createElement("select"); pick.setAttribute("aria-label", text);
    for (const o of sel.options) { const c = new Option(o.textContent, o.value); c.selected = +o.value === current; pick.append(c); }
    pick.onchange = () => { closeCard(); choose(+pick.value); };
    wrap.append(text, pick);
    return wrap;
  }

  const NAMES = ["Biscuit", "Mochi", "Pickles", "Noodle", "Sprocket", "Whiskerdoodle", "Pounce", "Kerfuffle",
    "Sir Pounce-a-Lot", "Lady Marmalade", "Duke Fluffington", "Captain Mittens", "Professor Paws", "Count Catula",
    "Juniper", "Clover", "Figaro", "Atticus", "Ophelia", "Purrlock Holmes", "Chairman Meow", "Cleocatra",
    "Pablo Picatso", "Meowzart", "Catrick Swayze", "Frida Catlo", "Paw Revere", "Dolly Purrton", "Luna", "Otis", "Patches",
    // every name from T. S. Eliot's "The Naming of Cats"
    "Peter", "Augustus", "Alonzo", "James", "Victor", "Jonathan", "George", "Bill Bailey", "Plato", "Admetus", "Electra", "Demeter",
    "Munkustrap", "Quaxo", "Coricopat", "Bombalurina", "Jellylorum"];
  const bust = () => "t=" + Date.now();
  function catPhoto() {
    const img = document.createElement("img"), backup = "https://cataas.com/cat?width=500&" + bust();
    img.className = "catpic"; img.alt = "A random cat";
    img.onerror = () => { if (img.src !== backup) img.src = backup; else img.remove(); };
    const ctl = new AbortController(); setTimeout(() => ctl.abort(), 5000);
    fetch("https://api.thecatapi.com/v1/images/search", {signal: ctl.signal})
      .then(r => r.json()).then(d => { img.src = d[0].url; }).catch(() => { img.src = backup; });
    return img;
  }
  // "Solved!" card: message, cat photo, cat name, then the next-puzzle button and a button
  // that closes the card to leave the finished board on screen. `o` can change the title and
  // next button and add something below the buttons (`after`); passing admire as null leaves out
  // the admire button. Last comes a way back to the front page.
  // After admiring, point to the page's own new-puzzle button (New floor, New table…), or the level list.
  const admireNote = () => $("newBtn") ? `Done! Tap ${$("newBtn").textContent.trim()} when you're ready for another.` : "Done! Pick a level when you're ready for another.";
  // A perfect clear (no help, nothing lost, no undo) earns a gold paw: o.gold puts one on the win card,
  // with o.goldWhy saying what earned it, o.goldTitle in place of "Gold paw!", and o.goldPic (a picture
  // and its caption) in place of the random cat photo and name.
  const PAW = "M100 6 C126 6 141 28 153 46 C172 50 197 70 195 101 C193 133 166 147 140 141 C125 138 112 131 100 131 C88 131 75 138 60 141 C34 147 7 133 5 101 C3 70 28 50 47 46 C59 28 74 6 100 6Z";
  function goldPaw() {
    const box = document.createElement("div");
    box.innerHTML = `<svg class="goldpaw" viewBox="-3 -3 106 92" aria-hidden="true"><g fill="#E0A526" stroke="#2A2530" stroke-width="2.5">
      ${[[16.5, 30.5, -24], [38.5, 15, -8], [61.5, 15, 8], [83.5, 30.5, 24]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="9.5" ry="10.75" transform="rotate(${r} ${x} ${y})" vector-effect="non-scaling-stroke"/>`).join("")}
      <path d="${PAW}" transform="translate(19 35.3) scale(.31 .298)" vector-effect="non-scaling-stroke"/></g></svg>`;
    return box.firstChild;
  }
  // The win cards' way out to every game.
  const homeBtn = () => ["Back to the front page", () => { location.href = HOME; }];
  function winCard(text, onNext, admire = "Admire my board", result, o = {}) {
    const media = document.createElement("div");
    // what earned the gold paw ("No undos!"), under the paw
    if (o.gold) { media.append(goldPaw()); if (o.goldWhy) { const g = document.createElement("p"); g.className = "goldwhy"; g.textContent = o.goldWhy; media.append(g); } }
    const p = document.createElement("p"); p.textContent = text;
    const name = document.createElement("p"); name.className = "catname";
    name.textContent = `Meet ${NAMES[Math.floor(Math.random() * NAMES.length)]}!`;
    const tl = timeLineEl(result); if (tl) media.append(tl);
    media.append(p);
    const dl = dailyLine();
    if (dl) { const d = document.createElement("p"); d.className = "dailyline"; d.textContent = dl; media.append(d); }
    if (o.gold && o.goldPic) media.append(...o.goldPic); else media.append(catPhoto(), name);
    const btns = [[o.next || "New puzzle", onNext, true]];
    if (admire !== null) btns.push([admire, () => { closeCard(); note(admireNote(), 0); }]);
    btns.push(["Share my result", e => shareResult(result, o.gold, e.currentTarget)], homeBtn());
    openCard(o.gold ? o.goldTitle || "Gold paw!" : o.title || "Solved!", "", btns, media, o.after);
  }

  // Count a moment in the game (a puzzle started or solved) on the GoatCounter dashboard.
  // Nothing about the player is sent. Waits a few seconds for the counter script to load.
  function track(name) {
    let tries = 0;
    (function send() {
      const gc = window.goatcounter;
      if (gc && gc.count) gc.count({path: name, title: name, event: true});
      else if (tries++ < 20) setTimeout(send, 500);
    })();
  }


  /* ---------- timer and personal best times ---------- */
  // Times and bests stay on this device. The clock starts on the first move, runs only
  // while the page is showing with no card over the board, and stops when the puzzle is solved.
  const BESTS = "catdoku.bests.v1", PREFS = "catdoku.prefs.v1", KEEP = 10;
  const clock = ms => {
    const s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, ss = String(s % 60).padStart(2, "0");
    return h ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
  };
  const style = document.createElement("style");
  style.textContent = `
    .timer{background:none;border:none;border-radius:8px;padding:0 6px;font:inherit;font-weight:600;color:var(--ink-soft);font-variant-numeric:tabular-nums;cursor:pointer;white-space:nowrap}
    .timer:hover{background:none;color:var(--ink)}
    .card .goldpaw{width:84px;height:84px;margin:0 auto 10px;display:block}
    .card p.goldwhy{margin:-4px 0 12px;font-weight:800;color:#B07A10}
    .card .timeline{font-weight:800;color:var(--ink);margin:0 0 12px}
    .bests{width:100%;border-collapse:collapse;margin:0 0 14px;font-variant-numeric:tabular-nums;color:var(--ink)}
    .bests th,.bests td{padding:4px 6px;text-align:left;border-bottom:1px solid var(--line)}
    .bests th{font-size:13px;color:var(--ink-soft);font-weight:600}
    .bests td.num,.bests th.num{text-align:right}
    .bests tr.now td{font-weight:800}
    .card h3{margin:4px 0 6px;font-size:18px}
    .spot{position:fixed;inset:0;z-index:9;cursor:pointer;animation:spotIn .35s ease-out;-webkit-tap-highlight-color:transparent;touch-action:none}
    .spot:focus{outline:none}
    .spot svg{position:absolute;inset:0;display:block}
    .spot .dim{fill:rgba(42,37,48,.66)}
    .spot .edge{fill:none;stroke:#E23B3B;stroke-linecap:round}
    .spot .edge.ok{stroke:#4FB35F}
    .spot .arrowLine{fill:none;stroke:#FFF4D2;stroke-linecap:round}
    .spot .arrowLine.back{stroke:var(--ink)}
    .spot .arrowHead{fill:#FFF4D2;stroke:var(--ink);stroke-linejoin:round;paint-order:stroke fill}
    .spot .say{position:absolute;left:4%;right:4%;display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;pointer-events:none}
    .spot .say b{font-size:clamp(24px,7vw,36px);font-weight:800;line-height:1.1;color:#FFF4D2;-webkit-text-stroke:6px var(--ink);paint-order:stroke fill;text-wrap:balance}
    .spot .say small{font-size:15px;font-weight:600;color:#FFF4D2;-webkit-text-stroke:3px var(--ink);paint-order:stroke fill;opacity:.9;animation:spotTap 1.6s ease-in-out infinite}
    .spot .say b .w{white-space:nowrap}
    .spot .say b .emo img{display:inline-block;width:1.15em;height:1.15em;vertical-align:-.2em}
    .spot .say b .emo{-webkit-text-stroke:0;display:inline-block;background:#FFF4D2;border:3px solid var(--ink);border-radius:999px;padding:0 .12em;margin:0 .04em;line-height:1.15;font-size:.85em;vertical-align:.06em}
    .spotGo{position:absolute;inset:0;z-index:5;display:flex;align-items:center;justify-content:center;pointer-events:none;animation:spotGo 1.3s ease-out forwards}
    .spotGo b{font-size:clamp(34px,10vw,52px);font-weight:800;color:#FFF4D2;-webkit-text-stroke:7px var(--ink);paint-order:stroke fill}
    @keyframes spotGo{0%{opacity:0;transform:scale(.7)}18%{opacity:1;transform:scale(1.06)}30%{transform:scale(1)}70%{opacity:1}100%{opacity:0;transform:scale(1.08)}}
    @keyframes spotIn{from{opacity:0}}
    @keyframes spotTap{50%{opacity:.45}}
    @media (prefers-reduced-motion:reduce){.spot,.spot .say small{animation:none}.spotGo{animation:spotGoFade 1.3s forwards}@keyframes spotGoFade{70%{opacity:1}100%{opacity:0}}}`;
  document.head.append(style);

  // {name, game(), playing(game), save(), and optionally label(n) and noun for what bests are kept by,
  //  and emptyText for the Best times card before anything is finished}
  let T = null;
  const label = n => T.label ? T.label(n) : `${n} × ${n}`, noun = () => T.noun || "size";
  function setupTimer(opts) {
    T = opts;
    const board = $("board"), start = () => { const g = T.game(); if (g && g.timed && T.playing(g) && !$("overlay").classList.contains("show")) g.started = true; };
    board.addEventListener("pointerdown", start, true);
    board.addEventListener("keydown", start, true);
    const btn = $("timer");
    btn.onclick = () => { const p = load(PREFS); p.hideTimer = !p.hideTimer; save(PREFS, p); showTime(); };
    let last = Date.now();
    setInterval(() => {
      const now = Date.now(), g = T.game(), dt = Math.min(now - last, 1500); last = now;
      if (g && g.timed && g.started && T.playing(g) && !document.hidden && !$("overlay").classList.contains("show") && !document.querySelector(".spot")) g.ms = (g.ms || 0) + dt;
      showTime();
    }, 500);
    document.addEventListener("visibilitychange", () => { if (document.hidden) T.save(); });
    showTime();
  }
  function showTime() {
    const g = T && T.game(), btn = $("timer"); if (!btn) return;
    if (!g || !g.timed) { btn.textContent = ""; btn.hidden = true; return; }
    btn.hidden = false;
    const hide = load(PREFS).hideTimer;
    btn.textContent = hide ? "⏱ –:––" : "⏱ " + clock(g.ms || 0);
    btn.setAttribute("aria-label", hide ? "Timer hidden. Tap to show the time." : `Time ${clock(g.ms || 0)}. Tap to hide the time.`);
  }
  // Fields a new puzzle starts with.
  const freshClock = () => ({ms: 0, timed: true, started: false});
  // A puzzle saved before the timer existed can't set a best time.
  function checkClock(g) { if (g && g.timed === undefined) g.timed = false; }

  // Call once when a puzzle is solved: records the time and returns what the card shows.
  function finishClock(g) {
    dailyWon();
    const n = g.level ?? g.N;   // bests are kept by level where a game has levels, else by size
    if (!g.timed) return (g.result = {ms: null, n});
    const all = load(BESTS), mine = (all[T.name] = all[T.name] || {}), row = (mine[n] = mine[n] || {solves: 0, times: []});
    const before = row.times.length ? row.times[0].ms : null;
    row.solves++;
    row.times.push({ms: g.ms, d: new Date().toISOString().slice(0, 10)});
    row.times.sort((a, b) => a.ms - b.ms); row.times = row.times.slice(0, KEEP);
    save(BESTS, all);
    return (g.result = {ms: g.ms, n, best: before, isBest: before === null || g.ms < before});
  }
  function timeLine(r) {
    if (!r || r.ms == null) return "";
    if (r.isBest && r.best !== null) return `Time ${clock(r.ms)}. New personal best! (was ${clock(r.best)})`;
    if (r.isBest) return `Time ${clock(r.ms)}. Your first time at this ${noun()}.`;
    return `Time ${clock(r.ms)}. Your best is ${clock(r.best)}.`;
  }
  function timeLineEl(r) { const t = timeLine(r); if (!t) return null; const p = document.createElement("p"); p.className = "timeline"; p.textContent = t; return p; }

  // The "Best times" card: every size played, then the top times at the current size.
  function showBests(title, N) {
    const mine = load(BESTS)[T.name] || {}, sizes = Object.keys(mine).map(Number).sort((a, b) => a - b);
    const media = document.createElement("div");
    if (!sizes.length) {
      const p = document.createElement("p"); p.textContent = T.emptyText || "Solve a puzzle and your times will show up here. They're kept on this device only."; media.append(p);
    } else {
      const t = document.createElement("table"); t.className = "bests";
      t.innerHTML = `<tr><th>${noun()[0].toUpperCase() + noun().slice(1)}</th><th class="num">Best</th><th class="num">Solved</th></tr>`;
      for (const n of sizes) {
        const r = t.insertRow(); if (n === N) r.className = "now";
        r.insertCell().textContent = label(n);
        const b = r.insertCell(); b.className = "num"; b.textContent = mine[n].times.length ? clock(mine[n].times[0].ms) : "–";
        const c = r.insertCell(); c.className = "num"; c.textContent = mine[n].solves;
      }
      media.append(t);
      const top = (mine[N] || {times: []}).times;
      if (top.length) {
        const h = document.createElement("h3"); h.textContent = `Fastest at ${label(N)}`; media.append(h);
        const t2 = document.createElement("table"); t2.className = "bests";
        top.forEach((x, i) => { const r = t2.insertRow(); r.insertCell().textContent = `${i + 1}.`; const c = r.insertCell(); c.className = "num"; c.textContent = clock(x.ms); r.insertCell().textContent = x.d; });
        media.append(t2);
      }
      const p = document.createElement("p"); p.textContent = "Times are kept on this device only."; media.append(p);
    }
    openCard(title, "", [["Close", closeCard, true]], media);
  }


  /* ---------- sharing a puzzle by link ---------- */
  // The whole puzzle (and, if wanted, the moves so far) is packed into the link after "#share=",
  // so no server is involved and nothing about the player is included.
  const toB64 = str => btoa(unescape(encodeURIComponent(str))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const fromB64 = str => decodeURIComponent(escape(atob(str.replace(/-/g, "+").replace(/_/g, "/"))));
  const shareUrl = data => location.origin + location.pathname + "#share=" + toB64(JSON.stringify(data));

  // A share link this page was opened with, or null. The link is then tidied off the address.
  function readShare(slug) {
    const m = location.hash.match(/^#share=([\w-]+)/);
    if (!m) return null;
    history.replaceState(null, "", location.pathname + location.search);
    try { const d = JSON.parse(fromB64(m[1])); if (d && d.g === slug && d.N) return d; } catch (e) {}
    setTimeout(() => note("That share link didn't work. It may have been cut off.", 6000), 0);
    return null;
  }
  // Open a shared puzzle, checking first if it would replace a puzzle in progress.
  function offerShare(d, o) {
    const go = () => {
      closeCard(); o.open(d); track(`${o.name} shared puzzle opened`);
      note(d.p ? "Here's the shared puzzle, with its progress so far. It isn't timed." : "Here's the shared puzzle. Good luck!", 6000);
      if (o.after) o.after();
    };
    if (o.inProgress) openCard("Open the shared puzzle?", "Your puzzle in progress will be replaced.", [["Open it", go, true], ["Keep mine", closeCard]]);
    else go();
  }
  // Send text and a link: the share sheet, else the clipboard, else a box to copy from by hand.
  // o.btn: the button that was pressed, which says what happened ("Copied!") and keeps the card that's up
  // (the win card) open; without it, the card closes and the note line says so.
  async function sendLink(title, text, url, o = {}) {
    const all = text + " " + url;
    const done = msg => {
      if (!o.btn) { closeCard(); if (msg) note(msg, 5000); return; }
      if (!msg) return;
      const was = o.btn.dataset.label || o.btn.textContent; o.btn.dataset.label = was;
      o.btn.textContent = msg; setTimeout(() => { o.btn.textContent = was; }, 2500);
    };
    if (navigator.share) {
      // One piece of text with the link at the end: given text and a link separately, Messages on an
      // iPhone keeps only the link (or a preview card of it) and the text is lost.
      try { await navigator.share({text: text + "\n" + url}); done(); return; }
      catch (e) { if (e.name === "AbortError") return; }
    }
    try { await navigator.clipboard.writeText(all); done(o.btn ? "Copied! Paste it into a message." : "Copied. Paste it into a message."); return; } catch (e) {}
    // No share sheet and no clipboard: a box to copy from, under the button (or on a card of its own)
    const box = document.createElement("textarea"); box.value = all; box.readOnly = true; box.rows = 3;
    box.style.cssText = "width:100%;font:inherit;font-size:13px;margin:0;border:2px solid var(--line);border-radius:8px;padding:6px";
    if (o.btn) { if (!o.btn.nextElementSibling || o.btn.nextElementSibling.tagName !== "TEXTAREA") o.btn.after(box); else o.btn.nextElementSibling.select(); }
    else openCard("Copy this", "Select it and copy it into a message.", [["Done", closeCard, true]], box);
    box.focus(); box.select();
  }
  // A finished puzzle's result to share: the game, level or size, time, and gold paw, with a link to the game.
  function shareResult(r, gold, btn) {
    const name = document.querySelector("header h1").textContent, bits = [name];
    if (r && r.n != null && T) bits.push(label(r.n));
    if (r && r.ms != null && !load(PREFS).hideTimer) bits.push("⏱ " + clock(r.ms));
    if (gold) bits.push("Gold paw 🐾");
    track(`${name} result shared`);
    sendLink(name, bits.join(" · "), location.origin + location.pathname, {btn});
  }
  // The Share card: a fresh copy of the puzzle, or the puzzle with the moves so far (when o.progress is given;
  // a game played against the clock, like Pounce, shares only the fresh level).
  function shareCard(o) {
    const send = (data, what) => {
      track(`${o.name} shared${what ? " " + what : ""}`);
      const text = !data.p ? `Try this ${o.name} ${o.what || "puzzle"}!` : o.won ? `Here's my finished ${o.name} puzzle!` : `Can you help me with this ${o.name} puzzle?`;
      sendLink(o.name, text, shareUrl(data));
    };
    const won = o.won;
    const what = o.what || "puzzle";
    openCard(`Share this ${what}`, `Send a link so someone else can play this exact ${what}.`, [
      [`Share this ${what}`, () => send(o.puzzle(), ""), true],
      ...(o.progress ? [[won ? "Share my solved board" : "Share with my progress", () => send(Object.assign(o.puzzle(), {p: o.progress()}), "with progress")]] : []),
      ["Cancel", closeCard],
    ]);
  }

  /* ---------- choosing toys ---------- */
  // The toy pictures a game uses, in colour order (each colour is one kind of toy). Tap one to leave it
  // out. o: {kinds (each {looks: [[picture, name]…]}), off (picture names left out), min (colours that
  // must keep a picture), src(picture) for its address, save(off)}.
  // o.why, when given, says what the game needs (shown when the toys picked aren't enough for it).
  function toyPicker(o) {
    const off = new Set(o.off), media = document.createElement("div"), grid = document.createElement("div");
    const tip = document.createElement("p"); tip.className = "tip"; tip.textContent = o.why || "Tap a toy to leave it out.";
    grid.className = "toypick";
    for (const k of o.kinds) for (const [f, name] of k.looks) {
      const b = document.createElement("button"), img = document.createElement("img");
      img.src = o.src(f); img.alt = "";
      b.append(img); b.title = name[0].toUpperCase() + name.slice(1);
      b.setAttribute("aria-label", b.title); b.setAttribute("aria-pressed", String(!off.has(f)));
      b.onclick = () => { off.has(f) ? off.delete(f) : off.add(f); b.setAttribute("aria-pressed", String(!off.has(f))); check(); };
      grid.append(b);
    }
    const count = document.createElement("p"); count.className = "pickNote"; count.setAttribute("aria-live", "polite");
    media.append(tip, grid, count);
    openCard("Toy chest", "", [["Save", () => { closeCard(); o.save(off); }, true], ["Cancel", closeCard]], media);
    const save = $("card").querySelector(".btns button");
    function check() {
      const n = o.kinds.filter(k => k.looks.some(([f]) => !off.has(f))).length, short = n < o.min;
      save.disabled = short; count.classList.toggle("bad", short);
      count.textContent = short ? `Keep toys in at least ${o.min} colours (${n} now).` : `${n} of ${o.kinds.length} colours in play.`;
    }
    check();
  }
  // The toys left out are one choice for every game. Each game used to keep its own: the first
  // game opened since then brings its choice along. legacy: that game's old storage key.
  const TOYS = "catdoku.toys.v1";
  function toysOff(legacy) {
    let s = load(TOYS);
    if (!Array.isArray(s.off)) { s = {off: (legacy && load(legacy).off) || []}; save(TOYS, s); }
    return new Set(s.off);
  }
  function saveToys(off) { save(TOYS, {off: [...off]}); }
  // Colours that still have a toy in play.
  const toyColours = (kinds, off) => kinds.filter(k => k.looks.some(([f]) => !off.has(f))).length;
  // A game needing toys in more colours than are picked opens the toy chest, saying what it needs,
  // once nothing else (a walkthrough or a card) is up. o: as toyPicker, plus game (its name).
  function needToys(o, tries = 0) {
    if (!tries) { setTimeout(() => needToys(o, 1), 1200); return; }  // give a first-visit walkthrough time to start
    const n = toyColours(o.kinds, o.off());
    if (n >= o.min) return;
    if (document.querySelector(".spot") || $("overlay").classList.contains("show")) { if (tries < 200) setTimeout(() => needToys(o, tries + 1), 1500); return; }
    toyPicker({...o, off: o.off(), why: `${o.game} needs toys in at least ${o.min} colours. You have ${n}, so put some back in.`});
  }
  // Which of a kind's pictures to show, picked from those not left out (any, if all are).
  function pickLook(k, off) {
    const ok = k.looks.map((_, j) => j).filter(j => !off.has(k.looks[j][0])), from = ok.length ? ok : k.looks.map((_, j) => j);
    return from[Math.floor(Math.random() * from.length)];
  }

  /* ---------- first-time spotlight ---------- */
  // Teach a game on its own board: each step dims the whole screen except some squares (and, if it
  // names them, other things on the page such as a key above the board), outlines them in red, can
  // put marks on squares (a 🐱, ❌…, or a picture's file; a list of marks takes turns), and says one line over the board.
  // A tap or Space shows the next step; after the last, "Let's Play!" shows and `done` runs.
  // `pics` ({"🐱": "file.webp"}) shows a picture in place of that emoji in what the steps say.
  // `grid` is the element the squares fill, `w` × `h` squares; each step is
  // {say, lit: [[x, y]…], outline (default: lit), tone ("ok" outlines green, not red), marks: [[x, y, mark, size]…],
  // arrows: [{to: [x, y] (a corner between squares), from: [dx, dy] (the way the arrow comes in), size}],
  // els: [element, [elements] or a function returning either…], lines: [{edges: [[x1, y1, x2, y2]…], tone}], enter() and leave() to show
  // something on the board just while the step is up}.
  // shapes: [{poly}|{path, width}|{arrow, from}] in page pixels, or a function returning them (see show).
  // map: () => ({ox, oy, cw, ch}) in page pixels, when the squares don't simply fill `grid`.
  // finish: false leaves out "Let's Play!" (for a one-off tip in the middle of a game).
  // It covers the screen, so taps on it never reach the game (or start its timer), and the timer waits.
  function spotlight(o) {
    const wrap = o.grid.parentElement, layer = document.createElement("div"), ns = "http://www.w3.org/2000/svg";
    layer.className = "spot"; layer.tabIndex = 0; layer.setAttribute("role", "dialog"); layer.setAttribute("aria-live", "polite");
    document.body.append(layer);
    let k = -1, frame = 0, ticker = null;
    const svgEl = (t, a) => { const e = document.createElementNS(ns, t); for (const n in a) e.setAttribute(n, a[n]); return e; };
    // Bring the board (and anything else the steps light) into view first.
    {
      const tops = [wrap, ...o.steps.flatMap(st => (st.els || []).map(e => typeof e === "function" ? e() : e).flat())].map(e => e.getBoundingClientRect());
      const top = Math.min(...tops.map(r => r.top)), bottom = Math.max(...tops.map(r => r.bottom));
      if (top < 0 || bottom > innerHeight) scrollBy(0, bottom - top < innerHeight ? (top + bottom - innerHeight) / 2 : top - 8);
    }
    function show() {
      const st = o.steps[k], g = o.grid.getBoundingClientRect(), b = wrap.getBoundingClientRect(), W = innerWidth, H = innerHeight;
      // where the squares are: worked out from the grid element, or given by the game (o.map) when its
      // squares don't fill the element (a margin round the mat, zoom…)
      const m = o.map ? o.map() : {ox: g.left + o.grid.clientLeft, oy: g.top + o.grid.clientTop, cw: o.grid.clientWidth / o.w, ch: o.grid.clientHeight / o.h};
      const {cw, ch, ox, oy} = m;
      const X = x => ox + x * cw, Y = y => oy + y * ch, lit = st.lit || [];
      // each thing to light is an element, or a list of elements lit together as one box
      const els = (st.els || []).map(e => {
        if (typeof e === "function") e = e();   // for things the game redraws while the step is up
        const rs = (Array.isArray(e) ? e : [e]).map(x => x.getBoundingClientRect()), p = 5;
        const l = Math.min(...rs.map(r => r.left)), t = Math.min(...rs.map(r => r.top)), r = Math.max(...rs.map(r => r.right)), btm = Math.max(...rs.map(r => r.bottom));
        return {x: l - p, y: t - p, w: r - l + 2 * p, h: btm - t + 2 * p};
      });
      layer.innerHTML = "";
      const svg = svgEl("svg", {viewBox: `0 0 ${W} ${H}`, width: W, height: H, "aria-hidden": "true"});
      // Shapes in page pixels (for boards that aren't squares): {poly: [[x, y]…]} is lit and outlined,
      // {path: [[x, y]…], width} is a lit band along a line (a track), {arrow: [x, y], from: [dx, dy]}.
      const shapes = (typeof st.shapes === "function" ? st.shapes() : st.shapes) || [];
      // everything dims except the holes cut in a mask
      const mask = svgEl("mask", {id: "spotMask", maskUnits: "userSpaceOnUse", x: 0, y: 0, width: W, height: H});
      mask.append(svgEl("rect", {x: 0, y: 0, width: W, height: H, fill: "#fff"}));
      for (const [x, y] of lit) mask.append(svgEl("rect", {x: X(x) - 0.5, y: Y(y) - 0.5, width: cw + 1, height: ch + 1, fill: "#000"}));
      for (const r of els) mask.append(svgEl("rect", {x: r.x, y: r.y, width: r.w, height: r.h, rx: 6, fill: "#000"}));
      const ptsOf = pts => pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join("");
      for (const sh of shapes) {
        if (sh.poly) mask.append(svgEl("path", {d: ptsOf(sh.poly) + "Z", fill: "#000"}));
        if (sh.path) mask.append(svgEl("path", {d: ptsOf(sh.path) + (sh.closed ? "Z" : ""), fill: "none", stroke: "#000", "stroke-width": sh.width, "stroke-linejoin": "round", "stroke-linecap": "round"}));
      }
      const defs = svgEl("defs", {}); defs.append(mask); svg.append(defs);
      svg.append(svgEl("rect", {x: 0, y: 0, width: W, height: H, class: "dim", mask: "url(#spotMask)"}));
      const sw = Math.max(3, cw * 0.07);
      for (const group of st.outline || [lit]) {   // red lines where the outlined squares meet the rest
        const set = new Set(group.map(([x, y]) => y * o.w + x)), has = (x, y) => x >= 0 && y >= 0 && x < o.w && y < o.h && set.has(y * o.w + x);
        let e = "";
        for (const [x, y] of group) {
          if (!has(x, y - 1)) e += `M${X(x)} ${Y(y)}H${X(x + 1)}`;
          if (!has(x, y + 1)) e += `M${X(x)} ${Y(y + 1)}H${X(x + 1)}`;
          if (!has(x - 1, y)) e += `M${X(x)} ${Y(y)}V${Y(y + 1)}`;
          if (!has(x + 1, y)) e += `M${X(x + 1)} ${Y(y)}V${Y(y + 1)}`;
        }
        svg.append(svgEl("path", {d: e, class: "edge" + (st.tone === "ok" ? " ok" : ""), "stroke-width": sw}));
      }
      // outlines round page elements and shapes keep one thickness (the squares' depends on their size)
      for (const r of els) svg.append(svgEl("rect", {x: r.x, y: r.y, width: r.w, height: r.h, rx: 6, class: "edge", "stroke-width": 3.5}));
      for (const ln of st.lines || []) {   // lines along chosen square edges, [x1, y1, x2, y2] in squares
        const e = ln.edges.map(([x1, y1, x2, y2]) => `M${X(x1)} ${Y(y1)}L${X(x2)} ${Y(y2)}`).join("");
        svg.append(svgEl("path", {d: e, class: "edge" + (ln.tone === "ok" ? " ok" : ""), "stroke-width": sw * 1.4}));
      }
      for (const [x, y, m, size] of st.marks || []) {   // x, y can fall between squares; size is in squares
        const v = Array.isArray(m) ? m[frame % m.length] : m;
        if (/\.(webp|png|svg)$/.test(v)) {   // a picture, such as Catdoku's Higgins
          const d = cw * (size || 0.72);
          svg.append(svgEl("image", {href: v, x: X(x + 0.5) - d / 2, y: Y(y + 0.5) - d / 2, width: d, height: d}));
          continue;
        }
        const t = svgEl("text", {x: X(x + 0.5), y: Y(y + 0.56), "text-anchor": "middle", "dominant-baseline": "middle",
          "font-size": cw * (size || (v === "❌" ? 0.42 : 0.56))});
        t.textContent = v; svg.append(t);
      }
      // a bold arrow with its tip at (ax, ay), coming in from direction (dx, dy); size is a square's width
      const arrow = (ax, ay, dx, dy, size) => {
        const n = Math.hypot(dx, dy), ux = dx / n, uy = dy / n, tx = ax + ux * 3, ty = ay + uy * 3, len = Math.max(34, size * 0.95), hd = Math.max(13, size * 0.32);
        const tail = [tx + ux * len, ty + uy * len], base = [tx + ux * hd, ty + uy * hd], px = -uy * hd * 0.62, py = ux * hd * 0.62;
        const shaft = `M${tail[0]} ${tail[1]}L${base[0]} ${base[1]}`, head = `M${tx} ${ty}L${base[0] + px} ${base[1] + py}L${base[0] - px} ${base[1] - py}Z`;
        for (const [cls, w] of [["arrowLine back", Math.max(10, size * 0.2)], ["arrowLine", Math.max(5, size * 0.1)]]) svg.append(svgEl("path", {d: shaft, class: cls, "stroke-width": w}));
        svg.append(svgEl("path", {d: head, class: "arrowHead", "stroke-width": Math.max(3, size * 0.06)}));
      };
      for (const {to: [gx, gy], from: [dx, dy], size} of st.arrows || []) arrow(X(gx), Y(gy), dx, dy, (size || 1) * cw);   // pointing at a point between squares; size in squares
      for (const sh of shapes) {
        if (sh.poly) svg.append(svgEl("path", {d: ptsOf(sh.poly) + "Z", class: "edge" + (st.tone === "ok" ? " ok" : ""), "stroke-width": 3.5, "stroke-linejoin": "round"}));
        if (sh.arrow) arrow(sh.arrow[0], sh.arrow[1], sh.from[0], sh.from[1], sh.size || 40);
      }
      layer.append(svg);
      const say = document.createElement("div"); say.className = "say";
      say.style.left = `${b.left + b.width * 0.04}px`; say.style.width = `${b.width * 0.92}px`;
      const bw = document.createElement("b"); sayWith(bw, st.say);
      const tap = document.createElement("small"); tap.textContent = "Tap to go on";
      say.append(bw, tap); layer.append(say);
      // The words go over the board where they cover the least of the lit squares (and, among those,
      // nearest the middle), so they never sit on what the step is pointing at if they can help it.
      const sh = say.offsetHeight, l = say.offsetLeft, r = l + say.offsetWidth;
      // things to keep clear of: the lit squares and page elements, and any arrows
      const keep = lit.map(([x, y]) => [X(x), Y(y), X(x + 1), Y(y + 1)]);
      for (const r of els) keep.push([r.x, r.y, r.x + r.w, r.y + r.h]);
      const arrowBox = (ax, ay, dx, dy, size) => {
        const n = Math.hypot(dx, dy), len = Math.max(34, size * 0.95) + 8, bx = ax + dx / n * len, by = ay + dy / n * len;
        keep.push([Math.min(ax, bx) - 8, Math.min(ay, by) - 8, Math.max(ax, bx) + 8, Math.max(ay, by) + 8]);
      };
      for (const {to: [gx, gy], from: [dx, dy], size} of st.arrows || []) arrowBox(X(gx), Y(gy), dx, dy, (size || 1) * cw);
      for (const sh of shapes) {
        if (sh.arrow) arrowBox(sh.arrow[0], sh.arrow[1], sh.from[0], sh.from[1], sh.size || 40);
        if (sh.poly) { const xs = sh.poly.map(p => p[0]), ys = sh.poly.map(p => p[1]); keep.push([Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]); }
        // a band along a line counts only lightly: words may cross a track, but not sit on what's lit
        if (sh.path) for (let i = 0; i < sh.path.length; i += 4) { const [x, y] = sh.path[i]; keep.push([x - sh.width / 2, y - sh.width / 2, x + sh.width / 2, y + sh.width / 2, 0.02]); }
      }
      let best = b.top + b.height / 2 - sh / 2, bestCost = Infinity;
      for (let t = b.top + 4; t <= b.bottom - sh - 4; t += 4) {
        let cover = 0;
        for (const [x1, y1, x2, y2, weight = 1] of keep) {
          const w = Math.min(r, x2) - Math.max(l, x1), h = Math.min(t + sh, y2) - Math.max(t, y1);
          if (w > 0 && h > 0) cover += w * h * weight;
        }
        const cost = cover * 1000 + Math.abs(t + sh / 2 - (b.top + b.height / 2));
        if (cost < bestCost) { bestCost = cost; best = t; }
      }
      say.style.top = `${best}px`;
      layer.setAttribute("aria-label", `${st.say}. ${tap.textContent}.`);
    }
    // Emoji in the words keep their own colours (no outline) on a pale chip, and never start a line
    // on their own: each sticks to the word before it.
    function sayWith(el, text) {
      for (const part of text.split(" ")) {
        const w = document.createElement("span"); w.className = "w";
        for (const bit of part.split(/(\p{Extended_Pictographic}(?:\uFE0F)?)/u)) {
          if (!bit) continue;
          if (/\p{Extended_Pictographic}/u.test(bit)) {
            const e = document.createElement("span"); e.className = "emo";
            if (o.pics && o.pics[bit]) { const im = document.createElement("img"); im.src = o.pics[bit]; im.alt = bit; e.append(im); }   // a picture in place of this emoji
            else e.textContent = bit;
            w.append(e);
          }
          else w.append(bit);
        }
        if (el.childNodes.length) {
          const prev = el.lastChild;   // an emoji word sticks to the word before it
          if (/^\p{Extended_Pictographic}/u.test(part)) { prev.append(" ", ...w.childNodes); continue; }
          el.append(" ");
        }
        el.append(w);
      }
    }
    const redraw = () => k >= 0 && k < o.steps.length && show();
    function next(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      const was = o.steps[k]; if (was && was.leave) was.leave();
      if (++k >= o.steps.length) {   // all done: "Let's Play!" shows over the board and fades by itself
        clearInterval(ticker); removeEventListener("resize", redraw); removeEventListener("scroll", redraw); layer.remove(); if (o.done) o.done();
        if (o.finish === false) return;   // a one-off tip in the middle of a game just goes away
        const go = document.createElement("div"); go.className = "spotGo"; go.setAttribute("aria-hidden", "true");
        const b = document.createElement("b"); b.textContent = "Let's Play!"; go.append(b); wrap.append(go);
        setTimeout(() => go.remove(), 1300);
        return;
      }
      frame = 0; if (o.steps[k].enter) o.steps[k].enter();
      // bring what this step lights into view if it's off the screen
      const rs = (o.steps[k].els || []).map(e => typeof e === "function" ? e() : e).flat().map(x => x.getBoundingClientRect());
      if (rs.length) {
        const top = Math.min(...rs.map(r => r.top)), bottom = Math.max(...rs.map(r => r.bottom));
        if (bottom > innerHeight - 8) scrollBy(0, bottom - innerHeight + 24); else if (top < 8) scrollBy(0, top - 24);
      }
      show();
      setTimeout(redraw, 350);   // and again once the page has settled (a message line can shift things)
    }
    addEventListener("resize", redraw); addEventListener("scroll", redraw, {passive: true});
    // The page can also shift under the layer with no scroll or resize (a message line coming or
    // going above the board), so follow the grid wherever it goes while the layer is up.
    let was = "";
    (function follow() {
      if (!layer.isConnected) return;
      const g = o.grid.getBoundingClientRect(), now = `${g.left} ${g.top} ${g.width} ${g.height}`;
      if (was && now !== was) redraw();
      was = now; requestAnimationFrame(follow);
    })();
    layer.addEventListener("pointerdown", next);
    layer.addEventListener("keydown", e => { if (e.key === " " || e.key === "Enter" || e.key === "Escape") next(e); });
    ticker = setInterval(() => { const st = o.steps[k]; if (st && (st.marks || []).some(m => Array.isArray(m[2]))) { frame++; show(); } }, 900);
    next(); layer.focus({preventScroll: true});
  }

  // How to play plays a game's walkthrough on its board. When there's no puzzle out to show it on (it's
  // finished), say how to get one.
  // Games with no new-puzzle button start the level again with Restart instead.
  function helpLater() { const b = $("newBtn") || $("restartBtn"); note(b ? `Tap ${b.textContent.trim()}, then How to play.` : "Pick a level, then tap How to play.", 4000); }

  let msgTimer = null;
  function note(text, ms) {
    clearTimeout(msgTimer);
    $("msg").textContent = text || "";
    if (text && ms !== 0) msgTimer = setTimeout(() => note(""), ms || 3500);
  }

  /* ---------- hints ---------- */
  // Every game's Hint works the same way. The game works out what to show and hands it to its hinter, which keeps
  // the mark on the board for HINT_MS (or until the board changes) with a line saying what to do. Marks are gold
  // (HINT.gold) for where to go and red (HINT.red) for a mistake. Pressing Hint again on the same board can say more
  // each time: level() is how many hints have already been shown on this board (0 the first time).
  // o: {key() (the board as it stands, as a string), draw() (redraws; it reads the mark with current()),
  //     game() (the puzzle being played, so a new one that happens to look the same starts afresh)}
  // show(mark, say, {ms, uncounted}): uncounted shows a mark that isn't a hint (Audit's), so it doesn't add a level.
  const HINT_MS = 5000, HINT = {gold: "#ECA818", red: "#C8392B"};
  function hinter(o) {
    let mark = null, at = null, of = null, shown = 0, timer = 0;
    const same = () => o.game() === of && o.key() === at;
    return {
      level() { if (!same()) shown = 0; return shown; },
      show(m, say, {ms = HINT_MS, uncounted = false} = {}) {
        clearTimeout(timer);
        if (!same()) shown = 0;
        mark = m; at = o.key(); of = o.game(); if (!uncounted) shown++;
        o.draw(); if (say) note(say, ms);
        timer = setTimeout(() => { if (mark === m) { mark = null; o.draw(); } }, ms);
      },
      // the mark to draw, while the board is as it was when it was shown
      current() { if (mark && !same()) mark = null; return mark; },
      clear(redraw = true) { clearTimeout(timer); if (mark) { mark = null; if (redraw) o.draw(); } },
    };
  }

  /* ---------- keyboard play ---------- */
  // Keyboard play on a board, the same in every game: the arrow keys move a cursor (it shows from the first arrow
  // press, and a tap or Escape hides it), Space or Enter acts on what's under it, and a game can list keys of its
  // own. Keys go to the board unless a card, the walkthrough, or a text box or menu has them; Space and Enter on a
  // focused button press the button.
  // o: {on() (whether the board takes keys now), show(i) (draws the cursor on spot i; -1 hides it),
  //     act(i, key, e) (Space, which Enter also means, or one of o.keys, on spot i; return false to let the key go),
  //     keys (a list of other keys, by name in lower case: "m", "backspace"), size() ([W, H] of a board of squares, spots numbered by row), or
  //     move(i, dx, dy, e) (where an arrow goes from spot i, for boards that aren't squares), start() (the first spot),
  //     escape() (anything to put away besides the cursor)}
  const CURSOR = "#73A7AE";
  function gridKeys(o) {
    let at = -1;
    const k = {at: () => at, set(i) { at = i; o.show(at); }, hide() { if (at >= 0) { at = -1; o.show(-1); } }};
    const step = (i, dx, dy) => { const [W, H] = o.size(), x = Math.max(0, Math.min(W - 1, i % W + dx)), y = Math.max(0, Math.min(H - 1, Math.floor(i / W) + dy)); return y * W + x; };
    document.addEventListener("keydown", e => {
      if (e.ctrlKey || e.metaKey || e.altKey || !o.on() || document.querySelector(".spot") || $("overlay").classList.contains("show")) return;
      const tag = e.target.tagName;
      if (/^(INPUT|SELECT|TEXTAREA)$/.test(tag)) return;
      if (e.key === "Escape") { if (o.escape) o.escape(); k.hide(); return; }
      const dir = {ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0]}[e.key];
      if (dir) {
        e.preventDefault();
        at = at < 0 ? (o.start ? o.start() : 0) : (o.move || step)(at, ...dir, e);
        o.show(at); return;
      }
      const key = e.key === "Enter" ? " " : e.key.toLowerCase();
      if (at < 0 || (key === " " && tag === "BUTTON") || !(key === " " || (o.keys || []).includes(key))) return;
      if (o.act(at, key, e) !== false) e.preventDefault();
    });
    document.addEventListener("pointerdown", () => k.hide(), true);
    return k;
  }
  // For boards that aren't squares: the nearest of `spots` ([x, y] each) from spot i in the direction of an arrow,
  // or i if there's none that way.
  function nearestThatWay(spots, i, dx, dy) {
    const [x0, y0] = spots[i];
    let best = i, bestD = Infinity;
    spots.forEach(([x, y], j) => {
      if (j === i || !spots[j]) return;
      const along = (x - x0) * dx + (y - y0) * dy, across = Math.abs((x - x0) * dy - (y - y0) * dx);
      if (along <= 0) return;
      const d = along + 2 * across;   // straight that way counts for more than off to the side
      if (d < bestD) { bestD = d; best = j; }
    });
    return best;
  }

  // The square under a pointer, or -1.
  function cellAt(x, y) {
    const el = document.elementFromPoint(x, y), c = el && el.closest && el.closest(".board .cell");
    return c ? +c.dataset.i : -1;
  }

  // If something breaks, say what on the page and count it on the dashboard, so it can be fixed.
  function reportError(msg, where) {
    track(`Error: ${msg}${where ? ` (${where})` : ""}`);
    const m = $("msg"); if (m) m.textContent = `Something went wrong: ${msg}`;
  }
  window.addEventListener("error", e => reportError(e.message, `${(e.filename || "").split("/").slice(-2).join("/")}:${e.lineno}`));
  window.addEventListener("unhandledrejection", e => reportError(String((e.reason && e.reason.message) || e.reason)));
  // Reopen a saved puzzle. If that fails, report why and start a fresh puzzle instead of
  // leaving an empty board.
  function reopen(fn, fresh) {
    try { fn(); }
    catch (e) {
      const why = `${e.message}${e.stack ? ` (${e.stack.split("\n")[0]})` : ""}`;
      track(`Error: couldn't reopen saved puzzle: ${why}`);
      fresh(`Your saved puzzle couldn't be reopened, so here's a new one. (${e.message})`);
    }
  }

  return {GAMES, GROUPS, favorites, favStar, matches, $, nav, daily, dailyStreak, dailyDoneToday, dailyWon, dailyLine, load, save, builder, openCard, closeCard, winCard, homeBtn, sizeUp, otherSize, note, helpLater, cellAt, hinter, HINT, HINT_MS, gridKeys, nearestThatWay, CURSOR, track, reopen,
          setupTimer, freshClock, spotlight, toysOff, saveToys, needToys, goldPaw, shareResult, checkClock, finishClock, timeLineEl, showBests, readShare, offerShare, shareCard, sendLink, toyPicker, pickLook};
})();
