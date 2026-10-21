const {chromium} = require("/opt/node-tools/node_modules/playwright");
const out = process.argv[2];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport: {width: 400, height: 860}});
  const errs = []; p.on("pageerror", e => errs.push(e.message));
  await p.goto("http://localhost:8766/test.html"); await p.waitForTimeout(2500);
  for (let i = 0; i < 7; i++) { await p.keyboard.press("Space"); await p.waitForTimeout(150); }
  // Easy, with Greenland first
  await p.evaluate(() => { newTrip(4); const t = makeTrip(4); t[0] = {c: "GRL", opts: shuffle(["GRL", ...wrongNames("GRL", 4)]), owners: shuffle(["DNK", "FRA", "GBR", "USA"])}; t[1].c = "ATC"; t[1].opts = shuffle(["ATC", ...wrongNames("ATC", 4)]); t[1].owners = shuffle(["AUS","FRA","GBR","USA"]); newTrip(4, t); });
  await p.waitForTimeout(1200);
  console.log("clue:", await p.textContent("#clue"), "| opts:", await p.$$eval("#choices button", bs => bs.map(b => b.textContent).join(", ")));
  await p.click('#choices button:text-is("Greenland")'); await p.waitForTimeout(1400);
  console.log("bonus clue:", await p.textContent("#clue"), "| opts:", await p.$$eval("#choices button", bs => bs.map(b => b.textContent).join(", ")));
  await p.screenshot({path: out + "/d1-bonus.png"});
  await p.click('#choices button:text-is("Denmark")'); await p.waitForTimeout(1300);
  console.log("next clue:", await p.textContent("#clue"));
  await p.screenshot({path: out + "/d2-empty.png"});
  await p.click('#choices button:text-is("Ashmore and Cartier Islands")'); await p.waitForTimeout(1300);
  await p.click("#skipBtn"); await p.waitForTimeout(400);
  console.log("after skip:", await p.textContent("#msg"), "| res:", JSON.stringify(await p.evaluate(() => game.res)));
  // Hard: both names at once, then Southern Ocean distractors
  await p.evaluate(() => { const t = makeTrip(14); t[0] = {c: "FLK", opts: [], owners: []}; newTrip(14, t); }); await p.waitForTimeout(1200);
  await p.fill("#guess", "Falklands (United Kingdom)"); await p.press("#guess", "Enter"); await p.waitForTimeout(300);
  console.log("hard both:", await p.textContent("#msg")); await p.waitForTimeout(1300);
  console.log("hard next clue:", await p.textContent("#clue"), JSON.stringify(await p.evaluate(() => game.res)));
  console.log("ATF easy wrongs:", await p.evaluate(() => wrongNames("ATF", 5).map(nameOf)), "| France lights GUF?", await p.evaluate(() => (world.by.FRA || []).length));
  console.log("Medium bonus list sample:", await p.evaluate(() => matching("den", true).map(nameOf).join(", ")));
  console.log("errors:", errs);
  await b.close();
})();
