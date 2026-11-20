// Wind Up calibration bot: a simple player on each level, many baskets.
// usage: node tools/windup/bot.js <levels, e.g. 1-12> <baskets> [helpers 1|0] [first seed]
// Env: OV='{"7":{"line":80}}' tries changed LV settings; EV='js' runs code in the page first (e.g. a new SHAPE).
// Prints, for each level, how many baskets the simple player won. Needs Playwright (preinstalled in cloud sessions).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const [lv = '1-12', nArg = '20', helpArg = '1', seedArg = '1000'] = process.argv.slice(2);
const [a, b] = lv.split('-').map(Number), LEVELS = Array.from({length: (b || a) - a + 1}, (_, i) => a + i);
const N = +nArg, HELP = helpArg === '1', SEED0 = +seedArg;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', e => console.error('page error:', e.message));
  await page.route('**/*', async route => {
    const u = new URL(route.request().url());
    if (u.hostname !== 'local.test') return route.abort();
    const f = path.join(ROOT, decodeURIComponent(u.pathname));
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) return route.fulfill({status: 404, body: ''});
    const ext = path.extname(f), type = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.txt': 'text/plain'}[ext] || 'application/octet-stream';
    route.fulfill({status: 200, body: fs.readFileSync(f), contentType: type});
  });
  await page.addInitScript(() => {
    localStorage.setItem('catdoku.windup.v1', JSON.stringify({settings: {level: 1, tries: {}, seenHelp: true, seenNew: {nip: 1, unr: 1, springs: 1, tape: 1, tip: 1, hurry: 1, weigh: 1}}}));
    window.requestAnimationFrame = () => 0;
  });
  await page.goto('http://local.test/windup/index.html');
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    G.sound.play = () => {}; G.note = () => {}; G.track = () => {}; G.save = () => {};
    window.win = () => { game.state = 'won'; };
    window.lose = () => { game.state = 'lost'; };
    window.paintHud = () => {};
    window.newThing = () => {};
  });
  if (process.env.EV) await page.evaluate(src => (0, eval)(src), process.env.EV);
  const OV = JSON.parse(process.env.OV || '{}');
  await page.evaluate(OV => { for (const k in OV) Object.assign(LV[k], OV[k]); for (const k in OV) GOALS[k] = LV[k].goal; }, OV);
  const out = {};
  for (const n of LEVELS) {
    const res = await page.evaluate(({n, N, HELP, SEED0}) => {
      // where a ball of radius r dropped at x first lands: the ball it touches, or the floor/shape
      function landing(g, x, r) {
        let best = null, by = H - r;
        for (const b of g.balls) {
          const dx = Math.abs(b.x - x), s = b.r + r;
          if (dx >= s) continue;
          const y = b.y - Math.sqrt(s * s - dx * dx);
          if (y < by) { by = y; best = b; }
        }
        return {y: by, on: best};
      }
      // the simple player: look at a row of places to drop, and take the best-looking one
      function choose(g) {
        const d = nextOf(g), r = rad(d.l), [lo, hi] = aimRange(d.l), K = 25;
        let bestX = W / 2, bestS = -1e9;
        for (let k = 0; k < K; k++) {
          const x = lo + (hi - lo) * k / (K - 1), {y, on} = landing(g, x, r);
          let s = y * .15;   // lower is better
          // what it'd be touching once it lands: a match is what we want
          for (const b of g.balls) {
            const dd = Math.hypot(b.x - x, b.y - y);
            if (dd > b.r + r + 4) continue;
            const match = d.k === 'nip' ? !b.p && !b.nip : b.l === d.l && b.p === d.p && !b.nip;
            if (match) s += 60 + 8 * b.l;
            else if (!d.p && !b.p && b.l === d.l + 1) s += 6;
            else if (b.l < d.l) s -= 10 * (d.l - b.l);   // burying a smaller ball
          }
          if (on && on.l === d.l && on.p === d.p) s += 20;
          if (d.p) s -= Math.min(x, W - x) * .1;   // fluff to the edges
          if (s > bestS) { bestS = s; bestX = x; }
        }
        return bestX;
      }
      const results = [];
      for (let t = 0; t < N; t++) {
        newGame(n, SEED0 + t * 7919);
        const g = game; let drops = 0;
        while (g.state === 'ready' || g.state === 'running') {
          g.aim = choose(g); drop(); drops++;
          for (let f = 0; f < 48 && g.state === 'running'; f++) {   // about 0.8 s between drops
            tick(g, 1 / 60);
            if (HELP && (g.helps || 0) < FREE) {
              if (g.overT > .9 && g.shakeCool <= 0) shake();
              else if (hasNet(g) && g.netReady && g.net <= 0 && g.load > .5) dropFloor();
              else if (LV[g.level].pom[0] && g.balls.filter(b => b.p).length >= 5 && g.overT > .3) defluff();
            }
          }
          if (drops > 700) { g.state = 'lost'; g.timeout = true; }
        }
        results.push({won: g.state === 'won', best: g.best, drops, helps: g.helps || 0, timeout: !!g.timeout});
      }
      return results;
    }, {n, N, HELP, SEED0});
    const w = res.filter(r => r.won).length;
    const bests = res.map(r => r.best).sort((a, b) => a - b);
    out[n] = {won: w, of: N, pct: Math.round(100 * w / N), medBest: bests[N >> 1], avgDropsWon: Math.round(res.filter(r => r.won).reduce((t, r) => t + r.drops, 0) / Math.max(1, w)), helps: +(res.reduce((t, r) => t + r.helps, 0) / N).toFixed(1)};
    console.log(n, JSON.stringify(out[n]));
  }
  await browser.close();
})();
