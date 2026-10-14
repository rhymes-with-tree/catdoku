/* Cat-tower parts shared by the Catdoku family of games (Catwalk's perches, High Perch's cat trees): carpet
   colours, the perch pieces, and the curled-up cats that nap on them. Each piece is drawn round (x, y) at
   Catwalk's size, about 80 across, seen from the front; scale it to fit. */
const TOWER = (() => {
  const CARPETS = ["#D8C3A5", "#C9B9D6", "#E3B9A9", "#B7C8BC", "#E8D9B8", "#BFC7D8", "#D9B8C8"];
  // a darker shade of a carpet, for its sides
  const shade = c => `color-mix(in srgb, ${c} 72%, #2A2530)`;
  // a sisal-wrapped post from (x, y1) down to y2, w wide
  const post = (x, y1, y2, w) => {
    let s = `<rect x="${x - w / 2}" y="${y1}" width="${w}" height="${y2 - y1}" rx="${w / 4}" fill="#C99A62" stroke="#5A3D25" stroke-width="2"/>`;
    for (let y = y1 + 5; y < y2 - 2; y += 6) s += `<path d="M${x - w / 2 + 1} ${y}L${x + w / 2 - 1} ${y + 2}" stroke="#5A3D25" stroke-width="1.2" opacity=".55"/>`;
    return s;
  };
  // Seen from the front: each piece's carpeted top is at about (x, y), where catwalks join it. They're drawn
  // without anything holding them up; the game draws the posts they sit on.
  const PIECES = {
    // a round carpeted shelf
    platform: (x, y, c) => `<path d="M${x - 40} ${y} V${y + 10} A40 12 0 0 0 ${x + 40} ${y + 10} V${y} Z" fill="${shade(c)}" stroke="#2A2530" stroke-width="3.5" stroke-linejoin="round"/>
      <ellipse cx="${x}" cy="${y}" rx="40" ry="12" fill="${c}" stroke="#2A2530" stroke-width="3.5"/>
      <ellipse cx="${x}" cy="${y}" rx="31" ry="7.5" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="2.5" stroke-dasharray="3 5"/>`,
    // a carpeted cubby box with a round hole in the front
    cubby: (x, y, c) => `<path d="M${x - 38} ${y - 6} l8 -8 h60 l8 8 Z" fill="${c}" stroke="#2A2530" stroke-width="3.5" stroke-linejoin="round"/>
      <rect x="${x - 38}" y="${y - 6}" width="76" height="54" rx="7" fill="${shade(c)}" stroke="#2A2530" stroke-width="3.5"/>
      <circle cx="${x}" cy="${y + 21}" r="16" fill="#3B2A22" stroke="#2A2530" stroke-width="3"/>`,
    // a fabric hammock slung under a wooden rail
    hammock: (x, y, c) => `<path d="M${x - 42} ${y - 14} H${x + 42}" stroke="#5A3D25" stroke-width="7" stroke-linecap="round"/>
      <path d="M${x - 38} ${y - 12} L${x - 31} ${y} M${x + 38} ${y - 12} L${x + 31} ${y}" stroke="#5A3D25" stroke-width="3"/>
      <path d="M${x - 33} ${y - 2} Q${x} ${y + 42} ${x + 33} ${y - 2} Q${x} ${y + 12} ${x - 33} ${y - 2} Z" fill="${c}" stroke="#2A2530" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M${x - 21} ${y + 8} Q${x} ${y + 29} ${x + 21} ${y + 8}" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="3" stroke-dasharray="4 5"/>`,
  };
  // the curled-up Sunbeams cats that nap on the perches (in cats/)
  const NAPPERS = ["c14-36", "c16-5", "c14-34", "c15-6", "c14-35", "c15-5", "c16-3"];
  // where a napping cat's picture is: an embedded copy if the page was bundled into one file
  const catSrc = (name, embedded) => (embedded && embedded[name]) || `../cats/${name}.webp`;
  return {CARPETS, shade, PIECES, post, NAPPERS, catSrc};
})();
