const {chromium} = require("/opt/node-tools/node_modules/playwright");
const out = process.argv[2];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport: {width: 400, height: 860}});
  const errs = []; p.on("pageerror", e => errs.push(e.message)); p.on("console", m => m.type() === "error" && errs.push(m.text()));
  await p.goto("http://localhost:8766/test.html"); await p.waitForTimeout(2500);
  await p.screenshot({path: out + "/s0-walk.png"});
  for (let i = 0; i < 7; i++) { await p.keyboard.press("Space"); await p.waitForTimeout(250); }
  await p.waitForTimeout(1500);
  await p.screenshot({path: out + "/s1-easy.png"});
  // wrong one first, then right ones
  const wrong = await p.evaluate(() => game.trip[0].opts.find(o => o !== game.trip[0].c));
  await p.click(`#choices button:has-text("${await p.evaluate(c => NAMES[c], wrong)}")`);
  await p.waitForTimeout(300); await p.screenshot({path: out + "/s2-wrong.png"});
  for (let i = 0; i < 10; i++) {
    const n = await p.evaluate(() => NAMES[current()]);
    await p.click(`#choices button:text-is("${n}")`); await p.waitForTimeout(1300);
  }
  await p.waitForTimeout(800); await p.screenshot({path: out + "/s3-win.png"});
  console.log(await p.evaluate(() => document.getElementById("card").innerText));
  // Medium: pick by typing
  await p.evaluate(() => { G.closeCard(); newTrip(6); });
  await p.waitForTimeout(1200);
  await p.click("#hintBtn"); await p.click("#hintBtn");
  const n2 = await p.evaluate(() => NAMES[current()]);
  await p.fill("#guess", n2.slice(0, 3)); await p.waitForTimeout(200);
  await p.screenshot({path: out + "/s4-medium.png"});
  await p.click(`#list li:text-is("${n2}")`); await p.waitForTimeout(1500);
  // Hard: typo then alias
  await p.evaluate(() => newTrip(11)); await p.waitForTimeout(1200);
  await p.fill("#guess", "Narnia"); await p.press("#guess", "Enter"); await p.waitForTimeout(200);
  console.log("msg:", await p.textContent("#msg"));
  await p.fill("#guess", await p.evaluate(() => NAMES[current()].toUpperCase())); await p.press("#guess", "Enter"); await p.waitForTimeout(300);
  console.log("after:", await p.textContent("#msg"));
  await p.waitForTimeout(1300);
  // a tiny country with its ring
  await p.evaluate(() => { game.trip[game.i].c = "VAT"; show("jump"); }); await p.waitForTimeout(500);
  await p.screenshot({path: out + "/s5-hard-tiny.png"});
  console.log("errors:", errs);
  await b.close();
})();
