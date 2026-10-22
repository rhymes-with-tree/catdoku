const {chromium} = require("/opt/node-tools/node_modules/playwright");
const out = process.argv[2];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport: {width: 400, height: 900}});
  const errs = []; p.on("pageerror", e => errs.push(e.message));
  await p.goto("http://localhost:8766/test.html"); await p.waitForTimeout(2500);
  for (let i = 0; i < 8; i++) { await p.keyboard.press("Space"); await p.waitForTimeout(120); }
  await p.selectOption("#roundSel", "disputed"); await p.waitForTimeout(1300);
  console.log("level/region hidden:", await p.evaluate(() => [$("levelSel").closest("label").hidden, $("regionSel").closest("label").hidden]), "| shapes:", await p.evaluate(() => Object.keys(DISPUTES).filter(k => !world.by["dz:" + k])));
  await p.evaluate(() => setStyle("type"));
  const type = async t => { await p.fill("#guess", t); await p.press("#guess", "Enter"); await p.waitForTimeout(250); };
  for (let i = 0; i < 10; i++) {
    const d = await p.evaluate(() => { const d = dzOf(current()); return {name: d.name, aka: d.aka, who: d.who.map(nameOf)}; });
    if (i === 0) { console.log("sentence:", await p.textContent("#clue")); await p.screenshot({path: out + "/dz-1.png"}); }
    if (i === 1) { for (const w of ["Narnia", "Atlantis", "Oz"]) await type(w); await p.waitForTimeout(2900); console.log("after 3 wrong:", JSON.stringify(await p.evaluate(() => game.res[game.res.length - 1]))); continue; }
    for (const w of [...d.who].reverse()) await type(w);           // countries first, place last
    await type(d.name); await p.waitForTimeout(1300);
    if (d.aka.length) {
      if (i === 0) { console.log("bonus prompt:", await p.textContent("#reveal")); await type(d.aka[0]); await p.screenshot({path: out + "/dz-2.png"}); }
      if (await p.isVisible("#skipBtn")) { await p.click("#skipBtn"); await p.waitForTimeout(400); }
    }
  }
  await p.waitForTimeout(800);
  console.log("card:", (await p.textContent("#card")).replace(/\s+/g, " ").slice(0, 160), "| label:", await p.evaluate(() => keyName(game.result.n)));
  await p.evaluate(() => { G.closeCard(); setStyle("pick"); newDzTrip(); }); await p.waitForTimeout(1300);
  await p.screenshot({path: out + "/dz-pick.png"});
  console.log("errors:", errs);
  await b.close();
})();
