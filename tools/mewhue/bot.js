// Mew Hue calibration bot: the simple player (the hint's best-looking move each time, no Mix it up) on each level.
// usage: node tools/mewhue/bot.js <levels, e.g. 30-43> [boards per level] [first seed]
// Env: EV='js' runs code in the page first, e.g. EV='Object.assign(LEVELS[35], {goal: 2, third: .25})' to try a change.
// Prints, for each level, how often it wins, and the middle and most moves a won board took.
// Needs Playwright (preinstalled in cloud sessions).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const [lv = '1-43', nArg = '150', seedArg = '1000'] = process.argv.slice(2);
const [a, b] = lv.split('-').map(Number), LEVELS = Array.from({length: (b || a) - a + 1}, (_, i) => a + i);
const N = +nArg, SEED0 = +seedArg, CAP = 400;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', e => console.error('page error:', e.message));
  await page.route('**/*', async route => {
    const u = new URL(route.request().url());
    if (u.hostname !== 'local.test') return route.abort();
    const f = path.join(ROOT, decodeURIComponent(u.pathname));
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) return route.fulfill({status: 404, body: ''});
    const type = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.txt': 'text/plain'}[path.extname(f)] || 'application/octet-stream';
    route.fulfill({status: 200, body: fs.readFileSync(f), contentType: type});
  });
  await page.goto('http://local.test/mewhue/index.html');
  await page.waitForTimeout(800);
  if (process.env.EV) await page.evaluate(src => (0, eval)(src), process.env.EV);
  for (const level of LEVELS) {
    const r = await page.evaluate(({level, N, SEED0, CAP}) => {
      let won = 0; const took = [];
      for (let k = 0; k < N; k++) {
        const g = deal(level, SEED0 + k, [0, 1, 2]);
        for (let t = 0; t < CAP; t++) {
          const best = bestMove(g); if (!best) break;
          const r0 = applyMove(g.grid, best.m, rulesFor(g)), h = r0.grid; wither(g, h); thaw(g, h); const c = clearLines(h); wake(g, h, c.lines); moodAfter(g, r0);
          g.grid = h; g.moves++; tally(g, c); if (best.m.k === 'pull' && c.lines.length) g.pulls = (g.pulls || 0) + 1;
          if (goalDone(g)) { won++; took.push(g.moves); break; }
          drop(g);
          const c2 = clearLines(g.grid); if (c2.lines.length) { wake(g, g.grid, c2.lines); tally(g, c2); if (goalDone(g)) { won++; took.push(g.moves); break; } }
          if (stuck(g)) break;
        }
      }
      took.sort((x, y) => x - y);
      return {won, mid: took[Math.floor(took.length / 2)] || 0, most: took[took.length - 1] || 0, name: LEVELS[level].name};
    }, {level, N, SEED0, CAP});
    console.log(`${String(level).padStart(3)}  ${(100 * r.won / N).toFixed(0).padStart(3)}% won   moves: middle ${String(r.mid).padStart(3)}, most ${String(r.most).padStart(3)}   ${r.name}`);
  }
  await browser.close();
})();
