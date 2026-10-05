/* Colorways shared by the Catdoku family of games (Yarn's balls, Twirl's ribbons), and the color math
   for blending along them. Each colorway runs light to dark or through a few hues, and every color is
   drawn from the brand palette in index.html. */
// Colorways change along any mix of hue, lightness and saturation; each puzzle may run one either way.
// All of them are drawn from the brand palette (see index.html): its colors, their lighter and darker
// shades, and colors nudged toward the nearest of them, softer than plain neon.
// Very close: one color family, or one color fading from vivid to greyed.
const COLORWAYS = {
  "Dusty Rose": ["#D25488", "#CB6C92", "#BE8A9C", "#AE9FA5"],
  Slate:        ["#5C7ACB", "#6B81BA", "#808A9F", "#8E9296"],
  Sunset:       ["#FFDD8A", "#EBAF5B", "#DE775D", "#B34D3E", "#6E234F"],
  Lavender:     ["#E8DDF9", "#C4A7EE", "#9874CA", "#6E4B9F", "#44256F"],
  Ocean:        ["#D5F3E0", "#79D7DA", "#30A6B3", "#4867AD", "#283774"],
  Moss:         ["#EFF5C7", "#CAD578", "#6EB46B", "#398042", "#204A29"],
  Berry:        ["#FAD3E5", "#F09CC5", "#CD699D", "#993B6F", "#5C1240"],
  Pumpkin:      ["#FFE5B3", "#EFB75D", "#DA7854", "#A3492E", "#5B2919"],
  Bluebell:     ["#DEE5FB", "#ABBBF3", "#768ADA", "#4A5BAB", "#273176"],
  Heather:      ["#F6D7E3", "#E7A3C5", "#AA81CF", "#7C5AAA", "#482C73"],
};
// Medium: blends through a few neighboring colors.
const BLENDS = {
  "Sea Glass": ["#86D29B", "#46C0C1", "#3CAAC0", "#6883D2"],
  Citrus:      ["#FACE55", "#F0AB44", "#EC814D", "#E16251"],
  Sunset:      ["#F6F6A9", "#FAC366", "#EB8663", "#CB5D4A", "#9F3F73", "#603888", "#252468"],
  Lavender:    ["#FFE3F1", "#F8B0D7", "#CF90E5", "#A67EE1", "#6A6FD1", "#414EA9", "#1F2A6E"],
  Ocean:       ["#F3F9B0", "#A8EDAA", "#78CE99", "#1EABBE", "#526DB9", "#3A4390", "#1E1F5D"],
  Moss:        ["#F7F9B3", "#DEE784", "#80CB7E", "#51A366", "#157E82", "#145C68", "#212D4B"],
  Berry:       ["#FCE2C6", "#FFB0A2", "#E579A2", "#C2508B", "#9A387C", "#572B7C", "#2E134F"],
  Pumpkin:     ["#F8F9C4", "#FFD178", "#E8AB4F", "#D16C4D", "#AA4833", "#77264C", "#3D1429"],
  Bluebell:    ["#E3FBFC", "#A6E9F0", "#5AC7E0", "#768ADA", "#5E66BB", "#563687", "#321658"],
  Heather:     ["#FFF0D6", "#F9C9BE", "#E7A3C5", "#AA81CF", "#7C5AAA", "#3F428C", "#202250"],
};
// Wide range: variegated skeins running through many distinct colors.
const VARIEGATED = {
  Rainbow:  ["#BD5538", "#E16A4A", "#ECA818", "#B3B94B", "#6AA673", "#73A7AE", "#7885BA", "#B94588"],
  Jewel:    ["#874539", "#B94588", "#7885BA", "#526972", "#6AA673", "#C1C670"],
  Carnival: ["#F8D59E", "#ECA818", "#E16A4A", "#B94588", "#7885BA", "#59767F"],
  Parrot:   ["#D8D9A0", "#B3B94B", "#6AA673", "#73A7AE", "#7885BA", "#B94588", "#6F375A"],
  Mermaid:  ["#C7D7D3", "#73A7AE", "#7885BA", "#B94588", "#A54E39", "#683656"],
  Fiesta:   ["#F8D9A7", "#ECA818", "#E16A4A", "#BD5538", "#B94588", "#7885BA", "#4B5C65"],
  Candy:    ["#F1CCD3", "#D98FAF", "#B94588", "#7885BA", "#73A7AE", "#54765C"],
  Galaxy:   ["#D5DFD9", "#73A7AE", "#7885BA", "#B94588", "#BD5538", "#613451"],
  Tropical: ["#F9DDB0", "#ECA818", "#B3B94B", "#6AA673", "#73A7AE", "#7885BA", "#505371"],
  Aurora:   ["#FACEBB", "#EE967B", "#B94588", "#7885BA", "#73A7AE", "#6AA673", "#475C4E"],
};

// Colors as OKLab, so blends between them look even.
function hexLab(hex) {
  const [r, g, b] = [1, 3, 5].map(i => { const v = parseInt(hex.slice(i, i + 2), 16) / 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
  const l = Math.cbrt(.4122214708 * r + .5363325363 * g + .0514459929 * b), m = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * b), s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * b);
  return [.2104542553 * l + .793617785 * m - .0040720468 * s, 1.9779984951 * l - 2.428592205 * m + .4505937099 * s, .0259040371 * l + .7827717662 * m - .808675766 * s];
}
function labHex([L, a, b]) {
  const l = (L + .3963377774 * a + .2158037573 * b) ** 3, m = (L - .1055613458 * a - .0638541728 * b) ** 3, s = (L - .0894841775 * a - 1.291485548 * b) ** 3;
  return "#" + [4.0767416621 * l - 3.3077115913 * m + .2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s, -.0041960863 * l - .7034186147 * m + 1.707614701 * s]
    .map(v => { v = Math.min(1, Math.max(0, v)); v = v <= .0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - .055; return Math.round(v * 255).toString(16).padStart(2, "0"); }).join("");
}
// A point t (0..1) along a colorway, blended smoothly between its anchors.
function rampAt(anchors, t) {
  const x = Math.min(anchors.length - 1.0001, t * (anchors.length - 1)), i = Math.floor(x), f = x - i;
  const A = hexLab(anchors[i]), B = hexLab(anchors[i + 1]);
  return labHex(A.map((v, k) => v + (B[k] - v) * f));
}
