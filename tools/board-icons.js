// Makes the front page's pictures: a small picture of each game's board, in icons/<game>.webp
// (at most 240 pixels across or down, with see-through corners).
// Serve the site first (python3 -m http.server 8123 in the top folder), then: node tools/board-icons.js
// Needs Playwright. Each game opens fresh (nothing saved), with first-visit walkthroughs and cards put away.
const {chromium} = require(process.env.PLAYWRIGHT || "playwright");
const path = require("path");
const BASE = process.env.SITE || "http://localhost:8123/";
const GAMES = ["catdoku", "yarn", "patches", "sunbeams", "toybox", "pounce", "twirl", "toebeans", "knockitoff", "hideseek",
               "niptrip", "tangle", "catwalk", "tango", "bubbles"];
// Anything a game needs before its picture: walkthroughs and hints put away, a few moves made to show how it plays.
const SETUP = {
  bubbles: () => { intro = null; batted = true; },
  toybox: () => { if (typeof intro !== "undefined") intro = null; },
};
const TAP_MIDDLE = new Set(["hideseek"]);   // games pictured after a tap in the middle of the board (opening the first boxes)
const MAX = 240;
(async () => {
  const b = await chromium.launch(), only = process.argv.slice(2);
  for (const g of only.length ? only : GAMES) {
    const p = await b.newPage({viewport: {width: 390, height: 844}, deviceScaleFactor: 2});
    await p.goto(BASE + g + "/"); await p.evaluate(() => localStorage.clear()); await p.reload();
    await p.waitForTimeout(3500);
    await p.evaluate(() => { document.querySelectorAll(".spot,.spotGo").forEach(s => s.remove()); const o = document.getElementById("overlay"); if (o) o.classList.remove("show"); });
    if (SETUP[g]) await p.evaluate(SETUP[g]);
    if (TAP_MIDDLE.has(g)) { const r = await (await p.$("#board")).boundingBox(); await p.mouse.click(r.x + r.width / 2, r.y + r.height / 2); await p.waitForTimeout(1200); }
    await p.waitForTimeout(600);
    await p.evaluate(() => { document.documentElement.style.background = document.body.style.background = "transparent"; });
    const shot = await (await p.$("#board")).screenshot({omitBackground: true, animations: "disabled"});
    // shrink it and turn it into WebP in the browser, which can do both
    const webp = await p.evaluate(async ([src, max]) => {
      const img = new Image(); img.src = src; await img.decode();
      const s = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement("canvas");
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      const g = c.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(img, 0, 0, c.width, c.height);
      return c.toDataURL("image/webp", 0.86).split(",")[1];
    }, ["data:image/png;base64," + shot.toString("base64"), MAX]);
    require("fs").writeFileSync(path.join(__dirname, "..", "icons", g + ".webp"), Buffer.from(webp, "base64"));
    console.log(g);
    await p.close();
  }
  await b.close();
})();
