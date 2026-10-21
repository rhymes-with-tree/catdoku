const {chromium} = require("/opt/node-tools/node_modules/playwright");
const out = process.argv[2];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport: {width: 400, height: 900}});
  const errs = []; p.on("pageerror", e => errs.push(e.message));
  await p.goto("http://localhost:8766/test.html"); await p.waitForTimeout(2500);
  for (let i = 0; i < 8; i++) { await p.keyboard.press("Space"); await p.waitForTimeout(120); }
  console.log(await p.evaluate(() => {
    const lines = [];
    for (const lv of [1, 2, 3]) for (const r of REGIONS_AT[lv]) {
      let bad = [], tiers = {1: 0, 2: 0, 3: 0}, extra = 0;
      for (let k = 0; k < 40; k++) {
        const t = makeTrip(lv, r), cs = t.map(x => x.c);
        if (cs.length !== 10 || new Set(cs).size !== 10) bad.push("size " + cs.length);
        for (const c of cs) { tiers[TIERS[c]]++; if (lv === 3 && NOT_ON_HARD.includes(c)) bad.push("big " + c); if (["PAN", "JAM"].includes(c)) extra++;
          const conts = REGIONS[r][1]; if (conts && !conts.includes(regionOf(c))) bad.push("region " + c); if (TIERS[c] > lv && !(lv === 1 && ["PAN","JAM"].includes(c))) bad.push("tier " + c); }
        for (const x of t) for (const o of x.opts) if ((NEVER_WITH[x.c] || []).includes(o)) bad.push("pair " + x.c + o);
      }
      lines.push(`${LEVELS[lv]} ${r}: per trip E${(tiers[1]/40).toFixed(1)} M${(tiers[2]/40).toFixed(1)} H${(tiers[3]/40).toFixed(1)}${extra ? " PAN/JAM " + extra : ""} ${bad.length ? "BAD " + [...new Set(bad)].slice(0, 5) : "ok"}`);
    }
    lines.push("LVA hard wrongs: " + wrongNames("LVA", 3).map(nameOf) + " | EGY easy wrongs: " + wrongNames("EGY", 1).map(nameOf) + " | UKR hard: " + wrongNames("UKR", 3).map(nameOf));
    return lines.join("\n");
  }));
  // play Easy Europe & Africa on Pick: miss twice on the first, then right
  await p.evaluate(() => { setStyle("pick"); newTrip(1, "eurafrica"); }); await p.waitForTimeout(1200);
  for (let i = 0; i < 10; i++) {
    const t = await p.evaluate(() => ({c: current(), wrong: game.trip[game.i].opts.filter(o => o !== current()).map(nameOf), name: nameOf(current())}));
    if (i < 2) { for (const w of t.wrong.slice(0, 2)) { await p.click(`#choices button:text-is("${w}")`); await p.waitForTimeout(300); } await p.waitForTimeout(2000); }
    else { await p.click(`#choices button:text-is("${t.name}")`); await p.waitForTimeout(1300); if (await p.isVisible("#skipBtn")) { await p.click("#skipBtn"); await p.waitForTimeout(300); } }
  }
  await p.waitForTimeout(900);
  console.log("card:", (await p.textContent("#card")).replace(/\s+/g, " ").slice(0, 200));
  console.log("result:", JSON.stringify(await p.evaluate(() => game.result)), "label:", await p.evaluate(() => keyName(game.result.n)));
  await p.evaluate(() => G.closeCard()); await p.evaluate(() => { setStyle("list"); newTrip(2, "asiaoceania"); }); await p.waitForTimeout(1300);
  await p.screenshot({path: out + "/l-medium.png", fullPage: true});
  console.log("regions at Medium:", await p.$$eval("#regionSel option", os => os.map(o => o.textContent).join(", ")), "| hint:", await p.textContent("#styleHint"));
  console.log("errors:", errs);
  await b.close();
})();
