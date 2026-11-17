/* The move to lapcatpuzzles.com (2026-11). The site used to live at rhymes-with-tree.github.io/catdoku/, and a
   browser keeps saved games, bests, streaks and settings apart for each address, so players' progress has to be
   carried across. Every page loads this first, before anything reads or writes saved data.

   At the old address: once the new site answers (its version.txt, which Cloudflare lets any page read: _headers),
   a page goes on to the same page at the new one, with everything saved (the keys starting "catdoku.", and
   GoatCounter's "skipgc") packed into the link after #move=. The part after # never leaves the device: browsers
   don't send it to a server. Until the new site answers, the old one carries on as it was, so this can go live
   before the new site does. Nothing saved at the old address is ever deleted.
   Except in an iPhone or iPad Home Screen app (navigator.standalone), which keeps its own saved data apart from
   the browser's, so a link opened from it may land where the new icon can't see. That goes to moved.html, a note
   about the move with a progress code to copy and paste into the new site's Settings. (Android's Home Screen apps
   share the browser's saved data, so they go straight on like everyone else, in Chrome, DuckDuckGo or any other.)

   At the new address: a #move= link is unpacked into this device's saved data and taken off the address before
   the page's own scripts run. The first time anything is brought over, it replaces what's here (a few minutes on
   the new site is worth less than everything played before); later links only fill in what's missing. A code
   pasted into Settings (LCP.move.bring) always replaces. www. goes to the bare address, which keeps its own saved
   data. GoatCounter is told each page's path with /catdoku in front, as at the old address, so the numbers carry
   on in one line. */
(function () {
  var OLD_HOST = "rhymes-with-tree.github.io", OLD_BASE = "/catdoku", NEW_HOST = "lapcatpuzzles.com", NEW = "https://" + NEW_HOST;
  var MOVED = "catdoku.moved.v1";
  var mine = function (k) { return k === "skipgc" || k.indexOf("catdoku.") === 0; };
  var here = location.hostname, atOld = here === OLD_HOST;

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
  // from the old address to the same page at the new one, bringing everything saved (path: the new one's)
  function go(path) {
    if (path == null) path = location.pathname.indexOf(OLD_BASE) === 0 ? location.pathname.slice(OLD_BASE.length) || "/" : "/";
    var data = pack(), hash = location.hash.replace(/^#/, ""), tail = "";
    if (data) tail = "#move=" + data + (hash ? "&then=" + encodeURIComponent(hash) : "");
    else if (hash) tail = "#" + hash;
    location.replace(NEW + path + location.search + tail);
  }
  // calls back only if the new site is up and is this site (a parked or half-set-up domain doesn't count)
  function whenNewSiteUp(then) {
    if (!window.fetch) return;
    var ctl = window.AbortController ? new AbortController() : null;
    if (ctl) setTimeout(function () { ctl.abort(); }, 4000);
    fetch(NEW + "/version.txt?t=" + Date.now(), {cache: "no-store", signal: ctl ? ctl.signal : undefined})
      .then(function (r) { return r.ok ? r.text() : ""; })
      .then(function (v) { if (/^\d{4}-\d\d-\d\d\.\d+\s*$/.test(v)) then(); })
      .catch(function () {});
  }
  window.LCP = window.LCP || {};
  window.LCP.move = {pack: pack, unpack: unpack, bring: bring, go: go, atOld: atOld, NEW: NEW,
    NOTE: "https://" + OLD_HOST + OLD_BASE + "/moved.html"};

  /* ---------- at the old address ---------- */
  if (atOld) {
    if (/\/moved\.html$/.test(location.pathname)) return;   // the note does its own thing
    whenNewSiteUp(function () {
      if (navigator.standalone === true) location.replace(OLD_BASE + "/moved.html");
      else go();
    });
    return;
  }

  /* ---------- at the new address ---------- */
  if (here === "www." + NEW_HOST) { location.replace(NEW + location.pathname + location.search + location.hash); return; }
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
