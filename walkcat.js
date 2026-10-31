/* The orange tabby that trots across Keyboard Cat's keyboard and along the bottom of Spelling String's board,
   seen from above, facing right, in a 300 × 120 box: the tail, four paws (drawn separately so they can step),
   the body and the head. */
const WALKCAT = (() => {
  const BODY = `<path d="M70 60 C40 60 26 40 6 46" fill="none" stroke="#2A2530" stroke-width="15" stroke-linecap="round"/><path d="M70 60 C40 60 26 40 6 46" fill="none" stroke="#E9A15B" stroke-width="9" stroke-linecap="round"/>
  <ellipse cx="150" cy="60" rx="95" ry="40" fill="#E9A15B" stroke="#2A2530" stroke-width="4"/>
  <path d="M100 26 Q110 60 100 94 M130 21 Q140 60 130 99 M160 21 Q170 60 160 99 M190 26 Q200 60 190 94" fill="none" stroke="#C7793A" stroke-width="6" stroke-linecap="round"/>
  <path d="M262 36 L284 30 L272 50 Z M262 84 L284 90 L272 70 Z" fill="#E9A15B" stroke="#2A2530" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="258" cy="60" r="30" fill="#E9A15B" stroke="#2A2530" stroke-width="4"/>
  <path d="M244 52 L254 55 M242 60 L253 60 M244 68 L254 65" stroke="#C7793A" stroke-width="4" stroke-linecap="round"/>`;
  const PAWS = [[205, 22], [205, 98], [95, 24], [95, 96]];   // front left, front right, back left, back right
  // each paw: a pad, and four toes forward
  const FOOT = `<path d="M-14 0 C-14 -9 -7 -12 -1 -9 C3 -7 4 -3 4 0 C4 3 3 7 -1 9 C-7 12 -14 9 -14 0 Z"/>${[[7, -10], [11, -3.5], [11, 3.5], [7, 10]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4.6" ry="3.9"/>`).join("")}`;
  const NS = "http://www.w3.org/2000/svg";
  // The cat as an SVG group, with its paws: {g, paws}. Add g to an SVG.
  function make() {
    const g = document.createElementNS(NS, "g");
    const paws = PAWS.map(() => { const p = document.createElementNS(NS, "g"); p.setAttribute("fill", "#F2C49B"); p.setAttribute("stroke", "#2A2530"); p.setAttribute("stroke-width", 3); p.innerHTML = FOOT; return p; });
    g.append(...paws); g.insertAdjacentHTML("beforeend", BODY);
    return {g, paws};
  }
  // Put it at x, y (its top left), len long, `ms` into a trot: diagonal pairs of paws reach forward together.
  function pose(cat, x, y, len, ms) {
    const step = ms / 70;
    PAWS.forEach(([px, py], i) => cat.paws[i].setAttribute("transform", `translate(${px + Math.sin(step + (i === 0 || i === 3 ? 0 : Math.PI)) * 18} ${py})`));
    cat.g.setAttribute("transform", `translate(${x} ${y + Math.sin(step * 2) * 2}) scale(${len / 300})`);
  }
  return {make, pose, PAWS};
})();
