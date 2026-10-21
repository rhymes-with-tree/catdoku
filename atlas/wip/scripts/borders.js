const {chromium} = require("/opt/node-tools/node_modules/playwright");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport: {width: 400, height: 860}});
  await p.goto("http://localhost:8766/test.html"); await p.waitForTimeout(2500);
  await p.keyboard.press("Escape"); for (let i = 0; i < 7; i++) { await p.keyboard.press("Space"); await p.waitForTimeout(150); }
  for (const c of ["MAR", "UKR", "IND", "SYR", "GEO", "CYP"]) {
    await p.evaluate(c => { game.trip[game.i].c = c; show("jump"); if (c === "XXX") { view.x = frameFor("UKR").x; view.y = frameFor("UKR").y; view.s = frameFor("UKR").s; redraw(); } }, c);
    await p.waitForTimeout(400);
    await p.locator("#board").screenshot({path: `${process.argv[2]}/b-${c}.png`});
  }
  await b.close();
})();
