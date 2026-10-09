/* Shared helpers for the Catdoku family of games: links between games,
   saved progress, background puzzle building, and the win card. */
const G = (() => {
  // Every game: name, folder, one line about it, and its colour in the games menu.
  const GAMES = [
    ["Catdoku", "catdoku", "One cat in every row, column and region", "#BD5538"],
    ["Yarn", "yarn", "Lead one strand through every ball", "#E16A4A"],
    ["Patches", "patches", "Sew a four-fabric quilt", "#73A7AE"],
    ["Sunbeams", "sunbeams", "Every cat gets a warm spot", "#ECA818"],
    ["Toy Box", "toybox", "Put every toy back in its basket", "#B3B94B"],
    ["Pounce", "pounce", "Swap toys and line up three of a kind", "#6AA673"],
    ["Twirl", "twirl", "Pull every ribbon off the mat", "#B94588"],
    ["Toe Beans", "toebeans", "Make the number on the big pad", "#DD9DAD"],
    ["Knock It Off", "knockitoff", "Push everything off the table", "#7885BA"],
    ["Hide & Seek", "hideseek", "Find every cat hiding in the boxes", "#C9A26B"],
    ["Nip Trip", "niptrip", "Zen out and play with colour", "#9874CA"],
    ["Tangle", "tangle", "Untangle the yarn the cat got into", "#3C8681"],
    ["Catwalk", "catwalk", "Link the perches of a giant cat tower", "#A98663"],
    ["Toy Tango", "tango", "Share two toys out fairly", "#B94588"],
  ];
  const $ = id => document.getElementById(id);

  // The games menu: an "All games" button that opens a grid of every game, with this one marked.
  // Game pages sit one folder below the Catdoku root, so links start with ../ unless `base` says otherwise.
  function nav(current, base = "../") {
    const el = $("games"); el.innerHTML = "";
    const btn = document.createElement("button");
    btn.className = "gamesBtn"; btn.type = "button";
    btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-controls", "gamesPanel");
    btn.innerHTML = `<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>All ${GAMES.length} games<span class="caret" aria-hidden="true">▾</span>`;
    const panel = document.createElement("div");
    panel.className = "gamesPanel"; panel.id = "gamesPanel"; panel.hidden = true;
    for (const [name, slug, blurb, color] of GAMES) {
      const a = document.createElement("a");
      a.className = "gameTile"; a.style.setProperty("--tile", color);
      a.href = slug === "catdoku" ? base || "./" : `${base}${slug}/`;
      if (slug === current) a.setAttribute("aria-current", "page");
      const b = document.createElement("b"); b.textContent = name;
      const sm = document.createElement("small"); sm.textContent = slug === current ? "You're here" : blurb;
      a.append(b, sm); panel.append(a);
    }
    const show = open => { panel.hidden = !open; btn.setAttribute("aria-expanded", String(open)); };
    btn.onclick = e => { e.stopPropagation(); show(panel.hidden); };
    document.addEventListener("click", e => { if (!panel.hidden && !el.contains(e.target)) show(false); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !panel.hidden) { show(false); btn.focus(); } });
    el.append(btn, panel);
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
  // the admire button.
  // After admiring, point to the page's own new-puzzle button (New floor, New table…), or the level list.
  const admireNote = () => $("newBtn") ? `Done! Tap ${$("newBtn").textContent.trim()} when you're ready for another.` : "Done! Pick a level when you're ready for another.";
  function winCard(text, onNext, admire = "Admire my board", result, o = {}) {
    const media = document.createElement("div");
    const p = document.createElement("p"); p.textContent = text;
    const name = document.createElement("p"); name.className = "catname";
    name.textContent = `Meet ${NAMES[Math.floor(Math.random() * NAMES.length)]}!`;
    const tl = timeLineEl(result); if (tl) media.append(tl);
    media.append(p, catPhoto(), name);
    const btns = [[o.next || "New puzzle", onNext, true]];
    if (admire !== null) btns.push([admire, () => { closeCard(); note(admireNote(), 0); }]);
    openCard(o.title || "Solved!", "", btns, media, o.after);
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
    .card .timeline{font-weight:800;color:var(--ink);margin:0 0 12px}
    .bests{width:100%;border-collapse:collapse;margin:0 0 14px;font-variant-numeric:tabular-nums;color:var(--ink)}
    .bests th,.bests td{padding:4px 6px;text-align:left;border-bottom:1px solid var(--line)}
    .bests th{font-size:13px;color:var(--ink-soft);font-weight:600}
    .bests td.num,.bests th.num{text-align:right}
    .bests tr.now td{font-weight:800}
    .card h3{margin:4px 0 6px;font-size:18px}`;
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
      if (g && g.timed && g.started && T.playing(g) && !document.hidden && !$("overlay").classList.contains("show")) g.ms = (g.ms || 0) + dt;
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
    if (!g.timed) return (g.result = {ms: null});
    const all = load(BESTS), mine = (all[T.name] = all[T.name] || {}), row = (mine[g.N] = mine[g.N] || {solves: 0, times: []});
    const before = row.times.length ? row.times[0].ms : null;
    row.solves++;
    row.times.push({ms: g.ms, d: new Date().toISOString().slice(0, 10)});
    row.times.sort((a, b) => a.ms - b.ms); row.times = row.times.slice(0, KEEP);
    save(BESTS, all);
    return (g.result = {ms: g.ms, best: before, isBest: before === null || g.ms < before});
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
  // The Share card: a fresh copy of the puzzle, or the puzzle with the moves so far.
  function shareCard(o) {
    const send = async (data, what) => {
      const url = shareUrl(data);
      track(`${o.name} shared${what ? " " + what : ""}`);
      if (navigator.share) {
        const text = !data.p ? `Try this ${o.name} puzzle!` : o.won ? `Here's my finished ${o.name} puzzle!` : `Can you help me with this ${o.name} puzzle?`;
        try { await navigator.share({title: o.name, text, url}); closeCard(); return; }
        catch (e) { if (e.name === "AbortError") return; }
      }
      try { await navigator.clipboard.writeText(url); closeCard(); note("Link copied. Paste it into a message.", 5000); return; } catch (e) {}
      // No share sheet and no clipboard: show the link to copy by hand.
      const box = document.createElement("textarea"); box.value = url; box.readOnly = true; box.rows = 4;
      box.style.cssText = "width:100%;font:inherit;font-size:13px;margin:0 0 14px;border:2px solid var(--line);border-radius:8px;padding:6px";
      openCard("Copy this link", "Select the link and copy it into a message.", [["Done", closeCard, true]], box);
      box.focus(); box.select();
    };
    const won = o.won;
    openCard("Share this puzzle", "Send a link so someone else can play this exact puzzle.", [
      ["Share this puzzle", () => send(o.puzzle(), ""), true],
      [won ? "Share my solved board" : "Share with my progress", () => send(Object.assign(o.puzzle(), {p: o.progress()}), "with progress")],
      ["Cancel", closeCard],
    ]);
  }

  /* ---------- choosing toys ---------- */
  // The toy pictures a game uses, in colour order (each colour is one kind of toy). Tap one to leave it
  // out. o: {kinds (each {looks: [[picture, name]…]}), off (picture names left out), min (colours that
  // must keep a picture), src(picture) for its address, save(off)}.
  function toyPicker(o) {
    const off = new Set(o.off), media = document.createElement("div"), grid = document.createElement("div");
    const tip = document.createElement("p"); tip.className = "tip"; tip.textContent = "Tap a toy to leave it out.";
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
    openCard("Your toys", "", [["Save", () => { closeCard(); o.save(off); }, true], ["Cancel", closeCard]], media);
    const save = $("card").querySelector(".btns button");
    function check() {
      const n = o.kinds.filter(k => k.looks.some(([f]) => !off.has(f))).length, short = n < o.min;
      save.disabled = short; count.classList.toggle("bad", short);
      count.textContent = short ? `Keep toys in at least ${o.min} colours (${n} now).` : `${n} of ${o.kinds.length} colours in play.`;
    }
    check();
  }
  // Which of a kind's pictures to show, picked from those not left out (any, if all are).
  function pickLook(k, off) {
    const ok = k.looks.map((_, j) => j).filter(j => !off.has(k.looks[j][0])), from = ok.length ? ok : k.looks.map((_, j) => j);
    return from[Math.floor(Math.random() * from.length)];
  }

  let msgTimer = null;
  function note(text, ms) {
    clearTimeout(msgTimer);
    $("msg").textContent = text || "";
    if (text && ms !== 0) msgTimer = setTimeout(() => note(""), ms || 3500);
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

  return {$, nav, load, save, builder, openCard, closeCard, winCard, sizeUp, otherSize, note, cellAt, track, reopen,
          setupTimer, freshClock, checkClock, finishClock, timeLineEl, showBests, readShare, offerShare, shareCard, toyPicker, pickLook};
})();
