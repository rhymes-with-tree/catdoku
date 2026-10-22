const {chromium} = require("/opt/node-tools/node_modules/playwright");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport: {width: 400, height: 860}});
  const errs = []; p.on("pageerror", e => errs.push(e.message));
  await p.goto("http://localhost:8766/test.html"); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => {
    let bad = 0;
    for (let i = 0; i < 300; i++) for (const s of [3, 4, 5]) { if (wrongNames("ISR", s).includes("PSX")) bad++; if (wrongNames("PSX", s).includes("ISR")) bad++; }
    return `Israel/Palestine together: ${bad}; ISR s5: ${wrongNames("ISR", 5).map(c => NAMES[c])}; PSX s5: ${wrongNames("PSX", 5).map(c => NAMES[c])}; QAT: ${CLUE.QAT}, GBR: ${CLUE.GBR}, MAR: ${CLUE.MAR}`;
  }), errs);
  await b.close();
})();
