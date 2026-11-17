/* The move to lapcatpuzzles.com (2026-11). The site used to live at rhymes-with-tree.github.io/catdoku/, and a
   browser keeps saved games, bests, streaks and settings apart for each address, so players' progress has to be
   carried across. Every page loads this first, before anything reads or writes saved data.

   At the old address: a page goes straight on to the same page at the new one, with everything saved (the keys
   starting "catdoku.", and GoatCounter's "skipgc") packed into the link after #move=. The part after # never
   leaves the device: browsers don't send it to the server.
   Except in a home-screen app, which keeps its own saved data apart from Safari's, so a link opened from it may
   land somewhere the new icon can't see. There, and at ?progress (for anyone else who needs it), the page shows
   a note about the move instead, with a progress code to copy and paste into the new site's Settings.

   At the new address: a #move= link is unpacked into this device's saved data and taken off the address before
   the page's own scripts run. The first time anything is brought over, it replaces what's here (a few minutes on
   the new site is worth less than everything played before); later links only fill in what's missing. A code
   pasted into Settings (LCP.move.bring) always replaces. GoatCounter is told each page's path with /catdoku in
   front, as at the old address, so the numbers carry on in one line. */
(function () {
  var OLD_HOST = "rhymes-with-tree.github.io", OLD_BASE = "/catdoku", NEW = "https://lapcatpuzzles.com";
  var MOVED = "catdoku.moved.v1";
  var mine = function (k) { return k === "skipgc" || k.indexOf("catdoku.") === 0; };

  function pack() {
    var d = {}, n = 0;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (mine(k) && k !== MOVED) { d[k] = localStorage.getItem(k); n++; }
      }
    } catch (e) {}
    if (!n) return "";
    return btoa(unescape(encodeURIComponent(JSON.stringify(d)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  // a bare code, or a whole link with #move= in it
  function unpack(code) {
    code = String(code || "").replace(/\s+/g, "");
    var m = code.match(/[#&]move=([A-Za-z0-9_-]+)/);
    if (m) code = m[1];
    var d = JSON.parse(decodeURIComponent(escape(atob(code.replace(/-/g, "+").replace(/_/g, "/")))));
    if (!d || typeof d !== "object") throw new Error("not a progress code");
    return d;
  }
  // write d into this device's saved data; replace: every key in d wins, else only the missing ones are filled in
  function bring(d, replace) {
    var n = 0;
    replace = replace || !localStorage.getItem(MOVED);
    for (var k in d) {
      if (!mine(k) || k === MOVED || typeof d[k] !== "string") continue;
      if (replace || localStorage.getItem(k) === null) { localStorage.setItem(k, d[k]); n++; }
    }
    localStorage.setItem(MOVED, new Date().toISOString());
    return n;
  }
  window.LCP = window.LCP || {};
  window.LCP.move = {unpack: unpack, bring: bring, OLD: "https://" + OLD_HOST + OLD_BASE + "/?progress"};

  var here = location.hostname;

  /* ---------- at the old address ---------- */
  if (here === OLD_HOST) {
    var path = location.pathname.indexOf(OLD_BASE) === 0 ? location.pathname.slice(OLD_BASE.length) || "/" : "/";
    var go = function () {
      var data = pack(), hash = location.hash.replace(/^#/, ""), tail = "";
      if (data) tail = "#move=" + data + (hash ? "&then=" + encodeURIComponent(hash) : "");
      else if (hash) tail = "#" + hash;
      location.replace(NEW + path + location.search.replace(/[?&]progress\b[^&]*/, "").replace(/^&/, "?") + tail);
    };
    var homeScreen = navigator.standalone === true || (window.matchMedia && matchMedia("(display-mode: standalone)").matches);
    if (!homeScreen && !/[?&]progress\b/.test(location.search)) { go(); return; }

    // the note about the move, in place of the page
    if (window.stop) window.stop();
    var code = pack();
    document.documentElement.innerHTML =
      '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">' +
      '<title>Lap Cat Puzzles has moved</title><style>' +
      ':root{--bg:#ECEEE7;--card:#fff;--ink:#3B2A44;--soft:#6B5E70;--btn:#3B2A44;--btnInk:#fff;--line:#D6D8CF}' +
      '@media (prefers-color-scheme: dark){:root{--bg:#1F1C24;--card:#2A2630;--ink:#F0EAF2;--soft:#B9AEBE;--btn:#F0EAF2;--btnInk:#1F1C24;--line:#3E3946}}' +
      'body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.45 -apple-system,system-ui,sans-serif;' +
      'padding:max(24px,env(safe-area-inset-top)) 16px 40px}' +
      'main{max-width:520px;margin:0 auto}h1{font-size:28px;margin:8px 0 4px}p,li{color:var(--soft)}b{color:var(--ink)}' +
      '.card{background:var(--card);border-radius:16px;padding:16px;margin:16px 0}' +
      'button,a.btn{display:block;width:100%;box-sizing:border-box;min-height:48px;border:0;border-radius:12px;font-family:inherit;font-size:17px;font-weight:600;line-height:1;' +
      'background:var(--btn);color:var(--btnInk);text-align:center;text-decoration:none;padding:15px;margin:10px 0;cursor:pointer}' +
      'a.btn.alt{background:transparent;color:var(--ink);border:2px solid var(--line)}' +
      'textarea{width:100%;box-sizing:border-box;height:84px;font:12px/1.3 ui-monospace,monospace;border:1px solid var(--line);' +
      'border-radius:10px;padding:8px;background:var(--bg);color:var(--ink)}ol{padding-left:22px}#said{min-height:1.4em;font-weight:600;color:var(--ink)}' +
      '</style></head><body><main>' +
      '<h1>🐾 We’ve moved!</h1>' +
      '<p>Catdoku is now <b>Lap Cat Puzzles</b>, at <b>lapcatpuzzles.com</b>. Your scores, streaks and games in progress can come too.</p>' +
      (code ?
        '<div class="card"><p><b>Playing from your Home Screen?</b> Your progress is kept inside this icon, so bring it over like this:</p><ol>' +
        '<li>Tap <b>Copy my progress code</b>.</li>' +
        '<li>Open <b>lapcatpuzzles.com</b> in Safari and add it to your Home Screen (Share, then Add to Home Screen).</li>' +
        '<li>Open the new icon, go to <b>Settings</b>, and paste the code under <b>Bring over your progress</b>.</li></ol>' +
        '<button id="copy">Copy my progress code</button><p id="said" aria-live="polite"></p>' +
        '<textarea id="code" readonly aria-label="Your progress code">' + code + '</textarea>' +
        '<p>Once it’s there, you can delete this old icon.</p></div>' +
        '<a class="btn alt" id="go" href="#">Or just open the new site here</a>'
      : '<a class="btn" id="go" href="#">Go to lapcatpuzzles.com</a>') +
      '</main></body>';
    var btn = document.getElementById("copy"), box = document.getElementById("code"), said = document.getElementById("said");
    document.getElementById("go").onclick = function (e) { e.preventDefault(); go(); };
    if (btn) btn.onclick = function () {
      var done = function () { said.textContent = "Copied! Now open lapcatpuzzles.com."; };
      var fallback = function () {
        box.focus(); box.select(); box.setSelectionRange(0, code.length);
        try { if (document.execCommand("copy")) return done(); } catch (e) {}
        said.textContent = "Select all the text in the box below and copy it.";
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(done, fallback);
      else fallback();
    };
    return;
  }

  /* ---------- at the new address ---------- */
  var m = location.hash.match(/^#move=([A-Za-z0-9_-]+)(?:&then=(.*))?$/);
  if (m) {
    try { bring(unpack(m[1]), false); } catch (e) {}
    var then = m[2] ? "#" + decodeURIComponent(m[2]) : "";
    try { history.replaceState(null, "", location.pathname + location.search + then); } catch (e) { location.hash = then; }
  }
  // the counter's paths stay as they were at the old address (/catdoku/tangle/), so the numbers carry on in one line
  if (here !== "localhost" && here !== "127.0.0.1") {
    window.goatcounter = window.goatcounter || {};
    window.goatcounter.path = function (p) { return OLD_BASE + p; };
  }
})();
