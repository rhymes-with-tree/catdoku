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
    ["Night Light", "nightlight", "Help Dottie get every cat to close its eyes", "#3A3358", "logic", "lights out flip"],
    ["Unravel", "unravel", "Cover every line with one strand of yarn", "#E16A4A", "lines", "one line euler draw"],
    ["Tail Chase", "tailchase", "Help Jan Brady catch the toys without getting tangled", "#C9773F", "quick", "snake action"],
    ["Keyboard Cat", "keyboardcat", "Make words from the keys that still work", "#8D78AD", "words", "spelling bee"],
    ["If It Fits", "iffits", "Build the box, and Bugsy comes to sit in it", "#C4925C", "teasers", "tangram shapes"],
    ["High Perch", "highperch", "Raise every cat tree to just the right height", "#8E5E3E", "logic", "skyscrapers towers futoshiki sudoku latin square"],
    ["Spelling String", "fuzzyspelling", "Slide the letters until the bar spells a word", "#B94588", "words", "thruline fuzzy spelling pompoms"],
    ["Cat Mat", "catastrophe", "Help Crunch dye the whole mat one colour", "#73A7AE", "teasers", "flood fill colour color rug catastrophe"],
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
    ["Cat Pile", "catpile", "Pile napping cats on the blanket and clear the lines", "#E16A4A", "teasers", "blockudoku block blast woodoku 1010 blocks shapes tetris polyomino sudoku lines", "2026-10-23"],
    ["Fish Bones", "fishbones", "Swap the bones until Bowtie's fish spells words again", "#73A7AE", "words", "waffle swap letters crossword word puzzle fish skeleton", "2026-10-25"],
    ["Toy Stash", "stash", "Work out which toys the cat stashed in the boxes", "#7885BA", "logic", "mastermind guess code breaker codebreaker bulls and cows deduction colours colors hidden", "2026-10-26"],
    ["Knit Pick", "knitpick", "Help Laya find the words knitted into her blanket", "#8D78AD", "words", "word search wordsearch wonderword find a word hidden word puzzle", "2026-10-26"],
    ["Bird Watch", "birdwatch", "Help Bugsy and Bowtie spot the birds without waking the human", "#73A7AE", "quick", "whack-a-mole whack a mole birds window tapping action reflexes", "2026-10-26"],
    ["Shelf Life", "shelflife", "Help Fred put the yarn back in order", "#B94588", "teasers", "i love hue gradient colour color sort shades swap yarn", "2026-10-26"],
    ["Meowbile", "meowbile", "Weigh the toys on the cat's mobile", "#7885BA", "numbers", "solveme mobiles mobile balance scales weights weigh algebra equations maths math", "2026-10-27"],
    ["Kitten Caboodle", "kittencaboodle", "Wake the kittens. Spell the words made from the mother's root word.", "#B3B94B", "words", "rootonym word roots prefixes suffixes etymology greek latin vocabulary definitions clues kittens", "2026-10-29"],
    ["Wind Up", "windup", "Drop yarn for Gus and wind two of a kind into a bigger ball", "#B94588", "quick", "suika watermelon game merge drop physics 2048 yarn balls fluffballs pompoms", "2026-10-30"],
    ["L-M-N-O-Pom", "lmnopom", "Spell words in the falling pompoms for Marmalade to pounce on", "#B94588", "words", "tetris letris falling letters words scrabble blocks drop pompoms pom poms alphabet lmnop", "2026-10-31"],
    ["Window Ledges", "windowledges", "Add up the windows to match every total", "#B3B94B", "numbers", "kakuro cross sums sums arithmetic maths math", "2026-10-31"],
    ["Cat Shuffle", "catshuffle", "Put the cat's picture back together", "#9874CA", "teasers", "fifteen 15 puzzle sixteen twiddle sliding tiles slide puzzle picture shuffle scramble rotate turn", "2026-11-01"],
    ["Mew Hue", "mewhue", "Swipe paint round the colour wheel", "#B94588", "quick", "colour color wheel mixing paint swipe 2048 merge hue", "2026-11-01"],
  ];
  // The shelves the front page and the games menu sort the games onto, in order: key (also a plain name for it,
  // for search), heading, one line.
  const GROUPS = [
    ["logic", "Cat Logic", "Work it out by the rules; every puzzle has one answer"],
    ["numbers", "Cat Math", "Sums and arithmetic"],
    ["lines", "Cat Trails", "Join, link and route things"],
    ["words", "Cat Spells", "Spell, find and climb words"],
    ["teasers", "Curious Cat", "Moves to plan and shapes to fit"],
    ["quick", "Kitten Play", "Match, pop, sort and chase"],
    ["travels", "Cat Travels", "Countries, maps and places"],
  ];
  // A shelf's games, A to Z by name (ignoring punctuation, so L-M-N-O-Pom sits among the Ls). GAMES itself keeps its own
  // order, which today's challenge takes its turns from.
  const onShelf = key => GAMES.filter(g => g[4] === key)
    .sort((a, b) => a[0].replace(/[^A-Za-z0-9 ]/g, "").localeCompare(b[0].replace(/[^A-Za-z0-9 ]/g, ""), "en", {sensitivity: "base"}));
  // Each shelf's colour: its games' tiles on the front page and in the games menu, and its label and shortcut.
  const SHELF_COLOUR = {logic: "#BD5538", numbers: "#ECA818", lines: "#73A7AE", words: "#B94588", teasers: "#7885BA", quick: "#6AA673", travels: "#4E577D"};
  const $ = id => document.getElementById(id);

  /* ---------- text size ---------- */
  // On an iPhone or iPad, the text follows the size set in Settings (Display & Brightness, Text Size, and
  // Accessibility's Larger Text), as Apple's apps do: games.css multiplies its text sizes by --ts. The system's body
  // text is 17 points at the standard setting, so --ts is how far it is from that: from a little smaller (14 points)
  // up to 2.4 times (41 points, about Apple's third larger accessibility size, AX3); titles grow less (--ts-big). Elsewhere, the browser's own zoom does this.
  function textSize() {
    if (!(window.CSS && CSS.supports("font", "-apple-system-body"))) return;
    const probe = document.createElement("span");
    probe.style.cssText = "font:-apple-system-body;position:absolute;visibility:hidden";
    document.body.append(probe);
    const px = parseFloat(getComputedStyle(probe).fontSize) || 17;
    probe.remove();
    const ts = Math.min(2.4, Math.max(0.88, px / 17));
    document.documentElement.style.setProperty("--ts", ts.toFixed(3));
    // at the larger accessibility sizes some layouts change (games.css, .bigText): fewer tiles across, switches one
    // under another, Games as its icon alone; then the title is fitted again
    document.documentElement.classList.toggle("bigText", ts >= 1.6);
    dispatchEvent(new Event("resize"));
  }
  if (document.body) textSize(); else document.addEventListener("DOMContentLoaded", textSize);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) textSize(); });

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
  function favStar(slug, onChange, withLabel, say = withLabel) {
    const b = document.createElement("button"), name = (GAMES.find(g => g[1] === slug) || [slug])[0];
    b.type = "button"; b.className = "favStar" + (withLabel ? " labelled" : ""); b.dataset.slug = slug;
    b.onclick = e => {
      e.preventDefault(); e.stopPropagation();
      const on = toggleFavorite(slug);
      document.querySelectorAll(".favStar").forEach(x => x.dataset.slug === slug && x.refresh());
      if (onChange) onChange();
      if (say) note(on ? `${name} is in your favorites, at the top of the front page.` : `${name} is out of your favorites.`, 3500);
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
      a.className = "gameTile"; a.style.setProperty("--tile", SHELF_COLOUR[g[4]] || color);
      a.href = `${base}${slug}/`; a.dataset.slug = slug;
      if (slug === current) a.setAttribute("aria-current", "page");
      const b = document.createElement("b"); b.textContent = name;
      const sm = document.createElement("small"); sm.textContent = slug === current ? "You're here" : blurb;
      a.append(b, sm, ...(mastered(slug) ? [masterPill()] : []));
      // the star sits beside the link, not in it, so tapping it doesn't open the game
      const w = document.createElement("div"); w.className = "favWrap"; w.dataset.slug = slug;
      w.append(a, favStar(slug, drawFavs)); return w;
    };
    const section = (title, games, key) => {
      const sec = document.createElement("section"); sec.className = "gamesGroup";
      const h = document.createElement("h3"); h.textContent = title; if (key) h.style.setProperty("--dot", SHELF_COLOUR[key]);
      const grid = document.createElement("div"); grid.className = "gamesGrid";
      grid.append(...games.map(tile)); sec.append(h, grid); return sec;
    };
    const favs = section("Favorites", []);
    function drawFavs() {
      const list = favorites().map(s => GAMES.find(g => g[1] === s));
      favs.querySelector(".gamesGrid").replaceChildren(...list.map(tile));
      favs.hidden = !list.length || !!search.value.trim();
    }
    const shelves = GROUPS.map(([key, title]) => section(title, onShelf(key), key));
    const none = document.createElement("p"); none.className = "gamesNone"; none.hidden = true; none.textContent = "No games match that.";
    const dslug = daily(), dgame = GAMES.find(g => g[1] === dslug);
    const todays = section(dailyDoneToday() ? "Today's challenge: done" : "Today's challenge", [dgame]);
    if (dailyDoneToday()) todays.querySelector(".gameTile").classList.add("gold", "done");   // gold once it's solved, as on the front page
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
    // On a game's page the menu button (Games) and the game's own star stand at the far right of the title, as tools,
    // with the title, its cat and the stripe centred between them and an empty column of the same width on the left;
    // the menu opens under the title as before.
    const row = document.createElement("div"); row.className = "gamesRow";
    const head = current && document.querySelector("main header");
    if (head) {
      btn.classList.add("tool"); btn.innerHTML = iconSVG("games") + '<span class="lbl">Games</span>';
      const st = favStar(current, drawFavs, false, true); st.classList.add("tool", "headStar");
      const tools = document.createElement("div"); tools.className = "headTools"; tools.append(btn, st);
      head.classList.add("withTools"); head.append(tools);
      // a long name gets a little smaller rather than going onto two lines beside the tools, unless even that won't do
      const h1 = head.querySelector("h1"), fit = () => {
        h1.style.fontSize = ""; let fs = parseFloat(getComputedStyle(h1).fontSize);
        // clear of Games and the star: left of them, or on another row (at the larger text sizes they sit above the title)
        const t = h1.closest(".title") || h1, apart = () => { const a = t.getBoundingClientRect(), b = tools.getBoundingClientRect(); return a.right <= b.left + 1 || a.top >= b.bottom - 1 || a.bottom <= b.top + 1; };
        const one = () => h1.getBoundingClientRect().height < fs * 1.5 && apart();
        // never smaller than a little over the body text (at the larger text sizes that's big): past that, two lines
        const floor = Math.max(20, parseFloat(getComputedStyle(document.body).fontSize) * 1.15);
        while (!one() && fs > floor) { fs -= 1; h1.style.fontSize = fs + "px"; }
        if (!one()) {   // too long even then: two lines at a size that reads...
          fs = Math.max(24, floor); h1.style.fontSize = fs + "px";
          // ...unless one word on its own is too wide for the room (Caboodle on a small phone): then smaller, till it fits
          const clear = () => apart() && h1.scrollWidth <= h1.clientWidth + 1;
          while (!clear() && fs > 16) { fs -= 1; h1.style.fontSize = fs + "px"; }
        }
      };
      if (h1) {
        fit(); addEventListener("resize", fit); document.fonts?.ready.then(fit);
        for (const img of head.querySelectorAll("img")) img.addEventListener("load", fit);   // the cat beside the name takes room once it's in
      }
    } else { row.append(btn); if (current) row.append(favStar(current, drawFavs, true)); }
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
    // a dialog to VoiceOver, named by its title
    h.id = "cardTitle"; card.setAttribute("role", "dialog"); card.setAttribute("aria-modal", "true"); card.setAttribute("aria-labelledby", "cardTitle");
    $("overlay").classList.add("show");
    const first = row.querySelector("button"); if (first) first.focus();
  }
  function closeCard() { $("overlay").classList.remove("show"); }
  // Escape takes a card's way out where it has one (Close, Cancel, Keep playing, Done, or a look at the board), as
  // Escape cancels on Apple's platforms; a card that needs a choice (out of lives) stays.
  document.addEventListener("keydown", e => {
    const ov = $("overlay"); if (e.key !== "Escape" || !ov || !ov.classList.contains("show") || document.querySelector(".spot")) return;
    const out = [...ov.querySelectorAll(".btns button")].find(b => /^(Close|Cancel|Keep playing|Done|Admire|Look at)/.test(b.textContent.trim()));
    if (out) { e.preventDefault(); out.click(); }
  });

  // Moving up: after a clean win the next puzzle is one size bigger, up to the largest the page's size
  // list offers. The finishing cards also offer every other size, so players can always choose.
  const sizeUp = (N, sel) => Math.min(Math.max(...[...sel.options].map(o => +o.value)), N + 1);
  function otherSize(sel, current, choose, text = "Or play a different size:") {
    // A select's own text can't wrap (not on an iPhone, anyway), so the chosen level is shown as plain text that can
    // run onto two lines, and the select is laid over it, see-through, so a tap still opens the usual menu.
    const wrap = document.createElement("label"); wrap.className = "pick";
    const box = document.createElement("span"); box.className = "pickbox";
    const shown = document.createElement("span"); shown.className = "pickshown";
    const pick = document.createElement("select"); pick.setAttribute("aria-label", text);
    for (const o of sel.options) { const c = new Option(o.textContent, o.value); c.selected = +o.value === current; pick.append(c); }
    const show = () => { shown.textContent = pick.selectedIndex >= 0 ? pick.options[pick.selectedIndex].textContent : ""; };
    pick.onchange = () => { show(); closeCard(); choose(+pick.value); };
    show(); box.append(shown, pick); wrap.append(text, box);
    return wrap;
  }

  // Names for the cat in the win card's photo (from Catdoku, which had the longest list).
  const CAT_NAMES = {
    classic: ["Oliver","Luna","Milo","Chloe","Leo","Bella","Simon","Tilly","Felix","Daisy","Oscar","Pearl","Jasper","Hazel","Gus","Mabel","Otis","Rosie","Arlo","Winnie",
              "Walter","Ruby","Frank","Ivy","Theo","June","Murray","Poppy","Edith","Patches"],
    // every name from T. S. Eliot's "The Naming of Cats"
    eliot: ["Peter","Augustus","Alonzo","James","Victor","Jonathan","George","Bill Bailey","Plato","Admetus","Electra","Demeter",
            "Munkustrap","Quaxo","Coricopat","Bombalurina","Jellylorum"],
    food: ["Biscuit","Mochi","Pickles","Nacho","Waffles","Dumpling","Pepper","Olive","Nutmeg","Muffin","Tofu","Pumpkin","Clementine","Toast","Paprika","Gnocchi","Butterbean","Cannoli","Pretzel","Sesame",
           "Crouton","Bagel"],
    whimsical: ["Pounce","Sprocket","Doodle","Noodle","Wiggles","Zigzag","Bumble","Pipsqueak","Fidget","Scooter","Ruckus","Jellybean","Tumble","Skedaddle","Kerfuffle","Snickerdoodle","Hullabaloo","Flapjack","Whiskerdoodle","Rascal",
                "Bamboozle","Shenanigans"],
    fancy: ["Sir Pounce-a-Lot","Lady Marmalade","Duke Fluffington","Baroness Von Whiskers","Captain Mittens","Professor Paws","Dame Purrington","Lord Nibbleton","Countess Crumpet","Admiral Snuggles","Madame Meow","Sir Reginald Floof","Princess Pudding","General Tso","Major Tom","Judge Biscuit","Doctor Snooze","Reverend Tuna","Count Catula","Mayor McWhiskers",
            "Captain Whiskerbottom"],
    nature: ["Willow","Juniper","Basil","Clover","Maple","Sage","Fern","Pebble","Aspen","Thistle","Moss","Hickory","Briar","Rain","Ember","Cedar","Birch","Marigold","Acorn","Sparrow",
             "Wren","Laurel","Heather"],
    literary: ["Merlin","Ophelia","Pip","Hermes","Juno","Atticus","Beatrix","Figaro","Gatsby","Ramona","Puck","Minerva","Sherlock","Matilda","Loki","Persephone","Watson","Hamlet","Freya","Tolstoy",
               "Ishmael","Portia","Dorian","Brontë","Galahad","Hermia","Ovid"],
    puns: ["Catrick Swayze","Cat Benatar","Chairman Meow","Purrlock Holmes","Meowzart","Leonardo DiCatprio","Santa Claws","Fuzz Aldrin","Kitty Purry","Cleocatra","Catniss Everdeen","Pablo Picatso","Pawl McCatney","Sir Isaac Mewton","Albert Meowstein","Bob Meowley","Salvador Catli","William Shakespaw","Jennifur Aniston","Furrdinand Magellan",
           "Meowrilyn Monroe","Brad Kitt","Clawdia Schiffer","Ernest Hemingpaw","Catsanova","Purrcy Bysshe Shelley","Vincent van Meow","Frida Catlo","Andy Furhol","Paw Revere","Winston Purrchill","Napawleon","Catalina Wine Mixer","Meowly Ringwald","Dolly Purrton","Elvis Pawsley","Mister Meowgi","Katharine Hepburrn","Amelia Furhart","Jane Pawsten"]
  };
  // Whimsical, fancy, and pun names come up twice as often as the rest.
  const NAMES = [...Object.values(CAT_NAMES).flat(), ...CAT_NAMES.whimsical, ...CAT_NAMES.fancy, ...CAT_NAMES.puns];
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
  // o.lines adds lines of the game's own under the text.
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
  // Gold paws earned on this device, counted per game by the win card. A win card shown again (a finished puzzle reopened) isn't
  // counted twice: the last few wins counted are remembered by game, result and text. A gold paw on a game's top level or
  // size masters it, and its tile gets a gold Mastered label (`top`; a game whose levels aren't its picker's values, like Catlas, says
  // whether a win was on its top one).
  const GOLD = "catdoku.goldpaws.v1";
  const goldPaws = slug => (load(GOLD).counts || {})[slug] || 0;
  const mastered = slug => !!(load(GOLD).top || {})[slug];
  // A mastered game's tile keeps its shelf's colour and gets a small gold Mastered label; extra (the front page's "12 solved")
  // joins it as "Mastered · 12 solved", and a phone, short of room, shows just the extra in the gold label.
  const masterPill = (extra = "") => {
    const m = document.createElement("span"); m.className = "masterPill"; m.title = "Mastered: a gold paw at the top level";
    if (!extra) m.textContent = "Mastered";
    else { const w = document.createElement("span"); w.className = "masterWord"; w.textContent = "Mastered · "; m.append(w, extra); }
    return m;
  };
  // the highest level or size in the page's picker
  const topLevel = () => { const sel = $("levelSel") || $("size"); return sel ? Math.max(...[...sel.options].map(o => +o.value).filter(v => !isNaN(v))) : null; };
  function countGold(result, text, top) {
    if (!CURRENT) return;
    const d = load(GOLD), sig = `${CURRENT}|${JSON.stringify(result || null)}|${text}`, seen = d.seen || [];
    if (seen.includes(sig)) return;
    const counts = d.counts || {}, tops = d.top || {};
    counts[CURRENT] = (counts[CURRENT] || 0) + 1;
    if (top ?? (result && result.n != null && result.n === topLevel())) tops[CURRENT] = true;
    save(GOLD, {counts, top: tops, seen: [...seen, sig].slice(-30)});
  }
  // The win cards' way out to every game.
  const homeBtn = () => ["Back to the front page", () => { location.href = HOME; }];
  function winCard(text, onNext, admire = "Admire my board", result, o = {}) {
    const media = document.createElement("div"); media.className = "winmedia";
    // what earned the gold paw ("No undos!"), under the paw
    if (o.gold) { countGold(result, text, o.top); media.append(goldPaw()); if (o.goldWhy) { const g = document.createElement("p"); g.className = "goldwhy"; g.textContent = o.goldWhy; media.append(g); } }
    const p = document.createElement("p"); p.textContent = text;
    const name = document.createElement("p"); name.className = "catname";
    name.textContent = `Meet ${NAMES[Math.floor(Math.random() * NAMES.length)]}!`;
    const tl = timeLineEl(result); if (tl) media.append(tl);
    media.append(p);
    // the win streak, then a game's own extra lines
    const st = T ? streak(T.name).streak : 0;
    if (st > 1) { const x = document.createElement("p"); x.className = "streakline"; x.textContent = `🔥 ${st} wins in a row`; media.append(x); }
    for (const line of o.lines || []) { const x = document.createElement("p"); x.textContent = line; media.append(x); }
    const dl = dailyLine();
    if (dl) { const d = document.createElement("p"); d.className = "dailyline"; d.textContent = dl; media.append(d); }
    // the picture on its own, so a phone held sideways can set it beside the rest (games.css)
    const pic = document.createElement("div"); pic.className = "winpic";
    if (o.gold && o.goldPic) pic.append(...o.goldPic); else pic.append(catPhoto(), name);
    media.append(pic);
    const btns = [[o.next || "New puzzle", onNext, true]];
    if (admire !== null) btns.push([admire, () => { closeCard(); if (o.onAdmire) o.onAdmire(); else note(admireNote(), 0); }]);
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
    .card p.goldwhy{margin:-4px 0 12px;font-weight:800;color:var(--gold-text)}
    .card .timeline{font-weight:800;color:var(--ink);margin:0 0 12px}
    .bests{width:100%;border-collapse:collapse;margin:0 0 14px;font-variant-numeric:tabular-nums;color:var(--ink)}
    .bests th,.bests td{padding:4px 6px;text-align:left;border-bottom:1px solid var(--line)}
    .bests th{font-size:calc(13px*var(--ts));color:var(--ink-soft);font-weight:600}
    .bests td.num,.bests th.num{text-align:right}
    .bests tr.now td{font-weight:800}
    .card h3{margin:4px 0 6px;font-size:calc(18px*var(--ts))}
    .spot{position:fixed;inset:0;z-index:9;overflow:hidden;cursor:pointer;animation:spotIn .35s ease-out;-webkit-tap-highlight-color:transparent;touch-action:none}
    .spot:focus{outline:none}
    .spot svg{position:absolute;inset:0;display:block}
    .spot .dim{fill:rgba(42,37,48,.66)}
    .spot .edge{fill:none;stroke:#E23B3B;stroke-linecap:round}
    .spot .edge.ok{stroke:#4FB35F}
    .spot .arrowLine{fill:none;stroke:#FFF4D2;stroke-linecap:round}
    .spot .arrowLine.back{stroke:var(--ink)}
    .spot .arrowHead{fill:#FFF4D2;stroke:var(--ink);stroke-linejoin:round;paint-order:stroke fill}
    .spot .say{position:absolute;left:4%;right:4%;max-width:100vw;display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;pointer-events:none}
    .spot .say b{font-size:clamp(24px,7vw,36px);font-weight:800;line-height:1.1;color:#FFF4D2;-webkit-text-stroke:6px var(--ink);paint-order:stroke fill;text-wrap:balance}
    .spot .say small{font-size:15px;font-weight:600;color:#FFF4D2;-webkit-text-stroke:3px var(--ink);paint-order:stroke fill;opacity:.9;animation:spotTap 1.6s ease-in-out infinite}
    .spot .say b .w{white-space:nowrap}
    .spot .say b .emo img{display:inline-block;width:1.15em;height:1.15em;vertical-align:-.2em}
    .spot .say b .emo{-webkit-text-stroke:0;display:inline-block;background:#FFF4D2;border:3px solid var(--ink);border-radius:999px;padding:0 .12em;margin:0 .04em;line-height:1.15;font-size:.85em;vertical-align:.06em}
    /* the walkthrough's own bar, centred at the bottom of the screen: a dot for each step (Apple's page control) and Skip */
    .spot .spotBar{position:fixed;left:50%;transform:translateX(-50%);max-width:calc(100vw - 24px);bottom:max(14px,env(safe-area-inset-bottom));display:flex;align-items:center;gap:14px;
      padding:4px 6px 4px 16px;border-radius:999px;background:rgba(42,37,48,.82);pointer-events:auto;cursor:default}
    .spot .dots{display:flex;gap:7px}
    .spot .dots i{width:8px;height:8px;border-radius:50%;background:rgba(255,244,210,.35)}
    .spot .dots i.on{background:#FFF4D2}
    .spot .spotBar button{min-height:44px;min-width:64px;padding:0 16px;border:none;border-radius:999px;background:none;color:#FFF4D2;font:inherit;font-weight:800;font-size:calc(16px*var(--ts));cursor:pointer}
    .spot .spotBar button:hover,.spot .spotBar button:focus-visible{background:rgba(255,244,210,.16)}
    .spot.trying{pointer-events:none}   /* an interactive step: taps go through to what it lights (and nowhere else) */
    .spot.trying .spotBar{pointer-events:auto}
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
  // Fields a new puzzle starts with. Leaving a puzzle you'd started (and not solved) for a new one ends your win streak.
  const freshClock = () => { const g = T && T.game(); if (g && g.started && !g.result) breakStreak(); return {ms: 0, timed: true, started: false}; };
  // Win streaks, per game: puzzles won in a row, kept on this device. A win (finishClock) adds one, and the win card
  // says so from two on. Leaving a started puzzle for a new one ends it (freshClock), and so does losing: a game
  // calls breakStreak when you run out of lives, moves or toys, give up, or get tangled.
  const STREAKS = "catdoku.streaks.v1";
  const streak = name => Object.assign({streak: 0, best: 0}, load(STREAKS)[name || (T && T.name)]);
  function setStreak(name, n) {
    const all = load(STREAKS), s = Object.assign({streak: 0, best: 0}, all[name]);
    s.streak = n; s.best = Math.max(s.best, n); all[name] = s; save(STREAKS, all);
  }
  function breakStreak() { if (T && streak(T.name).streak) setStreak(T.name, 0); }
  // A puzzle saved before the timer existed can't set a best time.
  function checkClock(g) { if (g && g.timed === undefined) g.timed = false; }

  // Call once when a puzzle is solved: records the time and returns what the card shows.
  function finishClock(g) {
    dailyWon();
    if (T) setStreak(T.name, streak(T.name).streak + 1);
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
  // how every game's note starts when a link can't be used (offerShare looks for it)
  const BAD_LINK = "That share link didn't work";

  // A share link this page was opened with, or null. The link is then tidied off the address.
  function readShare(slug) {
    const m = location.hash.match(/^#share=([\w-]+)/);
    if (!m) return null;
    history.replaceState(null, "", location.pathname + location.search);
    try { const d = JSON.parse(fromB64(m[1])); if (d && d.g === slug && d.N) return d; } catch (e) {}
    setTimeout(() => note(BAD_LINK + ". It may have been cut off.", 6000), 0);
    return null;
  }
  // Open a shared puzzle, checking first if it would replace a puzzle in progress.
  // A game turns down a link it can't use by saying so in the note line (a note starting BAD_LINK) and leaving its
  // puzzle as it was; o.open throwing counts the same. Then that note stays up in place of the welcome, and
  // o.fresh(why), when given, starts a puzzle (for a page that opened with the link and had none of its own).
  function offerShare(d, o) {
    const go = () => {
      closeCard(); note("");
      try { o.open(d); } catch (e) { note(BAD_LINK + ".", 5000); }
      const why = $("msg").textContent;
      if (why.startsWith(BAD_LINK)) { track(`${o.name} share link didn't work`); if (o.fresh) o.fresh(why); return; }
      track(`${o.name} shared puzzle opened`);
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
    box.style.cssText = "width:100%;font:inherit;font-size:calc(13px*var(--ts));margin:0;border:2px solid var(--line);border-radius:8px;padding:6px";
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
  // How to play plays the whole walkthrough. A first visit (the walkthrough starting by itself) keeps to the board and
  // its rules, as Apple's onboarding guidance asks (brief, interactive, optional): steps that only point at a tool or a
  // setting (Erase, Guess, Hint, Auto grade…) are kept back as tips, shown one at a time later, in context (tips, below).
  let helpTappedAt = 0;
  document.addEventListener("click", e => { if (e.target.closest && e.target.closest("#helpBtn")) helpTappedAt = Date.now(); }, true);
  const TIPS = "catdoku.tips.v1", SLUG = location.pathname.split("/").filter(Boolean).pop() || "";
  const resolveEls = els => (els || []).map(e => typeof e === "function" ? e() : e).flat().filter(Boolean);
  // where a page element can be found again on a later visit: its id, or the id of something in it and its class
  function findable(el) {
    if (el.id) return {id: el.id};
    const inner = el.querySelector && el.querySelector("[id]");
    return inner && el.classList[0] ? {id: inner.id, up: "." + el.classList[0]} : null;
  }
  function findEl(f) { const e = document.getElementById(f.id); return e && f.up ? e.closest(f.up) : e; }
  const isToolStep = st => !st.try && !st.enter && !(st.lit && st.lit.length) && !st.marks && !st.shapes && !st.lines && !st.arrows &&
    resolveEls(st.els).length && resolveEls(st.els).every(e => e.closest && e.closest(".actions,.bar,.toggles,main > .tools") && findable(e));
  // A step about an on/off switch (Auto grade, Auto check…) isn't in the walkthrough at all: it's shown once, by
  // itself, the first time the player turns that switch on, which is when it means something (tips, below).
  const isSwitchStep = st => isToolStep(st) && resolveEls(st.els).every(e => e.closest(".toggles") && e.querySelector && e.querySelector("input[type=checkbox]"));
  function keepSwitchTips(steps) {
    if (!steps.length) return;
    const d = load(TIPS), shown = d[SLUG + ":shown"] || [];   // each is shown once ever, even if How to play runs again
    const left = steps.map(st => ({say: st.say, els: resolveEls(st.els).map(findable)})).filter(t => !shown.includes(t.say));
    if (left.length) d[SLUG + ":on"] = left; else delete d[SLUG + ":on"];
    save(TIPS, d);
  }
  function keepTips(steps) {
    const d = load(TIPS);
    d[SLUG] = steps.map(st => ({say: st.say, els: resolveEls(st.els).map(findable)}));
    d._at = Date.now();   // and the first tip waits a day: the walkthrough is enough for one visit
    save(TIPS, d);
  }

  function spotlight(o) {
    const tip = o.finish === false;
    if (!tip) {   // switches are taught when they're turned on, never in the walkthrough
      const sw = o.steps.filter(isSwitchStep);
      if (sw.length && sw.length < o.steps.length) { o = {...o, steps: o.steps.filter(st => !isSwitchStep(st))}; keepSwitchTips(sw); }
    }
    if (!tip && Date.now() - helpTappedAt > 2000) {   // a first visit: tools and settings wait for later
      // a step marked later: true waits too (for How to play, or as a tip if what it points at can be found again)
      const isLater = st => isToolStep(st) || (st.later && !st.try);
      const later = o.steps.filter(isLater);
      if (later.length && later.length < o.steps.length) {
        o = {...o, steps: o.steps.filter(st => !isLater(st))};
        keepTips(later.filter(st => resolveEls(st.els).length && resolveEls(st.els).every(findable)));
      }
    }
    else if (!tip) { const d = load(TIPS); if (d[SLUG]) { delete d[SLUG]; save(TIPS, d); } }   // the whole walkthrough covers them
    const wrap = o.grid.parentElement, layer = document.createElement("div"), ns = "http://www.w3.org/2000/svg";
    layer.className = "spot"; layer.tabIndex = 0; layer.setAttribute("role", "dialog"); layer.setAttribute("aria-live", "polite");
    document.body.append(layer);
    let k = -1, frame = 0, ticker = null, holes = [];
    // while an interactive step is up, a tap outside what it lights (and the bar) goes nowhere
    const guard = e => {
      if (!holes.length || e.target.closest && e.target.closest(".spotBar")) return;
      const x = e.clientX, y = e.clientY;
      if (!holes.some(([x1, y1, x2, y2]) => x >= x1 && x <= x2 && y >= y1 && y <= y2)) { e.preventDefault(); e.stopPropagation(); }
    };
    for (const ev of ["pointerdown", "click"]) window.addEventListener(ev, guard, true);
    const steps = () => o.steps;
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
      layer.classList.toggle("trying", !!(st.try && !st.tried));
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
      // An interactive step (st.try): the player does it on the real board. Only its lit squares and lit page elements
      // (a button to press first, say) take taps; a tap anywhere else does nothing (see guard, below).
      holes = st.try && !st.tried ? [
        ...(lit.length ? [[Math.min(...lit.map(([x]) => X(x))), Math.min(...lit.map(([, y]) => Y(y))), Math.max(...lit.map(([x]) => X(x + 1))), Math.max(...lit.map(([, y]) => Y(y + 1)))]] : []),
        ...els.map(r => [r.x, r.y, r.x + r.w, r.y + r.h]),
        ...shapes.filter(sh => sh.poly).map(sh => { const xs = sh.poly.map(p => p[0]), ys = sh.poly.map(p => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; })] : [];
      layer.dataset.holes = JSON.stringify(holes.map(h => h.map(Math.round)));   // where taps go through (handy for tests)
      // the bar: a dot for each step, and Skip (or, for a single tip, Got it)
      const bar = document.createElement("div"); bar.className = "spotBar";
      if (steps().length > 1) {
        const dots = document.createElement("span"); dots.className = "dots"; dots.setAttribute("aria-hidden", "true");
        steps().forEach((_, i) => { const d = document.createElement("i"); if (i === k) d.className = "on"; dots.append(d); });
        bar.append(dots);
      }
      else bar.style.paddingLeft = "6px";
      const skip = document.createElement("button"); skip.type = "button"; skip.textContent = steps().length > 1 ? "Skip" : "Got it";
      skip.addEventListener("pointerdown", e => e.stopPropagation()); skip.addEventListener("click", e => { e.stopPropagation(); end(); });
      bar.append(skip); bar.addEventListener("pointerdown", e => e.stopPropagation()); layer.append(bar);
      // the bar goes to the top when what the step lights is down by the bottom, so it never covers it
      if (els.some(r => r.y + r.h > H - 90) || lit.some(([, y]) => Y(y + 1) > H - 90)) { bar.style.bottom = "auto"; bar.style.top = "max(14px, env(safe-area-inset-top))"; }
      const say = document.createElement("div"); say.className = "say";
      say.style.left = `${b.left + b.width * 0.04}px`; say.style.width = `${b.width * 0.92}px`;
      const bw = document.createElement("b"); sayWith(bw, st.say);
      const tap = document.createElement("small");
      // "Tap to go on" only on the first step: after that the dots say there's more, and the fewer words the better
      tap.textContent = st.try && !st.tried ? (st.try.tip || "") : k === 0 && steps().length > 1 ? "Tap to go on" : "";
      if (!tap.textContent) tap.hidden = true;
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
      layer.setAttribute("aria-label", `${steps().length > 1 ? `Step ${k + 1} of ${steps().length}. ` : ""}${st.say}.${tap.textContent ? ` ${tap.textContent}.` : ""}`);
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
    function close() {
      clearInterval(ticker); removeEventListener("resize", redraw); removeEventListener("scroll", redraw); document.removeEventListener("pointerup", onUp, true);
      for (const ev of ["pointerdown", "click"]) window.removeEventListener(ev, guard, true);
      for (const f of new Set(o.steps.map(st => st.restore).filter(Boolean))) f();   // Your turn steps: the board as it was
      holes = []; layer.remove(); if (o.done) o.done();
    }
    // Skip (or Escape): the walkthrough ends here, and counts as seen; How to play has it all again.
    function end() { const was = o.steps[k]; if (was && was.leave) was.leave(); k = o.steps.length; close(); }
    // after a tap on an interactive step's squares: once it's done, say so in green and go on
    // (checked for a moment after each tap, as a move can finish after a short slide or animation)
    function tried(n = 0) {
      setTimeout(() => {
        const st = o.steps[k];
        if (!st || !st.try || st.tried) return;
        if (!st.try.done()) { if (n < 15) tried(n + 1); return; }
        st.tried = true; st.tone = "ok"; if (st.try.yes) st.say = st.try.yes;
        show(); setTimeout(() => { if (o.steps[k] === st) next(); }, st.try.yes ? 1400 : 350);   // a quick step needs no pause
      }, 60);
    }
    const onUp = () => tried(0);
    document.addEventListener("pointerup", onUp, true);
    function next(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      const was = o.steps[k]; if (was && was.leave) was.leave();
      if (++k >= o.steps.length) {   // all done: "Let's Play!" shows over the board and fades by itself
        close();
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
    layer.addEventListener("keydown", e => {
      if (e.key === "Escape") { e.preventDefault(); end(); }   // Escape cancels, as everywhere on Apple's platforms
      else if (e.key === " " || e.key === "Enter") next(e);   // on an interactive step too, so the keyboard never gets stuck
    });
    ticker = setInterval(() => { const st = o.steps[k]; if (st && (st.marks || []).some(m => Array.isArray(m[2]))) { frame++; show(); } }, 900);
    next(); layer.focus({preventScroll: true});
  }

  /* ---------- slower ---------- */
  // Slower (Apple asks games to offer difficulty accommodations, such as more time to react): a switch, #slowTgl, in an
  // action game's settings, kept on this device for each game; while it's on the game runs at two-thirds speed.
  // Returns a function giving the factor to stretch the game's times by (1, or 1.5 with Slower on).
  const SLOWER = "catdoku.slower.v1";
  function slower(slug) {
    const box = $("slowTgl");
    if (box) { box.checked = !!load(SLOWER)[slug]; box.addEventListener("change", () => { const d = load(SLOWER); d[slug] = box.checked; save(SLOWER, d); }); }
    return () => (box ? box.checked : !!load(SLOWER)[slug]) ? 1.5 : 1;
  }

  /* ---------- boards in words ---------- */
  // A board drawn as one picture (SVG or canvas) can't be explored square by square with VoiceOver, so it's described
  // in words instead: el (the board's box) becomes an image whose label says what's where, set again after every
  // move (and only when it changes); the drawing inside is hidden from VoiceOver. Moves themselves go by keyboard
  // (G.gridKeys) and are announced in the message line. at(i, W) says where square i is, as "row 2, column 3".
  function describe(el, text) {
    if (!el) return;
    // a board played with keys keeps its role (application, grid…); one that has none becomes an image
    if (!el.dataset.described) { el.dataset.described = "1"; if (!el.getAttribute("role")) el.setAttribute("role", "img");
      for (const k of el.querySelectorAll(":scope > svg, :scope > canvas, :scope > .grid > svg")) k.setAttribute("aria-hidden", "true"); }
    if (el.getAttribute("aria-label") !== text) el.setAttribute("aria-label", text);
    // an SVG board that is itself the thing played with keys: its drawing (letters, numbers) is hidden, the words say it
    if (el instanceof SVGElement) for (const k of el.children) if (!k.hasAttribute("aria-hidden")) k.setAttribute("aria-hidden", "true");
  }
  const at = (i, W) => `row ${Math.floor(i / W) + 1}, column ${i % W + 1}`;
  // a list in words: "a, b and c"
  const listed = (xs, sep = ", ") => xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(sep)}${sep === ", " ? " and " : sep}${xs[xs.length - 1]}`;   // ("; " between longer items)

  /* ---------- your turn ---------- */
  // Your turn steps in a walkthrough (st.try) are played on the real board; this keeps the game as it was before the
  // first of a run of them and puts it back after the last, or whenever the walkthrough ends (Skip included), so
  // nothing is given away or lost (clock, lives and undos too). get/set reach the page's game; redraw shows it again.
  // Put `...turn.from` on each step of the run and `...turn.upTo` on its last.
  function yourTurn(get, set, redraw) {
    let was = null;
    const putBack = () => {
      if (was != null && JSON.stringify(get()) !== was) { set(JSON.parse(was)); note(""); }
      was = null; if (redraw) redraw();
    };
    const from = {enter() { if (was == null) was = JSON.stringify(get()); }, restore: putBack};
    return {from, upTo: {...from, leave: putBack}, putBack};
  }

  /* ---------- tips ---------- */
  // The walkthrough's tool steps, kept back on a first visit (spotlight), come back one at a time as tips, as Apple's
  // guidance on tips asks (short, in context, at a reasonable pace, and only for people who'd benefit): the Hint tip
  // once a started puzzle has had no move for 45 seconds, the others a few seconds after the first move on the board in
  // a visit, at most one a day. A tip for something the player has already used is dropped unseen.
  (function tips() {
    const list = () => load(TIPS)[SLUG] || [];
    const drop = t => { const d = load(TIPS); d[SLUG] = (d[SLUG] || []).filter(x => x.say !== t.say); if (!d[SLUG].length) delete d[SLUG]; save(TIPS, d); };
    const isHint = t => t.els.some(f => f && f.id === "hintBtn");
    const free = () => !document.hidden && !document.querySelector(".spot") && !document.querySelector(".overlay.show");
    function show(t) {
      const els = t.els.map(f => f && findEl(f));
      if (!$("board") || els.some(e => !e || !e.offsetParent || e.disabled)) return false;
      spotlight({grid: $("board"), w: 1, h: 1, steps: [{say: t.say, els}], finish: false, done: () => drop(t)});
      return true;
    }
    document.addEventListener("click", e => {   // used it already: no need for its tip
      const el = e.target.closest && e.target.closest("[id]"); if (!el || el.closest(".spot")) return;
      for (const t of list()) if (t.els.some(f => f && f.id === el.id)) drop(t);
    }, true);
    // the first time a switch is turned on, its tip, pointing at the switch
    document.addEventListener("change", e => {
      const box = e.target; if (!box.matches || !box.matches("input[type=checkbox]") || !box.checked || !box.id) return;
      const key = SLUG + ":on", d = load(TIPS), t = (d[key] || []).find(x => x.els.some(f => f && f.id === box.id));
      if (!t) return;
      d[key] = d[key].filter(x => x !== t); if (!d[key].length) delete d[key];
      d[SLUG + ":shown"] = [...(d[SLUG + ":shown"] || []), t.say]; save(TIPS, d);
      setTimeout(() => { if (free() && $("board")) spotlight({grid: $("board"), w: 1, h: 1, steps: [{say: t.say, els: t.els.map(f => f && findEl(f)).filter(Boolean)}], finish: false}); }, 250);
    });
    let idle = 0;
    const playing = () => { const g = T && T.game(); return !!(g && g.started && T.playing(g)); };
    const poke = () => {
      clearTimeout(idle);
      if (!list().some(isHint)) return;
      idle = setTimeout(() => { const t = list().find(isHint); if (t && playing() && free() && show(t)) return; poke(); }, 45000);
    };
    for (const ev of ["pointerdown", "keydown"]) document.addEventListener(ev, poke, true);
    let waiting = false;
    document.addEventListener("pointerdown", e => {
      if (waiting || document.querySelector(".spot") || !e.target.closest || !e.target.closest("#board")) return;
      waiting = true;
      setTimeout(() => {
        if (Date.now() - (load(TIPS)._at || 0) < 20 * 3600e3) return;
        const t = list().find(x => !isHint(x));
        if (t && free() && show(t)) { const d = load(TIPS); d._at = Date.now(); save(TIPS, d); }
      }, 4000);
    }, true);
  })();

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
  // A hint's mark and words stay until the board or the puzzle changes (Apple: avoid things that go away on a timer,
  // which can leave too little time to take them in); a game can still pass ms for a mark that should go by itself.
  const HINT_MS = 0, HINT = {gold: "#ECA818", red: "#C8392B"};
  function hinter(o) {
    let mark = null, at = null, of = null, shown = 0, timer = 0, said = "";
    const same = () => o.game() === of && o.key() === at;
    return {
      level() { if (!same()) shown = 0; return shown; },
      show(m, say, {ms = HINT_MS, uncounted = false} = {}) {
        clearTimeout(timer);
        if (!same()) shown = 0;
        mark = m; at = o.key(); of = o.game(); if (!uncounted) shown++;
        o.draw(); if (say) { note(say, ms); said = say; }
        if (ms) timer = setTimeout(() => { if (mark === m) { mark = null; o.draw(); } }, ms);
      },
      // the mark to draw, while the board is as it was when it was shown
      current() {
        if (mark && !same()) { mark = null; if (said && $("msg") && $("msg").textContent === said) note(""); said = ""; }   // its words go with it
        return mark;
      },
      clear(redraw = true) { clearTimeout(timer); if (mark) { mark = null; if (redraw) o.draw(); } },
    };
  }

  /* ---------- what a word means ---------- */
  // A word's meanings from Wiktionary (this needs the internet): up to three, each {pos (noun, verb…), text}, for
  // Keyboard Cat's clues and Fish Bones' word list. Rejects when there are none or Wiktionary can't be reached.
  // Asked again, a word comes from memory.
  function plainText(html) { const d = document.createElement("div"); d.innerHTML = html; d.querySelectorAll("sup, .reference, style").forEach(x => x.remove()); return d.textContent.replace(/\s+/g, " ").trim(); }
  const meanings = {};
  function meaning(w) {
    return meanings[w] || (meanings[w] = fetch(`https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(w)}`).then(async r => {
      if (!r.ok) throw new Error(r.status);
      const out = [];
      // English meanings only: Wiktionary lists a word's Translingual entries with them (GAP and ICE are language
      // codes), and those come as symbols. A meaning that opens a list of examples ends in a colon there; drop it.
      for (const sense of (await r.json()).en || []) {
        if ((sense.language || "English") !== "English" || /^symbol$/i.test(sense.partOfSpeech || "")) continue;
        for (const d of sense.definitions || []) {
          const text = plainText(d.definition || "").replace(/\s*:$/, "");
          if (text && !/^ISO \d/.test(text) && out.length < 3) out.push({pos: sense.partOfSpeech, text});
        }
      }
      if (!out.length) throw new Error("none");
      return out;
    }).catch(e => { delete meanings[w]; throw e; }));
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

  /* ---------- the action buttons: icons with small words under them ---------- */
  // Every game's row of action buttons (Hint, Undo, Restart, the game's own, Share, Toys, Best times, How to play)
  // and Twirl's zoom buttons show as icons with their word small underneath, as Toydoku's tools do. An icon is picked
  // by the button's id, or by data-icon where one id means different things in different games (Mark). The helper
  // rows (Bubbles, Toy Box, Bird Watch), New and the level pickers stay as buttons. Change a tool's word with
  // relabel(), not textContent, or the icon goes.
  const ICON = {
    hint: '<path d="M11 20a8 8 0 1 1 10 0c-1 1-1.5 2-1.5 3h-7c0-1-.5-2-1.5-3z"/><path d="M13 27h6"/>',
    undo: '<path d="M9 7v6h6"/><path d="M9.5 13A9 9 0 1 1 9 21"/>',
    restart: '<path d="M25 16a9 9 0 1 1-2.6-6.4"/><path d="M23 4v6h-6"/>',
    audit: '<circle cx="14" cy="14" r="9"/><path d="M21 21l6 6"/><path d="M10 14l3 3 5-6"/>',
    undoguess: '<path d="M9 7v6h6"/><path d="M9.5 13A9 9 0 1 1 9 21"/><path d="M16 12h6v10l-3-2.2-3 2.2z"/>',   // back to bookmark
    pencil: '<path d="M21 5l6 6-14 14H7v-6z"/><path d="M18 8l6 6"/><path d="M7 27h18"/>',
    pencils: '<path d="M23 5l5 5-12 12h-5v-5z"/><path d="M20 8l5 5"/><path d="M4 9h7M4 14h5M4 27h20"/>',
    erase: '<path d="M18 6l8 8-11 11H9l-4-4z"/><path d="M12 12l8 8"/><path d="M15 25h11"/>',
    pause: '<path d="M11 7v18M21 7v18"/>',
    play: '<path d="M10 6l16 10-16 10z"/>',
    guess: '<path d="M9 5h14v22l-7-5-7 5z"/>',   // a bookmark (the Bookmark button, once called Guess)
    giveup: '<path d="M8 6h15l-3 5 3 5H8z" class="white"/><path d="M8 28V5"/>',
    cat: '<path d="M7 13L8 4l6 5h4l6-5 1 9c2 4 1 9-3 11-3 2-11 2-14 0-4-2-5-7-2-11z"/><path d="M12.5 17v.5M19.5 17v.5M14.5 21.5h3"/>',
    marks: '<path d="M5 10l8 8M13 10l-8 8"/><path d="M18 11h9M18 17h9"/>',
    keep: '<circle cx="16" cy="16" r="10" class="green"/>',
    shuffle: '<path d="M4 10h5c7 0 8 12 15 12h4"/><path d="M24 18l4 4-4 4"/><path d="M4 22h5c2 0 3.5-1.5 5-3.5M18 12.5c1.5-1.5 3-2.5 6-2.5h4"/><path d="M24 6l4 4-4 4"/>',
    flip: '<path d="M16 4v24"/><path d="M12 8L4 22h8z"/><path d="M20 8l8 14h-8z"/>',
    near: '<path d="M6 12.5c3-3 6 3 10 0s7 3 10 0M6 19.5c3-3 6 3 10 0s7 3 10 0"/>',
    check: '<circle cx="16" cy="16" r="11"/><path d="M11 16.5l3.5 3.5 6.5-7.5"/>',
    skip: '<path d="M7 7l12 9-12 9z"/><path d="M24 7v18"/>',
    share: '<path d="M16 4v15"/><path d="M10 10l6-6 6 6"/><path d="M9 15H8v12h16V15h-1"/>',
    toys: '<circle cx="16" cy="16" r="10"/><path d="M7 12c6 2.5 12 2.5 18 0M7.5 21c5-2.5 12-2.5 17 0M16 6c-3 6-3 14 0 20"/>',
    best: '<path d="M10 5h12v6a6 6 0 0 1-12 0z"/><path d="M10 8H6v1.5a4 4 0 0 0 4 4M22 8h4v1.5a4 4 0 0 1-4 4"/><path d="M16 17v5"/><path d="M11 27h10M13 22h6v5h-6z"/>',
    help: '<circle cx="16" cy="16" r="11"/><path d="M12.5 12.5a3.5 3.5 0 1 1 5 3.2c-1 .5-1.5 1.3-1.5 2.3V19"/><path d="M16 23v.2"/>',
    zoomin: '<circle cx="14" cy="14" r="9"/><path d="M21 21l6 6"/><path d="M14 10v8M10 14h8"/>',
    zoomout: '<circle cx="14" cy="14" r="9"/><path d="M21 21l6 6"/><path d="M10 14h8"/>',
    fit: '<path d="M5 11h6V5M27 11h-6V5M5 21h6v6M27 21h-6v6"/>',
    plus: '<path d="M16 7v18M7 16h18"/>',
    level: '<path d="M5 26h6v-6h6v-6h6V8h4"/>',
    go: '<circle cx="16" cy="16" r="11"/><path d="M11 16h10M17 11.5l4.5 4.5-4.5 4.5"/>',
    peek: '<path d="M3 16s5-8 13-8 13 8 13 8-5 8-13 8S3 16 3 16z"/><circle cx="16" cy="16" r="4"/>',
    sight: '<circle cx="16" cy="16" r="10"/><circle cx="16" cy="16" r="4.5"/><path d="M16 3v5M16 24v5M3 16h5M24 16h5"/>',
    catnip: '<path d="M7 25C7 13 14 6 26 6c0 12-7 19-19 19z"/><path d="M7 25l11-11"/>',
    swat: '<path d="M9 21c0-4 3-6 7-6s7 2 7 6-3 5-7 5-7-1-7-5z"/><circle cx="8" cy="12" r="2.6"/><circle cx="13" cy="7.5" r="2.6"/><circle cx="19" cy="7.5" r="2.6"/><circle cx="24" cy="12" r="2.6"/>',
    net: '<path d="M4 9h24M4 16h24M4 23h24M9 5v22M16 5v22M23 5v22"/>',
    roller: '<rect x="5" y="5" width="17" height="9" rx="3"/><path d="M22 9.5h4.5V19H15v4"/><rect x="12.5" y="23" width="5" height="6" rx="1.2"/>',
    bubbleshake: '<circle cx="13" cy="18" r="7"/><circle cx="23" cy="9" r="3.5"/><path d="M24 20l3 2M25 15.5h3.5"/>',
    basketshake: '<path d="M6 14h20l-2.5 11h-15z"/><path d="M11 14l4-6M21 14l-4-6"/><path d="M3 10l2 2M29 10l-2 2M3 18l2-1M29 18l-2-1"/>',
    losecolor: '<path d="M5 21a11 11 0 0 1 22 0"/><path d="M9.5 21a6.5 6.5 0 0 1 13 0"/><path d="M19 27h9"/>',
    basketadd: '<path d="M4 14h17l-2.2 11H6.2z"/><path d="M8 14l3.5-6M17 14l-3.5-6"/><path d="M26 9v8M22 13h8"/>',
    wipe: '<rect x="5" y="5" width="22" height="22" rx="2"/><path d="M16 5v22M5 16h22"/><path d="M8.5 24C12 17 18 12 24.5 9.5" class="swipe"/>',
    keyboard: '<rect x="3" y="9" width="26" height="15" rx="3"/><path d="M8 14h.2M12 14h.2M16 14h.2M20 14h.2M24 14h.2M10 19h12"/>',
    left: '<path d="M11 9h15M11 16h15M11 23h15"/><path d="M5.5 9h.2M5.5 16h.2M5.5 23h.2"/>',
    pairs: '<path d="M4 25l5-15 5 15M6 20h6"/><path d="M19 10v15"/><circle cx="23" cy="20.5" r="4.5"/>',
    marks: '<path d="M9 21l4-4 9-9 4 4-9 9-4 4h-4z"/><path d="M5 28h22"/>',
    sliders: '<path d="M5 9h22M5 16h22M5 23h22"/><circle cx="11" cy="9" r="2.6"/><circle cx="21" cy="16" r="2.6"/><circle cx="14" cy="23" r="2.6"/>',
    games: '<rect x="6" y="6" width="8" height="8" rx="2"/><rect x="18" y="6" width="8" height="8" rx="2"/><rect x="6" y="18" width="8" height="8" rx="2"/><rect x="18" y="18" width="8" height="8" rx="2"/>',
    palette: '<path d="M16 5C9.5 5 5 9.5 5 15.5S9.5 27 15 27c2 0 2.5-1.2 2-2.6-.6-1.6.4-3.4 2.4-3.4H23c2.5 0 4-1.8 4-4.4C27 9.8 22.5 5 16 5z"/><circle cx="11" cy="14" r="1.3"/><circle cx="15" cy="10" r="1.3"/><circle cx="20.5" cy="11" r="1.3"/>',
  };
  const ICON_OF = {hintBtn: "hint", undoBtn: "undo", backBtn: "undoguess", restartBtn: "restart", auditBtn: "audit", notesBtn: "pencil",
    allNotesBtn: "pencils", clearNotesBtn: "erase", eraseBtn: "erase", pauseBtn: "pause", guessBtn: "guess", giveUpBtn: "giveup",
    keepBtn: "keep", shuffleBtn: "shuffle", flipBtn: "flip", finishBtn: "near", completeBtn: "check", skipBtn: "skip",
    colBtn: "palette", linkBtn: "share", toysBtn: "toys", bestBtn: "best", helpBtn: "help", zoomIn: "zoomin", zoomOut: "zoomout", zoomFit: "fit",
    sightBtn: "sight", nipBtn: "catnip", shakeBtn: "bubbleshake", fluffBtn: "roller", swatBtn: "swat", netBtn: "net", rainbowBtn: "losecolor", basketBtn: "basketadd", wipeBtn: "wipe",
    chooseBtn: "keyboard", revealBtn: "giveup", peekBtn: "peek"};
  // buttons that keep their own look with an icon in front of the word: every New (a +) and Catlas's Go (an arrow)
  const LEAD = {newBtn: "plus", sNewBtn: "plus", goBtn: "go", settingsSum: "sliders"};
  const iconSVG = name => `<svg class="ic" viewBox="0 0 32 32" aria-hidden="true">${ICON[name]}</svg>`;
  function relabel(b, text, icon) {
    const l = b.querySelector(".lbl");
    if (!l) { b.textContent = text; return; }
    l.textContent = text;
    if (icon && ICON[icon]) b.querySelector(".ic").outerHTML = iconSVG(icon);
  }
  function toolify() {
    for (const [id, name] of Object.entries(LEAD)) {
      const b = document.getElementById(id); if (!b || b.querySelector(".ic")) continue;
      b.innerHTML = iconSVG(name) + `<span class="lbl">${b.textContent.trim()}</span>`; b.classList.add("lead");
    }
    for (const b of document.querySelectorAll("main .bar > #chooseBtn")) makeTool(b);
    // the Level (or Size, or Round) picker: a step icon in place of its word; the menu keeps the word as its name
    for (const sel of document.querySelectorAll("main .bar label > select#levelSel, main .bar label > select#size")) {
      const label = sel.parentElement;
      for (const n of [...label.childNodes]) if (n.nodeType === 3) n.remove();
      label.insertAdjacentHTML("afterbegin", iconSVG("level")); label.classList.add("picker");
      if (!sel.getAttribute("aria-label")) sel.setAttribute("aria-label", "Level");
      label.title = sel.getAttribute("aria-label");
    }
    for (const row of document.querySelectorAll("main .actions, main .zoom")) {
      if (row.closest(".wall")) continue;   // Cat Burglar's zoom sits on the painting
      let any = false;
      for (const b of row.querySelectorAll(":scope > button")) any = makeTool(b) || any;
      if (any) row.classList.add("tools");
    }
  }
  // One button as a tool: its icon, then its word (data-label, or its own words without an emoji the icon now stands
  // for); a count it carries in a <b> (a helper's uses left) stays, as a badge on the icon's corner.
  function makeTool(b) {
    const name = b.dataset.icon || ICON_OF[b.id];
    if (!name || !ICON[name]) return false;
    const count = b.querySelector("b"), copy = b.cloneNode(true); copy.querySelector("b")?.remove();
    const text = copy.textContent.trim(), words = (b.dataset.label || (text.length > 1 ? text : b.getAttribute("aria-label") || text))
      .replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF\uFE0F]/gu, "").replace(/\s+/g, " ").trim();
    b.innerHTML = iconSVG(name) + `<span class="lbl">${words}</span>`;
    if (count) { count.classList.add("count"); b.append(count); }
    b.classList.add("tool"); return true;
  }
  toolify();

  /* ---------- bookmarks (guesses) ---------- */
  // Bookmark (called Guess until 2026-11; the code keeps the old names), as in Toydoku and Fair Play, for a game whose
  // moves go on an Undo list (game.history): Bookmark marks the board as it is, and the next thing put on it glows
  // violet; Back to bookmark takes everything back to the latest bookmark in one tap, through the game's own Undo (so it costs what Undo costs). A guess is kept as {i, at}: the square
  // and how long the Undo list was before it, so plain Undo past it, or the square being emptied, ends it.
  // o: {game: () => game, undo (one step), draw (after a change), board (the element that shows it's armed), what
  // ("toy", "number"…: for the note line), over (() => true once the puzzle's finished; game.won if not given),
  // moves (the Undo list, if it isn't game.history)}. Call before(i) just before the move that fills square i goes on the Undo
  // list; draw the glow on each of list(); clear() on Restart; sync() wherever the buttons are brought up to date.
  function guesser(o) {
    let armed = false;
    const g = () => o.game(), btn = $("guessBtn"), back = $("backBtn"), hist = gm => o.moves ? o.moves(gm) : gm.history;
    const list = () => { const gm = g(); if (!gm) return []; gm.guesses = (gm.guesses || []).filter(x => x.at < hist(gm).length); return gm.guesses; };
    const sync = () => {
      const gm = g(), done = !gm || (o.over ? o.over() : gm.won);
      if (done) armed = false;
      btn.setAttribute("aria-pressed", String(armed)); btn.disabled = done;
      back.hidden = done || !list().length;
      if (o.board) o.board.classList.toggle("guessing", armed);
    };
    btn.onclick = () => {
      const gm = g(); if (!gm || (o.over ? o.over() : gm.won)) return;
      armed = !armed; sync(); if (armed) note(`Bookmarked: the next ${o.what || "one"} you put in glows, and Back to bookmark returns here`, 3500); else note("");
    };
    back.onclick = () => {
      const gm = g(), gs = list(); if (!gm || (o.over ? o.over() : gm.won) || !gs.length) return;
      const to = gs[gs.length - 1].at;
      while (hist(gm).length > to) { const n = hist(gm).length; o.undo(); if (hist(gm).length >= n) break; }
      armed = false; list(); o.draw(); note("Back at your bookmark.", 3000);
    };
    return {
      before(i) { const gm = g(); if (!armed || !gm) return; armed = false; list().push({i, at: hist(gm).length}); },
      list: () => list().map(x => x.i),
      armed: () => armed,
      disarm() { armed = false; },
      clear() { const gm = g(); if (gm) gm.guesses = []; armed = false; },
      sync,
    };
  }

  /* ---------- sideways ---------- */
  // True while a phone held sideways has the board on the left and the rest beside it (games.css, main > .stage),
  // for a page that sizes its board in script.
  const SIDEWAYS = "(orientation:landscape) and (max-height:500px)";
  function sideways() {
    return matchMedia(SIDEWAYS).matches && !document.body.classList.contains("full") && !!document.querySelector("main > .stage");
  }

  /* ---------- full screen ---------- */
  // A game's board filling the screen, for games whose board gains from the room (a big mat to look around, a
  // painting). The browser's own full screen where it has one (not on an iPhone), and the page filling the window
  // either way: body.full, with the title and menu put away (games.css); each game lays out the rest. The button
  // gets its icon here; it, F, or Escape goes in and out. o: {btn, name (for the dashboard),
  // change(on, toggled) (lay out again; toggled when it went in or out, not when the window only changed)}
  function fullScreen(o) {
    const isOn = () => document.body.classList.contains("full");
    const screenFull = () => document.fullscreenElement || document.webkitFullscreenElement;
    o.btn.classList.add("fsBtn");
    o.btn.innerHTML = '<svg class="enter" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 8V3h5M12 3h5v5M17 12v5h-5M8 17H3v-5"/></svg>' +
      '<svg class="leave" viewBox="0 0 20 20" aria-hidden="true"><path d="M8 3v5H3M17 8h-5V3M12 17v-5h5M3 12h5v5"/></svg>' +
      (o.btn.closest(".tools, .bar") ? '<span class="lbl">Full screen</span>' : "");   // with the tools or settings, a word under it too
    if (o.btn.closest(".tools, .bar")) o.btn.classList.add("tool");
    const label = on => { o.btn.setAttribute("aria-label", on ? "Leave full screen" : "Full screen"); o.btn.title = on ? "Leave full screen (F)" : "Full screen (F)"; };
    function set(on) {
      document.body.classList.toggle("full", on);
      label(on);
      const el = document.documentElement;
      try {
        if (on && !screenFull()) { const go = el.requestFullscreen || el.webkitRequestFullscreen; if (go) Promise.resolve(go.call(el)).catch(() => {}); }
        if (!on && screenFull()) { const leave = document.exitFullscreen || document.webkitExitFullscreen; Promise.resolve(leave.call(document)).catch(() => {}); }
      } catch (e) {}
      if (on) track(`${o.name} full screen`);
      o.change(on, true);
    }
    // only the button's label to start with: the game may not have its puzzle out yet (a saved one is reopened
    // later), so change() waits for full screen to be turned on or off
    label(false);
    o.btn.addEventListener("click", () => set(!isOn()));
    document.addEventListener("keydown", e => {
      if (e.ctrlKey || e.metaKey || e.altKey || document.querySelector(".spot") || $("overlay").classList.contains("show") || /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) return;
      if (e.key === "f" || e.key === "F") set(!isOn());
      else if (e.key === "Escape" && isOn() && !screenFull()) set(false);
    });
    // leaving the browser's full screen (Escape, or a swipe) leaves the game's too
    const changed = () => { if (!screenFull() && isOn()) set(false); else o.change(isOn(), false); };
    document.addEventListener("fullscreenchange", changed);
    document.addEventListener("webkitfullscreenchange", changed);
    return {on: isOn, set};
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

  return {GAMES, GROUPS, SHELF_COLOUR, onShelf, favorites, favStar, matches, $, nav, daily, dailyStreak, dailyDoneToday, dailyWon, dailyLine, load, save, builder, openCard, closeCard, winCard, homeBtn, sizeUp, otherSize, note, helpLater, cellAt, hinter, HINT, HINT_MS, gridKeys, nearestThatWay, CURSOR, track, reopen, fullScreen, sideways, relabel, icon: iconSVG, guesser, yourTurn, describe, at, listed, slower, meaning, plainText,
          setupTimer, freshClock, streak, breakStreak, spotlight, toysOff, saveToys, needToys, goldPaw, goldPaws, mastered, masterPill, shareResult, checkClock, finishClock, timeLineEl, showBests, readShare, offerShare, shareCard, sendLink, toyPicker, pickLook};
})();
