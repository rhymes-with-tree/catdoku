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
    ["Twirl", "twirl", "Send every ribbon off the mat", "#B94588"],
    ["Toe Beans", "toebeans", "Make the number on the big pad", "#DD9DAD"],
    ["Knock It Off", "knockitoff", "Push everything off the table", "#7885BA"],
    ["Hide & Seek", "hideseek", "Find every cat hiding in the boxes", "#C9A26B"],
    ["Nip Trip", "niptrip", "Zen out and play with colour", "#9874CA"],
    ["Tangle", "tangle", "Untangle the yarn the cat got into", "#3C8681"],
    ["Catwalk", "catwalk", "Link the perches of a giant cat tower", "#A98663"],
    ["Fair Play", "tango", "Share two toys out fairly", "#B94588"],
    ["Bubbles", "bubbles", "Bat bubbles up and pop three of a kind", "#5FA0C8"],
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
  // A perfect clear (no help, nothing lost, no undo) earns a gold paw: o.gold puts one on the win card.
  const PAW = "M100 6 C126 6 141 28 153 46 C172 50 197 70 195 101 C193 133 166 147 140 141 C125 138 112 131 100 131 C88 131 75 138 60 141 C34 147 7 133 5 101 C3 70 28 50 47 46 C59 28 74 6 100 6Z";
  function goldPaw() {
    const box = document.createElement("div");
    box.innerHTML = `<svg class="goldpaw" viewBox="-3 -3 106 92" aria-hidden="true"><g fill="#E0A526" stroke="#2A2530" stroke-width="2.5">
      ${[[16.5, 30.5, -24], [38.5, 15, -8], [61.5, 15, 8], [83.5, 30.5, 24]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="9.5" ry="10.75" transform="rotate(${r} ${x} ${y})" vector-effect="non-scaling-stroke"/>`).join("")}
      <path d="${PAW}" transform="translate(19 35.3) scale(.31 .298)" vector-effect="non-scaling-stroke"/></g></svg>`;
    return box.firstChild;
  }
  function winCard(text, onNext, admire = "Admire my board", result, o = {}) {
    const media = document.createElement("div");
    if (o.gold) media.append(goldPaw());
    const p = document.createElement("p"); p.textContent = text;
    const name = document.createElement("p"); name.className = "catname";
    name.textContent = `Meet ${NAMES[Math.floor(Math.random() * NAMES.length)]}!`;
    const tl = timeLineEl(result); if (tl) media.append(tl);
    media.append(p);
    // how to earn the gold paw, when this one missed it
    if (!o.gold && o.goldTip) { const g = document.createElement("p"); g.className = "goldtip"; g.textContent = o.goldTip; media.append(g); }
    media.append(catPhoto(), name);
    const btns = [[o.next || "New puzzle", onNext, true]];
    if (admire !== null) btns.push([admire, () => { closeCard(); note(admireNote(), 0); }]);
    openCard(o.gold ? "Gold paw!" : o.title || "Solved!", "", btns, media, o.after);
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
    .card .goldtip{font-size:14px;color:var(--ink-soft)}
    .card .timeline{font-weight:800;color:var(--ink);margin:0 0 12px}
    .bests{width:100%;border-collapse:collapse;margin:0 0 14px;font-variant-numeric:tabular-nums;color:var(--ink)}
    .bests th,.bests td{padding:4px 6px;text-align:left;border-bottom:1px solid var(--line)}
    .bests th{font-size:13px;color:var(--ink-soft);font-weight:600}
    .bests td.num,.bests th.num{text-align:right}
    .bests tr.now td{font-weight:800}
    .card h3{margin:4px 0 6px;font-size:18px}
    .card ol.steps{text-align:left;margin:0 0 14px;padding-left:24px;color:var(--ink);font-size:16px;line-height:1.35}
    .card ol.steps li{margin:0 0 8px;display:list-item}
    .card .tip{font-size:14px;margin:0 0 14px}
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
  // put marks on squares (a 🐱, ❌…; a list of marks takes turns), and says one line over the board.
  // A tap or Space shows the next step; after the last, "Let's Play!" shows and `done` runs.
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
        const t = svgEl("text", {x: X(x + 0.5), y: Y(y + 0.56), "text-anchor": "middle", "dominant-baseline": "middle",
          "font-size": cw * (size || (m === "❌" ? 0.42 : 0.56))});
        t.textContent = Array.isArray(m) ? m[frame % m.length] : m; svg.append(t);
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
          if (/\p{Extended_Pictographic}/u.test(bit)) { const e = document.createElement("span"); e.className = "emo"; e.textContent = bit; w.append(e); }
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
    layer.addEventListener("pointerdown", next);
    layer.addEventListener("keydown", e => { if (e.key === " " || e.key === "Enter" || e.key === "Escape") next(e); });
    ticker = setInterval(() => { const st = o.steps[k]; if (st && (st.marks || []).some(m => Array.isArray(m[2]))) { frame++; show(); } }, 900);
    next(); layer.focus({preventScroll: true});
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
          setupTimer, freshClock, spotlight, toysOff, saveToys, needToys, goldPaw, checkClock, finishClock, timeLineEl, showBests, readShare, offerShare, shareCard, toyPicker, pickLook};
})();
