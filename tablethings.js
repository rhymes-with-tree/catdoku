/* The things Fred knocks off the table in Knock It Off (a mug, a glass, a vase, a lemon…), each drawn in a 100 × 100
   box seen from the front, with a shadow under it on the table. Kitty Plinko drops some of them down its cat tree. */
const TABLE = (() => {
  const INK = 'stroke="#2A2530" stroke-width="2.5"';
  const SHADOW = (rx = 26) => `<ellipse cx="50" cy="84" rx="${rx}" ry="7" fill="rgba(70,35,10,.28)"/>`;
  const HEART = `<path d="M76 14 C76 9 83 9 83 14 C83 9 90 9 90 14 C90 20 83 24 83 26 C83 24 76 20 76 14Z" fill="#D9534F" stroke="#fff" stroke-width="2"/>`;
  const ART = {
    m: `${SHADOW(24)}<path d="M64 46 C80 46 80 68 64 68" fill="none" stroke="#2A2530" stroke-width="8"/><path d="M64 46 C80 46 80 68 64 68" fill="none" stroke="#fff" stroke-width="3.5"/>
        <rect x="28" y="34" width="38" height="48" rx="6" fill="#fff" ${INK}/><rect x="29.5" y="52" width="35" height="9" fill="#B94588"/>
        <ellipse cx="47" cy="35" rx="18" ry="4.5" fill="#6B4A3B" ${INK}/><path d="M40 26 q-4 -6 0 -12 M50 26 q-4 -6 0 -12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".85"/>`,
    g: `${SHADOW(20)}<path d="M33.5 42 L66.5 42 L63 82 L37 82 Z" fill="#8EC5E8"/><ellipse cx="50" cy="42" rx="16.5" ry="3" fill="#BFE0F5"/>
        <path d="M31 20 L69 20 L63 82 L37 82 Z" fill="rgba(235,245,250,.35)" ${INK} stroke-linejoin="round"/><path d="M38 26 L41 74" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>`,
    s: `${SHADOW(22)}<g fill="#6AA673" stroke="#2A2530" stroke-width="2">${[-62, -32, 32, 62, 0].map(a => `<ellipse cx="50" cy="34" rx="7.5" ry="17" transform="rotate(${a} 50 50)"/>`).join("")}</g>
        <path d="M33 60 L67 60 L62 84 L38 84 Z" fill="#D07A4E" ${INK} stroke-linejoin="round"/><rect x="29" y="53" width="42" height="10" rx="3" fill="#E08F62" ${INK}/>`,
    v: `${SHADOW(22)}<path d="M50 30 L37 12 M50 30 L50 7 M50 30 L63 13" stroke="#3C8681" stroke-width="3"/>
        <g stroke="#2A2530" stroke-width="2"><circle cx="37" cy="12" r="6" fill="#F2AEBB"/><circle cx="50" cy="7" r="6" fill="#ECA818"/><circle cx="63" cy="13" r="6" fill="#F2AEBB"/></g>
        <path d="M42 30 C42 40 28 46 28 62 C28 76 38 84 50 84 C62 84 72 76 72 62 C72 46 58 40 58 30 Z" fill="#7885BA" ${INK}/>
        <path d="M30 60 Q50 68 70 60" fill="none" stroke="#C9CCEA" stroke-width="4"/><rect x="40" y="26" width="20" height="6" rx="2" fill="#4E577D" ${INK}/>`,
    h: `${SHADOW(22)}<g transform="rotate(-14 50 50)"><rect x="31" y="14" width="38" height="70" rx="8" fill="#2A2530"/><rect x="35" y="21" width="30" height="54" rx="3" fill="#73A7AE"/>
        <g fill="#fff" opacity=".85"><rect x="39" y="26" width="8" height="8" rx="2"/><rect x="53" y="26" width="8" height="8" rx="2"/><rect x="39" y="40" width="8" height="8" rx="2"/><rect x="53" y="40" width="8" height="8" rx="2"/></g></g>`,
    y: `${SHADOW(24)}<circle cx="50" cy="56" r="26" fill="#E79AAE" ${INK}/>
        <g fill="none" stroke="#C9677F" stroke-width="2.5"><path d="M27 50 Q50 34 75 52"/><path d="M26 61 Q50 46 76 63"/><path d="M31 72 Q52 58 72 73"/><path d="M41 32 Q32 56 44 81"/></g>
        <path d="M70 72 C80 74 78 86 90 86" fill="none" stroke="#C9677F" stroke-width="3" stroke-linecap="round"/>`,
    i: `${SHADOW(30)}<g transform="rotate(-22 50 58)"><rect x="18" y="51" width="54" height="14" fill="#F2C230" ${INK}/><line x1="18" y1="58" x2="72" y2="58" stroke="#D9A41C" stroke-width="2"/>
        <rect x="8" y="51" width="11" height="14" rx="3" fill="#E79AAE" ${INK}/><rect x="17" y="51" width="5" height="14" fill="#C9CCDA" ${INK}/>
        <path d="M72 51 L90 58 L72 65 Z" fill="#EDD3AE" ${INK} stroke-linejoin="round"/><path d="M84 55.7 L90 58 L84 60.3 Z" fill="#2A2530"/></g>`,
    f: `${SHADOW(30)}<path d="M26 58 C30 42 70 42 74 58 Z" fill="#B9805F" ${INK}/>
        <g fill="#8A5A34"><circle cx="40" cy="52" r="3"/><circle cx="50" cy="48" r="3"/><circle cx="60" cy="52" r="3"/><circle cx="47" cy="55" r="3"/><circle cx="56" cy="56" r="3"/></g>
        <path d="M20 58 L80 58 L71 82 L29 82 Z" fill="#B94588" ${INK} stroke-linejoin="round"/>
        <path d="M41 70 C45 65 54 65 58 70 C54 75 45 75 41 70 Z M57 70 L63 65.5 L63 74.5 Z" fill="#fff"/>${HEART}`,
    L: `${SHADOW(30)}<ellipse cx="50" cy="82" rx="18" ry="5" fill="#4E577D" ${INK}/><rect x="46.5" y="42" width="7" height="40" fill="#4E577D" ${INK}/>
        <path d="M28 46 L72 46 L62 12 L38 12 Z" fill="#F6E7B8" ${INK} stroke-linejoin="round"/><path d="M32 40 L68 40" stroke="#E5CF8C" stroke-width="3"/>`,
    b: `${SHADOW(34)}<rect x="18" y="66" width="62" height="16" rx="2" fill="#BD5538" ${INK}/><rect x="70" y="68.5" width="8" height="11" fill="#F7F1E1"/>
        <rect x="25" y="50" width="54" height="16" rx="2" fill="#4E577D" ${INK}/><rect x="69" y="52.5" width="8" height="11" fill="#F7F1E1"/>
        <rect x="16" y="34" width="58" height="16" rx="2" fill="#6AA673" ${INK}/><rect x="64" y="36.5" width="8" height="11" fill="#F7F1E1"/>
        <rect x="22" y="38" width="20" height="3" fill="#fff" opacity=".7"/>`,
  };
  ART.c = `${SHADOW(22)}<ellipse cx="50" cy="80" rx="24" ry="6" fill="#ECA818" ${INK}/><rect x="38" y="40" width="24" height="40" rx="3" fill="#F7F1E1" ${INK}/>
    <path d="M39 47 q4 6 7 0 q4 9 7 0" fill="none" stroke="#E5DCC8" stroke-width="3"/><ellipse cx="50" cy="40" rx="12" ry="3" fill="#EFE6D2" ${INK}/>
    <line x1="50" y1="40" x2="50" y2="33" stroke="#2A2530" stroke-width="2"/>
    <path d="M50 12 C58 22 58 32 50 34 C42 32 42 22 50 12 Z" fill="#ECA818" stroke="#E16A4A" stroke-width="2"/><path d="M50 21 C54 27 54 31 50 32 C46 31 46 27 50 21 Z" fill="#FFE07A"/>`;
  ART.l = `${SHADOW(28)}<path d="M50 30 C44 22 52 14 60 16 C58 24 56 28 50 30 Z" fill="#6AA673" stroke="#2A2530" stroke-width="2" stroke-linejoin="round"/>
    <path d="M12 57 C20 40 36 33 50 33 C64 33 80 40 88 57 C80 74 64 81 50 81 C36 81 20 74 12 57 Z" fill="#F2D43A" ${INK} stroke-linejoin="round"/>
    <ellipse cx="38" cy="47" rx="10" ry="4" fill="#FBEA8C" transform="rotate(-15 38 47)"/>
    <g fill="#D9B21C"><circle cx="58" cy="52" r="1.6"/><circle cx="66" cy="60" r="1.6"/><circle cx="48" cy="64" r="1.6"/><circle cx="36" cy="60" r="1.6"/><circle cx="62" cy="70" r="1.6"/></g>`;
  // A roll of paper towel, its loose end flapping out the way it unrolls (u: 0 up, 1 down, 2 left, 3 right).
  function rollArt(u) {
    const PAPER = `fill="#FBFAF4" ${INK}`, CORE = `fill="#C9A27A" stroke="#2A2530" stroke-width="2"`;
    if (u >= 2) {   // seen end on, rolling sideways: a round end with the sheet trailing off to the side
      const flip = u === 2 ? ` transform="translate(100 0) scale(-1 1)"` : "";
      return `${SHADOW(28)}<g${flip}><path d="M44 78 L92 74 L94 86 L44 86 Z" ${PAPER} stroke-linejoin="round"/><path d="M68 76 L69 86" stroke="#BFB8A8" stroke-width="2" stroke-dasharray="3 3"/>
        <circle cx="42" cy="58" r="27" ${PAPER}/><path d="M42 40 A18 18 0 1 1 26 66" fill="none" stroke="#E6E1D3" stroke-width="3"/><circle cx="42" cy="58" r="9" ${CORE}/></g>`;
    }
    // rolling up or down the table: seen from the side, with the sheet hanging off the top or bottom
    const flap = u === 1 ? `<path d="M26 62 L74 62 L77 94 L23 94 Z" ${PAPER} stroke-linejoin="round"/><path d="M24 80 L76 80" stroke="#BFB8A8" stroke-width="2" stroke-dasharray="3 3"/>`
      : `<path d="M26 40 L74 40 L77 6 L23 6 Z" ${PAPER} stroke-linejoin="round"/><path d="M24 22 L76 22" stroke="#BFB8A8" stroke-width="2" stroke-dasharray="3 3"/>`;
    const y = u === 1 ? 36 : 44;
    return `${SHADOW(32)}${flap}<rect x="18" y="${y}" width="64" height="32" rx="4" ${PAPER}/>
      <path d="M30 ${y + 2} V${y + 30} M50 ${y + 2} V${y + 30} M70 ${y + 2} V${y + 30}" stroke="#E6E1D3" stroke-width="2"/>
      <ellipse cx="18" cy="${y + 16}" rx="6" ry="16" ${PAPER}/><ellipse cx="18" cy="${y + 16}" rx="2.5" ry="7" ${CORE}/>`;
  }
  const KINDS = {
    m: "Coffee mug", g: "Glass of water", s: "Succulent", v: "Vase", h: "Phone", y: "Ball of yarn", i: "Pencil",
    f: "Your food bowl", L: "Lamp", l: "Lemon", b: "Pile of books", c: "Candle", p: "Paper towels",
  };
  // a thing's drawing without its shadow, for one in the air
  const noShadow = svg => svg.replace(/<ellipse cx="50" cy="84"[^>]*rgba\(70,35,10,\.28\)"\/>/, "");
  // a piece of tape across a square, part of a strip (Knock It Off, Tail Chase)
  const TAPE = `<rect x="-1" y="33" width="102" height="34" fill="#EFE6CC" opacity=".95"/><path d="M-1 33 H101 M-1 67 H101" stroke="#BFAE84" stroke-width="2.5"/>
    <path d="M8 40 L22 60 M38 40 L52 60 M68 40 L82 60" stroke="#D9CDA8" stroke-width="2"/>`;
  // a patch of catnip (Knock It Off, Tail Chase and Pounce Up)
  const CATNIP = `<ellipse cx="50" cy="52" rx="38" ry="32" fill="#B9D59E" opacity=".75"/>
    <g fill="#6AA673" stroke="#3C6E45" stroke-width="1.5">${[[30, 40, -40], [50, 30, 0], [70, 40, 40], [36, 64, -70], [64, 64, 70], [50, 56, 0]].map(([x, y, a]) =>
      `<path d="M${x} ${y + 9} C${x - 8} ${y + 2} ${x - 6} ${y - 8} ${x} ${y - 11} C${x + 6} ${y - 8} ${x + 8} ${y + 2} ${x} ${y + 9} Z" transform="rotate(${a} ${x} ${y})"/>`).join("")}</g>
    <g fill="#D9C8F0" stroke="#7885BA" stroke-width="1"><circle cx="42" cy="26" r="3.5"/><circle cx="58" cy="24" r="3.5"/><circle cx="50" cy="20" r="3.5"/></g>`;
  return {INK, SHADOW, HEART, ART, rollArt, KINDS, noShadow, TAPE, CATNIP};
})();
