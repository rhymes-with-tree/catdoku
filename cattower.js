/* Cat-tower parts shared by the Catdoku family of games (Catwalk's perches, High Perch's cat trees): carpet
   colours, the perch pieces, and the curled-up cats that nap on them. Each piece is drawn round (x, y) at
   Catwalk's size, about 80 across; scale it to fit. */
const TOWER = (() => {
  const CARPETS = ["#D8C3A5", "#C9B9D6", "#E3B9A9", "#B7C8BC", "#E8D9B8", "#BFC7D8", "#D9B8C8"];
  // a darker shade of a carpet, for its sides
  const shade = c => `color-mix(in srgb, ${c} 72%, #2A2530)`;
  const PIECES = {
    // a round platform, carpet on top and a sisal-wrapped rim
    platform: (x, y, c) => `<ellipse cx="${x}" cy="${y + 8}" rx="40" ry="32" fill="rgba(42,37,48,.25)"/>
      <ellipse cx="${x}" cy="${y + 4}" rx="39" ry="31" fill="${shade(c)}" stroke="#2A2530" stroke-width="3.5"/>
      <ellipse cx="${x}" cy="${y - 2}" rx="39" ry="31" fill="${c}" stroke="#2A2530" stroke-width="3.5"/>
      <ellipse cx="${x}" cy="${y - 2}" rx="31" ry="24" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="3" stroke-dasharray="3 5"/>`,
    // a carpeted cubby box with a round hole in the front
    cubby: (x, y, c) => `<rect x="${x - 38}" y="${y - 30}" width="76" height="70" rx="9" fill="rgba(42,37,48,.25)" transform="translate(3 5)"/>
      <path d="M${x - 38} ${y - 30} l10 -10 h56 l10 10 Z" fill="${shade(c)}" stroke="#2A2530" stroke-width="3.5" stroke-linejoin="round"/>
      <rect x="${x - 38}" y="${y - 30}" width="76" height="68" rx="8" fill="${c}" stroke="#2A2530" stroke-width="3.5"/>
      <circle cx="${x}" cy="${y + 6}" r="19" fill="#3B2A22" stroke="#2A2530" stroke-width="3"/><path d="M${x - 15} ${y - 2} a19 19 0 0 1 30 0" fill="none" stroke="${shade(c)}" stroke-width="4"/>`,
    // a fabric hammock slung from a little frame
    hammock: (x, y, c) => `<ellipse cx="${x}" cy="${y + 30}" rx="36" ry="7" fill="rgba(42,37,48,.22)"/>
      <path d="M${x - 40} ${y - 26} V${y + 26} M${x + 40} ${y - 26} V${y + 26}" stroke="#5A3D25" stroke-width="7" stroke-linecap="round"/>
      <path d="M${x - 40} ${y - 22} Q${x} ${y + 44} ${x + 40} ${y - 22} Q${x} ${y + 4} ${x - 40} ${y - 22} Z" fill="${c}" stroke="#2A2530" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M${x - 26} ${y - 6} Q${x} ${y + 26} ${x + 26} ${y - 6}" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="3" stroke-dasharray="4 5"/>`,
  };
  // a sisal-wrapped post from (x, y1) down to y2, w wide
  const post = (x, y1, y2, w) => {
    let s = `<rect x="${x - w / 2}" y="${y1}" width="${w}" height="${y2 - y1}" rx="${w / 4}" fill="#C99A62" stroke="#5A3D25" stroke-width="2"/>`;
    for (let y = y1 + 5; y < y2 - 2; y += 6) s += `<path d="M${x - w / 2 + 1} ${y}L${x + w / 2 - 1} ${y + 2}" stroke="#5A3D25" stroke-width="1.2" opacity=".55"/>`;
    return s;
  };
  // the curled-up Sunbeams cats that nap on the perches (in cats/)
  const NAPPERS = ["c14-36", "c16-5", "c14-34", "c15-6", "c14-35", "c15-5", "c16-3"];
  // where a napping cat's picture is: an embedded copy if the page was bundled into one file
  const catSrc = (name, embedded) => (embedded && embedded[name]) || `../cats/${name}.webp`;
  return {CARPETS, shade, PIECES, post, NAPPERS, catSrc};
})();
