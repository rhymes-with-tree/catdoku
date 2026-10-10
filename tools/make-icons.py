"""Draws the front page's game icons: a simple picture of each game's board, as icons/<game>.svg.
Run from anywhere: python3 tools/make-icons.py"""
import math, os

INK, PAPER = "#2A2530", "#F7F8F3"
RED, ORANGE, TEAL, YELLOW, LIME, GREEN, PLUM, PERI = "#BD5538", "#E16A4A", "#73A7AE", "#ECA818", "#B3B94B", "#6AA673", "#B94588", "#7885BA"
FONT = "font-family=\"'Baloo 2',ui-rounded,system-ui,sans-serif\" font-weight=\"800\" text-anchor=\"middle\" dominant-baseline=\"central\""


def frame(bg, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
            f'<rect x="4" y="4" width="92" height="92" rx="20" fill="{bg}" stroke="{INK}" stroke-width="3"/>{body}</svg>\n')


def circle(x, y, r, fill, sw=2.5):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{INK}" stroke-width="{sw}"/>'


def text(x, y, s, size, fill=INK):
    return f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" {FONT}>{s}</text>'


def yarnball(x, y, r, c):
    return (circle(x, y, r, c) + f'<path d="M{x-r*.7} {y-r*.3}Q{x} {y+r*.4} {x+r*.7} {y-r*.3}M{x-r*.6} {y+r*.4}Q{x} {y-r*.2} {x+r*.6} {y+r*.45}" '
            f'fill="none" stroke="{INK}" stroke-width="1.6" stroke-linecap="round" opacity=".55"/>')


def catface(x, y, s, fill="#fff"):
    return (f'<path d="M{x-s} {y+s*.2}L{x-s*.9} {y-s*1.05}L{x-s*.35} {y-s*.55}L{x+s*.35} {y-s*.55}L{x+s*.9} {y-s*1.05}L{x+s} {y+s*.2}'
            f'Q{x+s} {y+s} {x} {y+s}Q{x-s} {y+s} {x-s} {y+s*.2}Z" fill="{fill}" stroke="{INK}" stroke-width="2.2" stroke-linejoin="round"/>'
            f'<circle cx="{x-s*.38}" cy="{y+s*.1}" r="{s*.13}" fill="{INK}"/><circle cx="{x+s*.38}" cy="{y+s*.1}" r="{s*.13}" fill="{INK}"/>')


# Catdoku: colour regions on a grid, a cat in each, none touching.
def catdoku():
    regions = ["AABB", "ACCB", "DCCB", "DDCB"]
    col = {"A": PLUM, "B": TEAL, "C": YELLOW, "D": GREEN}
    s, o, out = 18, 14, ""
    for r in range(4):
        for c in range(4):
            out += f'<rect x="{o+c*s}" y="{o+r*s}" width="{s}" height="{s}" fill="{col[regions[r][c]]}"/>'
    for r in range(4):
        for c in range(4):
            for (r2, c2, x1, y1, x2, y2) in ((r, c + 1, o+(c+1)*s, o+r*s, o+(c+1)*s, o+(r+1)*s), (r + 1, c, o+c*s, o+(r+1)*s, o+(c+1)*s, o+(r+1)*s)):
                if r2 > 3 or c2 > 3: continue
                wall = regions[r][c] != regions[r2][c2]
                out += f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{INK}" stroke-width="{3 if wall else .8}" opacity="{1 if wall else .35}"/>'
    out += f'<rect x="{o}" y="{o}" width="{4*s}" height="{4*s}" fill="none" stroke="{INK}" stroke-width="3" rx="2"/>'
    for c, r in ((1, 0), (3, 1), (0, 2), (2, 3)):   # one per row, column and region, none touching
        out += catface(o + (c + .5) * s, o + (r + .55) * s, 6)
    return frame(PAPER, out)


# Yarn: one strand through every square, from ball to ball.
def yarn():
    s, o, out = 24, 14, ""
    for i in range(4):
        out += (f'<line x1="{o+i*s}" y1="{o}" x2="{o+i*s}" y2="{o+3*s}" stroke="{INK}" stroke-width="1" opacity=".25"/>'
                f'<line x1="{o}" y1="{o+i*s}" x2="{o+3*s}" y2="{o+i*s}" stroke="{INK}" stroke-width="1" opacity=".25"/>')
    pts = [(0, 0), (1, 0), (2, 0), (2, 1), (1, 1), (0, 1), (0, 2), (1, 2), (2, 2)]
    d = "M" + "L".join(f"{o+(c+.5)*s} {o+(r+.5)*s}" for c, r in pts)
    out += f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/>'
    out += f'<path d="{d}" fill="none" stroke="{ORANGE}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>'
    out += yarnball(o+.5*s, o+.5*s, 9, TEAL) + yarnball(o+2.5*s, o+1.5*s, 9, PLUM) + yarnball(o+2.5*s, o+2.5*s, 9, YELLOW)
    return frame(PAPER, out)


# Patches: four fabrics stitched together, with a button.
def patches():
    out = ""
    for x, y, c, pat in ((16, 16, RED, "ging"), (50, 16, YELLOW, "stripe"), (16, 50, TEAL, "dots"), (50, 50, GREEN, "zig")):
        out += f'<rect x="{x}" y="{y}" width="34" height="34" fill="{c}"/>'
        if pat == "ging":
            out += "".join(f'<rect x="{x+i*8.5}" y="{y}" width="4.25" height="34" fill="#fff" opacity=".28"/><rect x="{x}" y="{y+i*8.5}" width="34" height="4.25" fill="#fff" opacity=".28"/>' for i in range(4))
        if pat == "stripe":
            out += "".join(f'<rect x="{x+i*6.8}" y="{y}" width="3" height="34" fill="#fff" opacity=".45"/>' for i in range(5))
        if pat == "dots":
            out += "".join(f'<circle cx="{x+5+i*8}" cy="{y+5+j*8}" r="1.8" fill="#fff" opacity=".7"/>' for i in range(4) for j in range(4))
        if pat == "zig":
            out += "".join(f'<path d="M{x} {y+6+j*9}' + "".join(f'L{x+4.25+k*8.5} {y+2+j*9}L{x+8.5+k*8.5} {y+6+j*9}' for k in range(4))
                           + '" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/>' for j in range(4))
    out += f'<path d="M50 16V84M16 50H84" stroke="{INK}" stroke-width="2" stroke-dasharray="4 3"/>'
    out += f'<rect x="16" y="16" width="68" height="68" fill="none" stroke="{PLUM}" stroke-width="3.5" stroke-dasharray="5 3"/>'
    out += circle(50, 50, 7, "#fff", 2.2) + "".join(f'<circle cx="{50+dx}" cy="{50+dy}" r="1.3" fill="{INK}"/>' for dx, dy in ((-2.2, -2.2), (2.2, -2.2), (-2.2, 2.2), (2.2, 2.2)))
    return frame(PAPER, out)


# Sunbeams: a wooden floor, a numbered spot, and its sunbeam.
def sunbeams():
    out = "".join(f'<line x1="8" y1="{y}" x2="92" y2="{y}" stroke="#5E3B22" stroke-width="1.5" opacity=".6"/>' for y in (26, 48, 70))
    out += f'<rect x="18" y="18" width="46" height="38" rx="4" fill="#F6D36B" opacity=".9" stroke="{INK}" stroke-width="2.5"/>'
    out += f'<rect x="18" y="62" width="64" height="20" rx="4" fill="none" stroke="#F6D36B" stroke-width="2" stroke-dasharray="4 3" opacity=".8"/>'
    out += circle(41, 37, 9, YELLOW, 2) + text(41, 38, "6", 13)
    out += circle(72, 30, 8, YELLOW, 2) + text(72, 31, "2", 12) + circle(50, 72, 8, YELLOW, 2) + text(50, 73, "4", 12)
    return frame("#8A5A3B", out)


# Toy Box: baskets of toys over a ball track.
def toybox():
    out = (f'<rect x="20" y="40" width="60" height="42" rx="16" fill="#8FB4B0" stroke="#F3EBDD" stroke-width="9"/>'
           f'<rect x="20" y="40" width="60" height="42" rx="16" fill="none" stroke="{INK}" stroke-width="1.5" opacity=".5"/>')
    for x, cs in ((22, (RED, GREEN)), (43.5, (PLUM, YELLOW)), (65, (TEAL, RED))):
        out += f'<rect x="{x}" y="10" width="13" height="24" rx="3" fill="#F3EBDD" stroke="{INK}" stroke-width="2"/>'
        out += circle(x + 6.5, 16.5, 3.8, cs[0], 1.4) + circle(x + 6.5, 26.5, 3.8, cs[1], 1.4)
    out += circle(34, 40, 3.8, LIME, 1.4) + circle(66, 82, 3.8, PLUM, 1.4)
    return frame("#C9A26B", out)


# Pounce: toys on a mat, three of a kind lined up.
def pounce():
    cols = [[PLUM, TEAL, GREEN], [ORANGE, ORANGE, ORANGE], [TEAL, GREEN, PLUM]]
    out = '<rect x="14" y="38" width="72" height="24" rx="12" fill="#F6D36B" opacity=".75"/>'
    for r in range(3):
        for c in range(3):
            x, y, k = 26 + c * 24, 26 + r * 24, cols[r][c]
            out += circle(x, y, 9, k, 2.2) + f'<path d="M{x-5} {y-1}Q{x} {y-6} {x+5} {y-1}" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>'
    return frame(PAPER, out)


# Twirl: ribbons on a mat, each pointing the way it slides.
def twirl():
    out = "".join(f'<circle cx="{x}" cy="{y}" r="1.2" fill="{INK}" opacity=".15"/>' for x in range(18, 90, 12) for y in range(18, 90, 12))

    def ribbon(d, c, tip, ang):
        a, (tx, ty) = math.radians(ang), tip
        head = f'M{tx+8*math.cos(a)} {ty+8*math.sin(a)}L{tx+5*math.cos(a+2.3)} {ty+5*math.sin(a+2.3)}L{tx+5*math.cos(a-2.3)} {ty+5*math.sin(a-2.3)}Z'
        return (f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="10" stroke-linecap="round"/><path d="{d}" fill="none" stroke="{c}" stroke-width="6.5" stroke-linecap="round"/>'
                f'<path d="{head}" fill="{c}" stroke="{INK}" stroke-width="2" stroke-linejoin="round"/>')
    out += ribbon("M20 30Q30 20 40 30T60 30T74 30", PLUM, (76, 30), 0)
    out += ribbon("M28 82V66Q28 58 36 58H50", TEAL, (52, 58), 0)
    out += ribbon("M74 84Q64 76 74 68T74 52", ORANGE, (74, 48), -90)
    return frame(PAPER, out)


# Toe Beans: a paw, with sums on the toes and the number to make on the pad.
def toebeans():
    out = f'<path d="M50 50C62 50 68 58 74 66C80 74 74 86 64 84C58 83 54 80 50 80C46 80 42 83 36 84C26 86 20 74 26 66C32 58 38 50 50 50Z" fill="#F2AEBB" stroke="{INK}" stroke-width="3"/>'
    for (x, y, s) in ((22, 44, "+"), (38, 26, "−"), (62, 26, "×"), (78, 44, "÷")):
        out += f'<ellipse cx="{x}" cy="{y}" rx="9" ry="10" fill="#F2AEBB" stroke="{INK}" stroke-width="2.5"/>' + text(x, y + 1, s, 13)
    out += text(50, 68, "24", 19)
    return frame(PAPER, out)


# Knock It Off: a cat on the table, a mug going over the edge.
def knockitoff():
    out = f'<rect x="14" y="14" width="64" height="72" rx="4" fill="#D9A86C" stroke="{INK}" stroke-width="3"/>'
    out += "".join(f'<line x1="14" y1="{y}" x2="78" y2="{y}" stroke="#A8743E" stroke-width="1.2" opacity=".7"/>' for y in (32, 50, 68))
    out += (f'<g transform="rotate(24 80 40)"><rect x="72" y="30" width="15" height="17" rx="3" fill="#fff" stroke="{INK}" stroke-width="2.5"/>'
            f'<rect x="72" y="35" width="15" height="4" fill="{RED}"/><path d="M87 34Q93 38 87 43" fill="none" stroke="{INK}" stroke-width="2.5"/></g>')
    out += f'<path d="M58 50Q62 46 66 50M58 56Q63 53 68 56" fill="none" stroke="{INK}" stroke-width="2" stroke-linecap="round" opacity=".5"/>'
    out += catface(38, 62, 11, ORANGE)
    return frame(PAPER, out)


# Hide & Seek: boxes on the floor, a few opened with numbers, ears peeking from one.
def hideseek():
    out = ""
    for r in range(3):
        for c in range(3):
            x, y = 15 + c * 24, 15 + r * 24
            if (r, c) in ((1, 1), (1, 0), (2, 0)):
                out += f'<rect x="{x}" y="{y}" width="22" height="22" rx="2" fill="#F3EBDD" stroke="{INK}" stroke-width="1.5"/>'
                if (r, c) == (1, 1): out += text(x + 11, y + 12, "2", 15, GREEN)
                if (r, c) == (1, 0): out += text(x + 11, y + 12, "1", 15, PERI)
            else:
                out += (f'<rect x="{x}" y="{y}" width="22" height="22" rx="2" fill="#D9B680" stroke="{INK}" stroke-width="2"/>'
                        f'<line x1="{x+11}" y1="{y}" x2="{x+11}" y2="{y+8}" stroke="{INK}" stroke-width="1.5" opacity=".5"/>')
    out += f'<path d="M66 63L69 55L73 61M78 61L82 55L85 63" fill="#8E8794" stroke="{INK}" stroke-width="2" stroke-linejoin="round"/>'
    return frame("#C9A26B", out)


# Pawlette: blocks of colour with their marks.
def pawlette():
    cols = [["#E16251", "#3FA9AE", "#F0B323"], ["#3FA9AE", "#E16251", "#E16251"], ["#F0B323", "#F0B323", "#3FA9AE"]]
    out = ""
    for r in range(3):
        for c in range(3):
            x, y, k = 15 + c * 24, 15 + r * 24, cols[r][c]
            out += f'<rect x="{x}" y="{y}" width="22" height="22" rx="5" fill="{k}" stroke="{INK}" stroke-width="1.5"/>'
            if k == "#E16251": out += f'<rect x="{x+9.5}" y="{y+5}" width="3" height="12" rx="1.5" fill="#fff"/>'
            elif k == "#3FA9AE": out += f'<circle cx="{x+11}" cy="{y+11}" r="3.2" fill="#fff"/>'
            else: out += f'<rect x="{x+5}" y="{y+9.5}" width="12" height="3" rx="1.5" fill="#fff"/>'
    return frame("#E9E3F2", out)


# Tangle: balls of yarn, their strands crossing in the middle.
def tangle():
    pts = {"a": (24, 26), "b": (76, 24), "c": (22, 74), "d": (78, 76)}
    out = ""
    for (p, q, c) in (("a", "d", PLUM), ("b", "c", TEAL), ("a", "b", ORANGE), ("c", "d", GREEN)):
        (x1, y1), (x2, y2) = pts[p], pts[q]
        out += f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{c}" stroke-width="4.5" stroke-linecap="round"/>'
    for k, (x, y) in pts.items():
        out += yarnball(x, y, 8, {"a": PLUM, "b": TEAL, "c": GREEN, "d": ORANGE}[k])
    out += f'<circle cx="50" cy="50" r="7" fill="none" stroke="{RED}" stroke-width="2.5" stroke-dasharray="3 2"/>'
    return frame("#F3E2C4", out)


# Catwalk: numbered perches linked by catwalks (one, and a pair).
def catwalk():
    def walk(x1, y1, x2, y2, off=0):
        dx, dy = (y2 - y1), -(x2 - x1)
        n = math.hypot(dx, dy); ox, oy = dx / n * off, dy / n * off
        return (f'<line x1="{x1+ox}" y1="{y1+oy}" x2="{x2+ox}" y2="{y2+oy}" stroke="{INK}" stroke-width="7" stroke-linecap="round"/>'
                f'<line x1="{x1+ox}" y1="{y1+oy}" x2="{x2+ox}" y2="{y2+oy}" stroke="#C9A26B" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 2"/>')
    out = walk(28, 32, 72, 32) + walk(72, 32, 72, 74, 4) + walk(72, 32, 72, 74, -4)
    for x, y, n, c in ((28, 32, 1, "#B9C3DE"), (72, 32, 3, "#D9C9B8"), (72, 74, 2, "#C3D9C9")):
        out += f'<ellipse cx="{x}" cy="{y+3}" rx="12" ry="6" fill="{INK}"/><ellipse cx="{x}" cy="{y}" rx="12" ry="6" fill="{c}" stroke="{INK}" stroke-width="2.2"/>'
        out += circle(x + 9, y - 8, 6.5, "#fff", 2) + text(x + 9, y - 7.5, n, 10)
    return frame("#EBDDCB", out)


# Fair Play: two toys shared out, with = and × signs between squares.
def tango():
    grid = [[0, 1, 1], [1, 0, 0], [0, 1, None]]
    out = ""
    for r in range(3):
        for c in range(3):
            x, y = 15 + c * 24, 15 + r * 24
            out += f'<rect x="{x}" y="{y}" width="22" height="22" rx="4" fill="#FBF6EC" stroke="{INK}" stroke-width="1.2"/>'
            v = grid[r][c]
            if v == 0:
                out += circle(x + 11, y + 11, 7.5, ORANGE, 2) + "".join(f'<circle cx="{x+11+dx}" cy="{y+11+dy}" r="1.4" fill="{INK}" opacity=".6"/>' for dx, dy in ((-2.5, -2), (2.5, -2), (0, 2.5)))
            if v == 1:
                out += circle(x + 11, y + 11, 7.5, TEAL, 2) + f'<path d="M{x+5} {y+9}Q{x+11} {y+5} {x+17} {y+9}M{x+5} {y+14}Q{x+11} {y+10} {x+17} {y+14}" fill="none" stroke="#fff" stroke-width="1.6" opacity=".8"/>'
    out += circle(50, 62, 5, "#fff", 1.6) + text(50, 62.5, "×", 9)   # different toys either side
    out += circle(62, 26, 5, "#fff", 1.6) + text(62, 26.5, "=", 9)   # the same toy either side
    return frame("#E9DCC4", out)


# Bubbles: bubbles under the shelf, the wand's bubble and the cat below.
def bubbles():
    out = '<rect x="10" y="12" width="80" height="6" rx="2" fill="#8A5A3B"/>'
    for r, row in enumerate([[PLUM, TEAL, TEAL, ORANGE, GREEN], [ORANGE, PLUM, GREEN, GREEN]]):
        for c, k in enumerate(row):
            x, y = 22 + c * 14 + (7 if r else 0), 25 + r * 12
            out += circle(x, y, 6.5, k, 1.8) + f'<circle cx="{x-2.2}" cy="{y-2.2}" r="1.6" fill="#fff" opacity=".8"/>'
    out += "".join(f'<circle cx="{50+i*1.2}" cy="{72-i*6}" r="1.2" fill="{INK}" opacity=".5"/>' for i in range(5))
    out += f'<line x1="50" y1="82" x2="54" y2="92" stroke="{PLUM}" stroke-width="3" stroke-linecap="round"/>' + circle(50, 80, 7, GREEN, 2) + '<circle cx="47.8" cy="77.8" r="1.6" fill="#fff" opacity=".8"/>'
    out += catface(76, 80, 7)
    return frame("#E4F0F4", out)


ICONS = {"catdoku": catdoku, "yarn": yarn, "patches": patches, "sunbeams": sunbeams, "toybox": toybox, "pounce": pounce,
         "twirl": twirl, "toebeans": toebeans, "knockitoff": knockitoff, "hideseek": hideseek, "pawlette": pawlette,
         "tangle": tangle, "catwalk": catwalk, "tango": tango, "bubbles": bubbles}

if __name__ == "__main__":
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "icons")
    os.makedirs(out, exist_ok=True)
    for name, make in ICONS.items():
        with open(os.path.join(out, name + ".svg"), "w") as f:
            f.write(make())
    print(len(ICONS), "icons")
