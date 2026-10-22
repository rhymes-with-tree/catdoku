const {chromium} = require("/opt/node-tools/node_modules/playwright");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport: {width: 400, height: 860}});
  await p.goto("http://localhost:8766/test.html"); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => {
    const out = [];
    for (const step of [4, 5]) {
      const t = makeTrip(step);
      out.push(`STEP ${step}: ` + t.slice(0, 4).map(x => `${NAMES[x.c]} [${x.opts.filter(o => o !== x.c).map(o => NAMES[o]).join(", ")}]`).join(" | "));
    }
    out.push("BTN s5: " + wrongNames("BTN",5).map(c=>NAMES[c]) + " LKA s5: " + wrongNames("LKA",5).map(c=>NAMES[c]) + " CYP s5: " + wrongNames("CYP",5).map(c=>NAMES[c]) + "\nLVA s1: " + wrongNames("LVA", 1).map(c => NAMES[c]) + " / s5: " + wrongNames("LVA", 5).map(c => NAMES[c]));
    out.push("COL s5: " + wrongNames("COL", 5).map(c => NAMES[c]) + " / PER s1: " + wrongNames("PER", 1).map(c => NAMES[c]));
    out.push("options: " + document.getElementById("levelSel").options.length + " first: " + document.getElementById("levelSel").options[0].text);
    return out.join("\n");
  }));
  await b.close();
})();
