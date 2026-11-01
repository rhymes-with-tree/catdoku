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


def tuxface(x, y, s):
    """Bowtie: a black cat face with a white blaze and chin, and yellow eyes."""
    return (catface(x, y, s, "#221E26").split("<circle")[0]
            + f'<path d="M{x-s*.55} {y+s}Q{x} {y+s*.05} {x+s*.55} {y+s}Z" fill="#fff"/>'
            f'<path d="M{x} {y-s*.55}L{x} {y+s*.2}" stroke="#fff" stroke-width="{s*.12}"/>'
            f'<circle cx="{x-s*.38}" cy="{y+s*.1}" r="{s*.16}" fill="#E8C547"/><circle cx="{x+s*.38}" cy="{y+s*.1}" r="{s*.16}" fill="#E8C547"/>')


def tabbyface(x, y, s):
    """Higgins: a brown tabby face with an M of stripes on the forehead and green eyes."""
    return (catface(x, y, s, "#A98663").split("<circle")[0]
            + f'<path d="M{x-s*.42} {y-s*.2}L{x-s*.3} {y-s*.5}L{x} {y-s*.3}L{x+s*.3} {y-s*.5}L{x+s*.42} {y-s*.2}'
            f'M{x-s} {y+s*.25}L{x-s*.65} {y+s*.3}M{x+s} {y+s*.25}L{x+s*.65} {y+s*.3}" stroke="#825840" stroke-width="{s*.14}" fill="none" stroke-linecap="round"/>'
            f'<circle cx="{x-s*.38}" cy="{y+s*.1}" r="{s*.16}" fill="{LIME}"/><circle cx="{x+s*.38}" cy="{y+s*.1}" r="{s*.16}" fill="{LIME}"/>')


def fredface(x, y, s):
    """Fred: a white face and ears, a tabby cap split by a white blaze, green eyes, and a sky-blue collar."""
    return (f'<path d="M{x-s*.62} {y+s*.95}Q{x} {y+s*1.35} {x+s*.62} {y+s*.95}" fill="none" stroke="{INK}" stroke-width="{s*.42}" stroke-linecap="round"/>'
            f'<path d="M{x-s*.62} {y+s*.95}Q{x} {y+s*1.35} {x+s*.62} {y+s*.95}" fill="none" stroke="#9FC7DB" stroke-width="{s*.22}" stroke-linecap="round"/>'
            + catface(x, y, s, "#FBF8F0").split("<circle")[0]
            + f'<path d="M{x-s*.78} {y-s*.8}L{x-s*.45} {y-s*.58}L{x-s*.82} {y-s*.25}Z M{x+s*.78} {y-s*.8}L{x+s*.45} {y-s*.58}L{x+s*.82} {y-s*.25}Z" fill="#EDB9B0"/>'
            f'<path d="M{x-s*.45} {y-s*.58}L{x+s*.45} {y-s*.58}L{x+s*.92} {y-s*.2}L{x+s*.95} {y+s*.02}Q{x+s*.4} {y+s*.08} {x+s*.12} {y-s*.12}'
            f'L{x} {y-s*.5}L{x-s*.12} {y-s*.12}Q{x-s*.4} {y+s*.08} {x-s*.95} {y+s*.02}L{x-s*.92} {y-s*.2}Z" fill="#9C8877"/>'
            + catface(x, y, s, "none").split("<circle")[0]
            + f'<circle cx="{x-s*.38}" cy="{y+s*.1}" r="{s*.16}" fill="{GREEN}"/><circle cx="{x+s*.38}" cy="{y+s*.1}" r="{s*.16}" fill="{GREEN}"/>')


def crunchface(x, y, s):
    """Crunch: a grey tabby face with stripes on the forehead and cheeks, and green eyes."""
    return (catface(x, y, s, "#8E8794").split("<circle")[0]
            + f'<path d="M{x-s*.3} {y-s*.5}L{x-s*.22} {y-s*.2}M{x} {y-s*.55}L{x} {y-s*.22}M{x+s*.3} {y-s*.5}L{x+s*.22} {y-s*.2}'
            f'M{x-s} {y+s*.3}L{x-s*.65} {y+s*.35}M{x+s} {y+s*.3}L{x+s*.65} {y+s*.35}" stroke="#5E5866" stroke-width="{s*.13}" fill="none" stroke-linecap="round"/>'
            f'<circle cx="{x-s*.38}" cy="{y+s*.1}" r="{s*.17}" fill="{GREEN}"/><circle cx="{x+s*.38}" cy="{y+s*.1}" r="{s*.17}" fill="{GREEN}"/>')


def bugsyface(x, y, s):
    """Bugsy: a fluffy white face with brown patches over the ears and one eye, eyes shut in a nap."""
    return (catface(x, y, s, "#FBF8F0").split("<circle")[0]
            + f'<path d="M{x-s*.92} {y-s*.95}L{x-s*.35} {y-s*.55}L{x+s*.05} {y-s*.55}Q{x+s*.05} {y-s*.1} {x-s*.2} {y+s*.25}Q{x-s*.6} {y+s*.35} {x-s*.98} {y+s*.1}Z'
            f'M{x+s*.92} {y-s*.95}L{x+s*.5} {y-s*.55}Q{x+s*.75} {y-s*.3} {x+s*.97} {y-s*.2}Z" fill="#8A6A52"/>'
            + catface(x, y, s, "none").split("<circle")[0]
            + f'<path d="M{x-s*.55} {y+s*.1}Q{x-s*.38} {y+s*.25} {x-s*.21} {y+s*.1}M{x+s*.21} {y+s*.1}Q{x+s*.38} {y+s*.25} {x+s*.55} {y+s*.1}" '
            f'stroke="{INK}" stroke-width="{s*.11}" fill="none" stroke-linecap="round"/>')


def layaface(x, y, s):
    """Laya: a smooth grey face with pinkish ears and big brown eyes."""
    return (catface(x, y, s, "#77706B").split("<circle")[0]
            + f'<path d="M{x-s*.82} {y-s*.8}L{x-s*.45} {y-s*.58}L{x-s*.86} {y-s*.2}ZM{x+s*.82} {y-s*.8}L{x+s*.45} {y-s*.58}L{x+s*.86} {y-s*.2}Z" fill="#C9A29A"/>'
            + catface(x, y, s, "none").split("<circle")[0]
            + f'<circle cx="{x-s*.38}" cy="{y+s*.1}" r="{s*.19}" fill="#6B3A22"/><circle cx="{x+s*.38}" cy="{y+s*.1}" r="{s*.19}" fill="#6B3A22"/>'
            f'<circle cx="{x-s*.32}" cy="{y+s*.03}" r="{s*.06}" fill="#fff"/><circle cx="{x+s*.44}" cy="{y+s*.03}" r="{s*.06}" fill="#fff"/>')


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
    for c, r in ((1, 0), (3, 1), (0, 2), (2, 3)):   # one per row, column and region, none touching; Higgins is the tabby
        out += (tabbyface if (c, r) == (1, 0) else catface)(o + (c + .5) * s, o + (r + .55) * s, 6)
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
    out += layaface(50, 62, 10)   # Laya, on the rug inside the track
    return frame("#C9A26B", out)


# Pounce: toys on a mat, three of a kind lined up.
def pounce():
    cols = [[PLUM, TEAL, GREEN], [ORANGE, ORANGE, ORANGE], [TEAL, GREEN, PLUM]]
    out = '<rect x="14" y="38" width="72" height="24" rx="12" fill="#F6D36B" opacity=".75"/>'
    for r in range(3):
        for c in range(3):
            x, y, k = 26 + c * 24, 26 + r * 24, cols[r][c]
            if (r, c) == (2, 2):   # Crunch, eyeing the line of three
                out += crunchface(x, y + 1, 9.5); continue
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
    out += bugsyface(50, 78, 9)   # Bugsy, napping on a clear bit of mat
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
    out += fredface(38, 62, 11)   # Fred
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
    # Jan Brady's ears peeking out of a box: black with pink insides
    out += (f'<path d="M64 64L68 50L75 60ZM76 60L83 50L87 64Z" fill="#3A3440" stroke="{INK}" stroke-width="2" stroke-linejoin="round"/>'
            f'<path d="M67.3 61L69 54.5L72.2 59.4ZM78.8 59.4L82 54.5L83.7 61Z" fill="#E7A9A5"/>')
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


# Open the Door!: rooms of numbers with their signs, one door swung open and one still shut.
def opendoor():
    s, o = 24, 14
    floors = ["#FFF4D6", "#FFF4D6", "#E2DDEC", "#DDE7D6", "#DDE7D6", "#E2DDEC", "#EDD9D3", "#EDD9D3", "#E2DDEC"]
    out = ""
    for k, f in enumerate(floors):
        out += f'<rect x="{o + k % 3 * s}" y="{o + k // 3 * s}" width="{s}" height="{s}" fill="{f}"/>'
    for k, v in enumerate([1, 2, 3, 3, 1, 2, 2, 3, 1]):
        out += text(o + k % 3 * s + 12, o + k // 3 * s + 14, v, 13)
    out += text(o + 7, o + 5, "3+", 7) + text(o + 2 * s + 6, o + 5, "6×", 7) + text(o + 5, o + s + 5, "4+", 7) + text(o + 5, o + 2 * s + 5, "1−", 7)
    walls = f"M{o} {o}H{o+3*s}V{o+3*s}H{o}Z M{o+2*s} {o}V{o+s+7}M{o+2*s} {o+s+17}V{o+3*s} M{o} {o+s}H{o+2*s} M{o} {o+2*s}H{o+5}M{o+19} {o+2*s}H{o+2*s}"
    out += f'<path d="{walls}" fill="none" stroke="{INK}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>'
    # open: the door from the wall below the 3+ room's left square, swung up into it
    out += f'<rect x="{o+17}" y="{o+2*s-15}" width="3" height="15" rx="1" fill="#B07C4F" stroke="{INK}" stroke-width="1.2"/>'
    # shut: a door in the wall between the 6× room and the middle
    out += f'<rect x="{o+2*s-1.6}" y="{o+s+5}" width="3.2" height="14" rx="1" fill="#B07C4F" stroke="{INK}" stroke-width="1.2"/>'
    return frame("#F3EBDD", out)


# Tunnel Run: tunnel pieces on a rug round the cat's bed, the joined ones purple and crinkly, one still grey.
def tunnelrun():
    s, o = 24, 14
    PURPLE, RIB, GREY, EDGE = "#9874CA", "#7C5AB0", "#8C98AA", "#3E3848"
    # each square: the sides its tunnel opens onto (u r d l), and whether it's joined yet
    tiles = [("rd", 1), ("rdl", 1), ("l", 1), ("ud", 1), ("u", 1), ("ud", 0), ("ur", 1), ("rl", 1), ("l", 1)]
    out = ""
    for layer in ("edge", "tube", "rib"):
        for k, (sides, on) in enumerate(tiles):
            cx, cy = o + k % 3 * s + s / 2, o + k // 3 * s + s / 2
            ends = {"u": (cx, cy - s / 2), "r": (cx + s / 2, cy), "d": (cx, cy + s / 2), "l": (cx - s / 2, cy)}
            d = "".join(f"M{cx} {cy}L{ends[c][0]} {ends[c][1]}" for c in sides)
            if layer == "edge":
                out += f'<circle cx="{cx}" cy="{cy}" r="6.5" fill="{EDGE}"/><path d="{d}" stroke="{EDGE}" stroke-width="13" fill="none"/>'
            elif layer == "tube":
                c = PURPLE if on else GREY
                out += f'<path d="{d}" stroke="{c}" stroke-width="10" fill="none"/><circle cx="{cx}" cy="{cy}" r="5" fill="{c}"/>'
                if len(sides) == 1 and k != 4:
                    out += f'<circle cx="{cx}" cy="{cy}" r="3.2" fill="#3A2F45"/>'
            elif on and len(sides) > 1:
                out += f'<path d="{d}" stroke="{RIB}" stroke-width="10" stroke-dasharray="1.2 2.6" fill="none" opacity=".8"/>'
    # Bowtie looking out of the tunnel in the middle
    out += f'<circle cx="{o + s * 1.5}" cy="{o + s * 1.5}" r="11" fill="#4A2F86" stroke="{PURPLE}" stroke-width="4"/>'
    out += f'<circle cx="{o + s * 1.5}" cy="{o + s * 1.5}" r="13" fill="none" stroke="{EDGE}" stroke-width="1.5"/>'
    out += tuxface(o + s * 1.5, o + s * 1.5 + 1, 6.5)
    return frame("#E8DCC4", out)


# Copycat: four boxes, two open on the same toy, two still shut.
def copycat():
    out = ""
    for r in range(2):
        for c in range(2):
            x, y = 16 + c * 36, 16 + r * 36
            if (r, c) in ((0, 0), (1, 1)):
                out += (f'<rect x="{x}" y="{y}" width="32" height="32" rx="3" fill="#E3C394" stroke="{INK}" stroke-width="2"/>'
                        f'<path d="M{x} {y}L{x+7} {y+7}H{x+25}L{x+32} {y}M{x} {y+32}L{x+7} {y+25}H{x+25}L{x+32} {y+32}" fill="none" stroke="{INK}" stroke-width="1.5" opacity=".6"/>')
                out += yarnball(x + 16, y + 16, 8, PLUM)
            else:
                out += (f'<rect x="{x}" y="{y}" width="32" height="32" rx="3" fill="#D9A86C" stroke="{INK}" stroke-width="2"/>'
                        f'<line x1="{x}" y1="{y+16}" x2="{x+32}" y2="{y+16}" stroke="{INK}" stroke-width="1.5" opacity=".45"/>'
                        f'<rect x="{x+12}" y="{y}" width="8" height="32" fill="#F3D7AE" opacity=".6"/>')
    return frame("#C99A6B", out)


# Night Light: a dark room of cats, most asleep, one with glowing eyes.
def nightlight():
    out = ""
    for r in range(2):
        for c in range(2):
            x, y = 30 + c * 40, 32 + r * 38
            out += (f'<path d="M{x-14} {y+8}C{x-16} {y-2} {x-15} {y-8} {x-13} {y-12}L{x-12} {y-22}L{x-5} {y-14}C{x-2} {y-15} {x+2} {y-15} {x+5} {y-14}'
                    f'L{x+12} {y-22}L{x+13} {y-12}C{x+15} {y-8} {x+16} {y-2} {x+14} {y+8}C{x+10} {y+16} {x-10} {y+16} {x-14} {y+8}Z" fill="#0F0C1C" stroke="#6E6590" stroke-width="1.5"/>')
            if (r, c) == (0, 1):   # Dottie, still awake, with her yellow-green eyes
                out += (f'<ellipse cx="{x-6}" cy="{y}" rx="4.5" ry="3.8" fill="#D4DB5E"/><ellipse cx="{x+6}" cy="{y}" rx="4.5" ry="3.8" fill="#D4DB5E"/>'
                        f'<ellipse cx="{x-6}" cy="{y}" rx="1.1" ry="3.2" fill="#0F0C1C"/><ellipse cx="{x+6}" cy="{y}" rx="1.1" ry="3.2" fill="#0F0C1C"/>')
            else:
                out += f'<path d="M{x-10} {y}Q{x-6} {y+3} {x-2} {y}M{x+2} {y}Q{x+6} {y+3} {x+10} {y}" fill="none" stroke="#8C82B4" stroke-width="1.8" stroke-linecap="round"/>'
    return frame("#221D36", out)


# Unravel: a strand of yarn along part of a pegboard shape, the ball at its end, an arrow on one line.
def unravel():
    pts = {(0, 0): (24, 26), (1, 0): (50, 26), (2, 0): (76, 26), (0, 1): (24, 52), (1, 1): (50, 52), (2, 1): (76, 52), (0, 2): (24, 78), (1, 2): (50, 78), (2, 2): (76, 78)}
    rest = [((0, 0), (1, 0)), ((1, 0), (2, 0)), ((2, 0), (2, 1)), ((1, 0), (1, 1)), ((2, 1), (2, 2)), ((1, 2), (2, 2))]
    done = [((0, 2), (0, 1)), ((0, 1), (1, 1)), ((1, 1), (1, 2)), ((1, 2), (0, 2))]
    out = ""
    for a, b in rest:
        (x1, y1), (x2, y2) = pts[a], pts[b]
        out += f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#9A8768" stroke-width="2.5" stroke-dasharray="5 3.5" stroke-linecap="round"/>'
    out += f'<path d="M73 61L76 67L79 61Z" fill="#9A8768"/>'
    d = "M" + " L".join(f"{pts[p][0]} {pts[p][1]}" for p in [(0, 2), (0, 1), (1, 1), (1, 2), (0, 2)])
    out += f'<path d="{d}" fill="none" stroke="{INK}" stroke-opacity=".3" stroke-width="9" stroke-linejoin="round"/>'
    out += f'<path d="{d}" fill="none" stroke="{ORANGE}" stroke-width="7" stroke-linejoin="round"/>'
    for p in pts.values(): out += circle(p[0], p[1], 3.2, "#fff", 1.8)
    out += yarnball(24, 78, 8, ORANGE)
    return frame(PAPER, out)


# Tail Chase: the cat from above on a rug, a strand of yarn trailing behind it, a toy ahead.
def tailchase():
    out = ""
    for y in range(14, 92, 12): out += f'<rect x="7" y="{y}" width="86" height="6" fill="#C99A6B" opacity=".18"/>'
    out += f'<path d="M24 76 L24 52 L56 52 L56 34" fill="none" stroke="{INK}" stroke-opacity=".25" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>'
    out += f'<path d="M24 76 L24 52 L56 52 L56 34" fill="none" stroke="{PLUM}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>'
    out += circle(24, 78, 5, PLUM, 2)
    # Jan Brady from above: white and fluffy with a black saddle, a black head with a white blaze, and his big dark tail
    out += (f'<g transform="translate(56 30)"><path d="M2 13 C4 20 11 20 13 14" fill="none" stroke="{INK}" stroke-width="7" stroke-linecap="round"/>'
            f'<path d="M2 13 C4 20 11 20 13 14" fill="none" stroke="#3A3440" stroke-width="4" stroke-linecap="round"/>'
            f'<ellipse cx="0" cy="6" rx="7" ry="9" fill="#FBF8F0" stroke="{INK}" stroke-width="2"/><ellipse cx="0" cy="3" rx="5.5" ry="2.5" fill="#3A3440"/>'
            f'<path d="M-5.5 -9 L-5 -16 L-1 -12 Z M5.5 -9 L5 -16 L1 -12 Z" fill="#3A3440" stroke="{INK}" stroke-width="1.6" stroke-linejoin="round"/>'
            f'<circle cx="0" cy="-6" r="6" fill="#3A3440" stroke="{INK}" stroke-width="2"/><path d="M-1.5 -11.6 L0 -5.5 L1.5 -11.6Z" fill="#FBF8F0"/></g>')
    out += yarnball(78, 24, 7, TEAL)
    return frame("#E9D3B4", out)


# Keyboard Cat: three rows of keys, some with paw prints, one gold, and a big paw reaching in.
def keyboardcat():
    out = f'<rect x="12" y="34" width="76" height="52" rx="7" fill="#3B3646"/>'
    on = {(0, 2), (0, 5), (1, 1), (1, 6), (2, 3)}
    for r, n in enumerate((6, 5, 4)):
        for c in range(n):
            x, y = 17 + r * 5 + c * 11.5, 40 + r * 15
            works = (r, c) == (0, 3) or (r, c) in on
            fill = YELLOW if (r, c) == (0, 3) else "#F7F1E4" if works else "#4A4556"
            tilt = "" if works else f' transform="rotate({((r * 5 + c) * 37 % 11 - 5) * 2} {x + 4.8} {y + 5.5})"'
            out += f'<rect x="{x}" y="{y + (0 if works else 1)}" width="9.5" height="11" rx="2" fill="{fill}"{tilt}/>'
    out += (f'<rect x="45" y="0" width="16" height="30" fill="#E9A15B" stroke="{INK}" stroke-width="2.2"/>'
            f'<ellipse cx="53" cy="32" rx="11" ry="9" fill="#E9A15B" stroke="{INK}" stroke-width="2.2"/>')
    for x in (45.5, 50.5, 55.5, 60.5): out += f'<circle cx="{x}" cy="39.5" r="3.1" fill="#E9A15B" stroke="{INK}" stroke-width="1.8"/>'
    return frame("#ECEEE7", out)


# If It Fits: an odd-shaped box built from tangram pieces of cardboard, with a cat sitting in it.
def iffits():
    pieces = [((18, 80), (50, 48), (50, 80), "#D6AB74"), ((50, 48), (82, 80), (50, 80), "#CB9C63"),
              ((50, 48), (66, 32), (82, 48), (66, 64), "#C4925C"), ((34, 32), (50, 48), (34, 48), "#DDB685"),
              ((18, 48), (34, 32), (34, 48), "#D2A570")]
    out = ""
    for *pts, c in pieces:
        out += f'<polygon points="{" ".join(f"{x},{y}" for x, y in pts)}" fill="{c}" stroke="#8E6534" stroke-width="2" stroke-linejoin="round"/>'
    out += catface(44, 58, 11, "#8C98AA")
    return frame("#E8DCC4", out)


# High Perch: a 3 × 3 floor of cat trees of different heights, an arrow pointing down to the shorter tree, and a
# lookout cat at the end of a row.
def highperch():
    s, o = 20, 29
    out = f'<rect x="{o}" y="{o}" width="{3*s}" height="{3*s}" fill="#F7EFE1" stroke="{INK}" stroke-width="2"/>'
    out += "".join(f'<path d="M{o+k*s} {o}V{o+3*s}M{o} {o+k*s}H{o+3*s}" stroke="{INK}" stroke-opacity=".18" stroke-width="1.2"/>' for k in (1, 2))
    for k, h in enumerate([3, 1, 2, 2, 3, 1, 1, 2, 3]):
        x, y = o + k % 3 * s, o + k // 3 * s
        cx, base, top = x + s * .55, y + s - 2.5, y + s - 2.5 - h * 4.9
        out += f'<rect x="{cx-1.6}" y="{top}" width="3.2" height="{base-top}" fill="#C9A574"/>'
        out += f'<rect x="{cx-7}" y="{base-1.6}" width="14" height="2.6" rx="1.2" fill="#A9805A"/>'
        out += f'<rect x="{cx-6.5}" y="{top-2}" width="13" height="3.4" rx="1.6" fill="#8E5E3E"/>'
        out += text(x + 5.5, y + 6.5, h, 8)
    # an arrow between the first two trees, pointing at the shorter
    ax, ay = o + s, o + s / 2
    out += f'<circle cx="{ax}" cy="{ay}" r="4.2" fill="#F7EFE1" stroke="{INK}" stroke-opacity=".3" stroke-width="1"/>'
    out += f'<path d="M{ax-1.8} {ay-2.6}L{ax+1.8} {ay}L{ax-1.8} {ay+2.6}" fill="none" stroke="{INK}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'
    # a lookout cat left of the middle row, seeing two trees
    out += catface(o - 13, o + s * 1.5, 6.5, "#5A4A6E") + text(o - 13, o + s * 1.5 + 2, 2, 7, "#FFF4D2")
    return frame("#F1E7D6", out)


# Spelling String: three pompom toys hanging on strings, each a googly-eyed head above its letter (the last with one
# more pompom below), lined up across the gold bar so it spells CAT, with yarn tails underneath. All palette colours:
# the toys in the game's first three toy colours (gold, periwinkle, brick), the bar a tint of gold outlined in ink,
# on a tint of pacific blue.
def tint(c, f):
    return "#" + "".join(f"{round(int(c[k:k + 2], 16) * f + 255 * (1 - f)):02X}" for k in (1, 3, 5))


def fuzzyspelling():
    out = f'<rect x="8" y="44" width="84" height="22" rx="4" fill="{tint(YELLOW, .45)}" stroke="{INK}" stroke-width="2"/>'
    for cx, col, ch, extra in [(28, YELLOW, "C", 0), (50, PERI, "A", 0), (72, RED, "T", 1)]:
        balls = [(33, None), (55, ch)] + [(77, None)] * extra
        out += f'<path d="M{cx} 8V{balls[-1][0]}" stroke="{YELLOW}" stroke-width="1.6"/>'
        for y, letter in balls:
            out += f'<circle cx="{cx}" cy="{y}" r="9.5" fill="{col}" stroke="{INK}" stroke-width="1.4"/>'
            if letter:   # ink with a white halo, as on the game's pompoms
                out += f'<text x="{cx}" y="{y + 1}" font-size="12" fill="{INK}" stroke="#fff" stroke-width="2.4" paint-order="stroke" stroke-linejoin="round" {FONT}>{letter}</text>'
            elif y == 33:   # the head's googly eyes
                out += "".join(f'<circle cx="{cx + dx}" cy="{y - 1}" r="2.6" fill="#fff" stroke="{INK}" stroke-width=".8"/><circle cx="{cx + dx + .5}" cy="{y}" r="1.2" fill="{INK}"/>' for dx in (-3.5, 3.5))
        tail = balls[-1][0] + 10
        for t, c2 in zip((-4, -1.5, 1.5, 4), (ORANGE, PLUM, TEAL, LIME)):
            out += f'<path d="M{cx} {tail}q{t} 6 {t * 1.6} 12" fill="none" stroke="{c2}" stroke-width="1.8" stroke-linecap="round"/>'
    return frame(tint(TEAL, .22), out)

# Cat Mat: a fringed rug of coloured squares, the top corner already flooded one colour, a pot of dye
# tipped over at the corner and Crunch's face beside it.
def catastrophe():
    rows = ["TTTYO", "TTYOP", "YTOOY", "OPYTO"]
    cols = {"T": TEAL, "Y": YELLOW, "O": ORANGE, "P": PLUM}
    x0, y0, s = 17, 38, 13.2
    out = "".join(f'<path d="M{x} {y0 + 3}V{y0 + 4 * s - 3}" stroke="{INK}" stroke-width="1.6" stroke-dasharray="1.6 2.4"/>' for x in (x0 - 4, x0 + 5 * s + 4))
    for r, row in enumerate(rows):
        for c, ch in enumerate(row):
            out += f'<rect x="{x0 + c * s}" y="{y0 + r * s}" width="{s + .3}" height="{s + .3}" fill="{cols[ch]}"/>'
    out += f'<rect x="{x0}" y="{y0}" width="{5 * s}" height="{4 * s}" rx="2" fill="none" stroke="{INK}" stroke-width="3"/>'
    # the pot, knocked over at the corner with its mouth to the rug, and a splash of dye under it
    out += f'<ellipse cx="{x0 + 14}" cy="{y0 + 3}" rx="11" ry="5" fill="{TEAL}" stroke="{INK}" stroke-width="2"/>'
    out += (f'<g transform="translate(19 25) rotate(125) scale(.62) translate(-33 -26)"><path d="M18 15L21 37L45 37L48 15Z" fill="#C9CCD6" stroke="{INK}" stroke-width="3.5" stroke-linejoin="round"/>'
            f'<path d="M20 26H46L45 33H21Z" fill="{TEAL}"/><ellipse cx="33" cy="15" rx="15" ry="4.5" fill="{TEAL}" stroke="{INK}" stroke-width="3.5"/></g>')
    out += crunchface(70, 24, 13)
    return frame(PAPER, out)


def laserpointer():
    # a beam from the pointer at the bottom, bouncing off two mirrors and past a cat to the dot on the wall
    out = f'<rect x="14" y="14" width="72" height="72" rx="6" fill="#E8DCC4" stroke="{INK}" stroke-width="2.5"/>'
    beam = "M30 88V30H70V62H88"
    out += f'<path d="{beam}" fill="none" stroke="{ORANGE}" stroke-width="9" stroke-linejoin="round" opacity=".25"/>'
    out += f'<path d="{beam}" fill="none" stroke="{ORANGE}" stroke-width="3.5" stroke-linejoin="round"/>'
    for x, y, a in ((30, 30, -45), (70, 30, 45), (70, 62, 45)):
        out += (f'<g transform="translate({x} {y}) rotate({a})"><rect x="-9" y="-3" width="18" height="6" rx="2.5" fill="#E4E8F0" stroke="{PERI}" stroke-width="2"/></g>')
    out += f'<rect x="25.5" y="84" width="9" height="13" rx="3" fill="#3E3848"/>'
    out += circle(88, 62, 4.5, "#C8392B", 1.5)
    out += catface(50, 31, 9, "#E8956F")
    return frame(PAPER, out)


def treattime():
    # a tray of fish-shaped treats with numbers, one put back
    out = f'<rect x="10" y="30" width="62" height="56" rx="6" fill="#F3E6D9" stroke="{INK}" stroke-width="2.5"/>'
    def fish(x, y, n, gone=False):
        o = .25 if gone else 1
        s = (f'<g opacity="{o}"><path d="M{x-12} {y}C{x-8} {y-8} {x+2} {y-9} {x+6} {y-3}L{x+12} {y-7}C{x+11} {y-2} {x+11} {y+2} {x+12} {y+7}L{x+6} {y+3}C{x+2} {y+9} {x-8} {y+8} {x-12} {y}Z" '
             f'fill="#E8B35A" stroke="#B9822E" stroke-width="1.5"/>' + text(x - 2, y + 1, n, 12) + '</g>')
        if gone: s += f'<path d="M{x-9} {y+6}L{x+9} {y-6}" stroke="{INK}" stroke-width="2" stroke-linecap="round" opacity=".6"/>'
        return s
    for (x, y, n, g) in ((26, 44, 3, False), (55, 44, 5, True), (26, 71, 6, False), (55, 71, 2, False)):
        out += fish(x, y, n, g)
    # Higgins by the top row, whose bowl is just right: 3, with the 5 put back
    out += tabbyface(84, 23, 9)
    out += f'<path d="M74 38H94L91 49H77Z" fill="{GREEN}" stroke="{INK}" stroke-width="2.2" stroke-linejoin="round"/>' + text(84, 43, 3, 10, "#fff")
    return frame(PAPER, out)


def dottieface(x, y, s):
    """Dottie: an all-black cat face with yellow-green eyes."""
    return (catface(x, y, s, "#221E26").split("<circle")[0]
            + f'<circle cx="{x-s*.38}" cy="{y+s*.1}" r="{s*.17}" fill="#C9D35A"/><circle cx="{x+s*.38}" cy="{y+s*.1}" r="{s*.17}" fill="#C9D35A"/>')


def upatree():
    # a cat tree of three perches climbing CAT, COT, DOT, with Dottie at the top and the feather above her
    out = f'<rect x="47" y="30" width="6" height="58" fill="#C99A62" stroke="#5A3D25" stroke-width="1.5"/>'
    for y, word, c in ((80, "CAT", "#C9B9D6"), (60, "COT", "#E3B9A9"), (40, "DOT", "#B7C8BC")):
        out += f'<ellipse cx="50" cy="{y + 3}" rx="30" ry="5" fill="{c}" stroke="{INK}" stroke-width="2"/>'
        for i, ch in enumerate(word):
            changed = (word == "COT" and i == 1) or (word == "DOT" and i == 0)
            out += f'<rect x="{31 + i * 13}" y="{y - 11}" width="12" height="12" rx="2.5" fill="{"#DCEBD9" if changed else "#fff"}" stroke="{INK}" stroke-width="1.5"/>' + text(37 + i * 13, y - 4.6, ch, 9)
    out += f'<path d="M72 6V12" stroke="#5E5866" stroke-width="1.5"/><path d="M72 12l-4 7M72 12l4 7M72 12v9" stroke="{PLUM}" stroke-width="3" stroke-linecap="round"/>'
    out += dottieface(86, 33, 7)
    return frame(PAPER, out)


# Toydoku: a 4 × 4 Sudoku of toys in 2 × 2 boxes, a few squares still to fill, and Laya looking on.
def toydoku():
    grid = ["ABCD", "C.AB", "B.D.", "DCB."]
    col = {"A": RED, "B": TEAL, "C": YELLOW, "D": PLUM}
    s, o, out = 18, 14, ""
    out += f'<rect x="{o}" y="{o}" width="{4*s}" height="{4*s}" fill="#FBF6EC"/>'
    for k in (1, 3):
        out += f'<line x1="{o+k*s}" y1="{o}" x2="{o+k*s}" y2="{o+4*s}" stroke="{INK}" stroke-width=".8" opacity=".35"/><line x1="{o}" y1="{o+k*s}" x2="{o+4*s}" y2="{o+k*s}" stroke="{INK}" stroke-width=".8" opacity=".35"/>'
    out += f'<line x1="{o+2*s}" y1="{o}" x2="{o+2*s}" y2="{o+4*s}" stroke="{INK}" stroke-width="3"/><line x1="{o}" y1="{o+2*s}" x2="{o+4*s}" y2="{o+2*s}" stroke="{INK}" stroke-width="3"/>'
    for r in range(4):
        for c in range(4):
            v = grid[r][c]
            if v != ".":
                out += yarnball(o + (c + .5) * s, o + (r + .5) * s, 6.2, col[v])
    out += f'<rect x="{o}" y="{o}" width="{4*s}" height="{4*s}" fill="none" stroke="{INK}" stroke-width="3" rx="2"/>'
    out += layaface(o + 3.5 * s, o + 3.55 * s, 7.5)   # Laya, in the last empty square
    return frame("#B3B94B", out)


# Pick of the Pile: a heap of toy blocks in three layers on a rug, each layer's blocks with their own colour of side.
def pickpile():
    w, h, d, out = 22, 26, 4, f'<rect x="10" y="12" width="80" height="76" rx="10" fill="{tint(TEAL, .45)}" stroke="{INK}" stroke-width="2"/>'
    def block(x, y, side, toy):
        return (f'<rect x="{x+d}" y="{y+d}" width="{w}" height="{h}" rx="4" fill="{side}" stroke="{INK}" stroke-width="1.6"/>'
                f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="4" fill="#FDF8EC" stroke="{INK}" stroke-width="1.8"/>' + yarnball(x + w / 2, y + h / 2, 7, toy))
    for (x, y, side, toy) in [(14, 28, PERI, PLUM), (38, 28, PERI, RED), (62, 28, PERI, YELLOW), (14, 56, PERI, RED), (38, 56, PERI, TEAL),
                              (62, 56, PERI, PLUM), (22, 38, GREEN, YELLOW), (50, 38, GREEN, TEAL), (36, 22, ORANGE, RED)]:
        out += block(x, y, side, toy)
    return frame(PAPER, out)


# Scratch That: a room from above, a scratching post with the floor it can see in gold, a sofa, and an armchair
# with a 1 (the post beside it).
def scratchthat():
    s, o, out = 18, 14, ""
    post = (1, 1)
    seen = {(1, 0), (1, 1), (2, 1), (3, 1), (0, 1)}
    for r in range(4):
        for c in range(4):
            fill = tint(YELLOW, .45) if (c, r) in seen else tint(TEAL, .2)
            out += f'<rect x="{o+c*s}" y="{o+r*s}" width="{s}" height="{s}" fill="{fill}" stroke="{tint(TEAL, .5)}" stroke-width=".8"/>'
    # a two-seat sofa along the top right, an armchair with a 1 under the post
    out += (f'<rect x="{o+2*s+1.5}" y="{o+1.5}" width="{2*s-3}" height="{s-3}" rx="3" fill="{tint(PERI, .9)}" stroke="{INK}" stroke-width="1.8"/>'
            f'<rect x="{o+2*s+5}" y="{o+6}" width="{s-6}" height="{s-9}" rx="2" fill="{tint(PERI, .4)}"/><rect x="{o+3*s+1}" y="{o+6}" width="{s-6}" height="{s-9}" rx="2" fill="{tint(PERI, .4)}"/>'
            f'<rect x="{o+s+1.5}" y="{o+2*s+1.5}" width="{s-3}" height="{s-3}" rx="3" fill="{tint(PLUM, .9)}" stroke="{INK}" stroke-width="1.8"/>'
            f'<rect x="{o+s+5}" y="{o+2*s+6}" width="{s-10}" height="{s-9}" rx="2" fill="{tint(PLUM, .4)}"/>' + text(o + 1.5 * s, o + 2.62 * s, "1", 11))
    x, y = o + post[0] * s + s / 2, o + post[1] * s
    out += (f'<ellipse cx="{x}" cy="{y+s-3}" rx="7" ry="2.4" fill="#C9B9D6" stroke="{INK}" stroke-width="1.4"/>'
            f'<rect x="{x-3}" y="{y+4}" width="6" height="{s-7}" rx="1.5" fill="#C99A62" stroke="#5A3D25" stroke-width="1.2"/>'
            f'<ellipse cx="{x}" cy="{y+4}" rx="6" ry="2" fill="#C9B9D6" stroke="{INK}" stroke-width="1.4"/>')
    out += f'<rect x="{o}" y="{o}" width="{4*s}" height="{4*s}" fill="none" stroke="{INK}" stroke-width="3" rx="2"/>'
    return frame(PAPER, out)


# Fridge Magnets: a fridge door with a corner of crossword on it, alphabet magnets in its white squares
# (CAT, TOP, MAP) and one square still empty, waiting for its letter.
def magnets():
    out = (f'<rect x="10" y="10" width="80" height="80" rx="8" fill="{PAPER}" stroke="{INK}" stroke-width="2.5"/>'
           f'<rect x="15" y="26" width="5" height="48" rx="2.5" fill="#DCDDD5" stroke="{INK}" stroke-width="1.8"/>'
           f'<rect x="26" y="20" width="58" height="58" rx="3" fill="{INK}"/>')
    s, x0, y0 = 14, 28, 22
    grid = ["CAT.", "..O.", "M_P.", "...."]
    colours = {"C": RED, "A": TEAL, "T": GREEN, "O": YELLOW, "M": PLUM, "P": PERI}
    for r, row in enumerate(grid):
        for c, ch in enumerate(row):
            if ch == ".": continue
            x, y = x0 + c * s, y0 + r * s
            out += f'<rect x="{x}" y="{y}" width="{s-1.5}" height="{s-1.5}" rx="1.5" fill="{"#FFF0C2" if ch == "_" else "#FBFAF5"}"/>'
            if ch != "_":
                out += (f'<text x="{x+s/2-.7}" y="{y+s/2}" font-size="13" fill="{colours[ch]}" stroke="{INK}" stroke-width="1.3" '
                        f'paint-order="stroke" {FONT}>{ch}</text>')
    return frame("#ECEEE7", out)


# Purrfect Square: a 3 x 3 magic square (2 7 6, 9 5 1, 4 3 8) with one square still a paw print, and gold paws at
# the ends of the rows that add up.
def purrfect():
    out, s, x0, y0 = "", 20, 14, 22
    nums = [2, 7, 6, 9, 5, 1, 4, 3, 0]
    for k, v in enumerate(nums):
        x, y = x0 + k % 3 * s, y0 + k // 3 * s
        out += f'<rect x="{x+1}" y="{y+1}" width="{s-2}" height="{s-2}" rx="3.5" fill="{"#FBFAF5" if v else tint(TEAL, .25)}" stroke="{INK}" stroke-width="2"/>'
        out += text(x + s / 2, y + s / 2 + .5, v, 13) if v else text(x + s / 2, y + s / 2 + .5, "\U0001F43E", 10)
    for r in (0, 1):
        cx, cy, f = x0 + 3 * s + 11, y0 + r * s + s / 2, .17
        out += f'<g transform="translate({cx - 50 * f} {cy - 43 * f}) scale({f})" fill="{YELLOW}" stroke="{INK}" stroke-width="2">'
        out += "".join(f'<ellipse cx="{a}" cy="{b}" rx="9.5" ry="10.75" transform="rotate({t} {a} {b})" vector-effect="non-scaling-stroke"/>' for a, b, t in [(16.5, 30.5, -24), (38.5, 15, -8), (61.5, 15, 8), (83.5, 30.5, 24)])
        out += '<path d="M100 6 C126 6 141 28 153 46 C172 50 197 70 195 101 C193 133 166 147 140 141 C125 138 112 131 100 131 C88 131 75 138 60 141 C34 147 7 133 5 101 C3 70 28 50 47 46 C59 28 74 6 100 6Z" transform="translate(19 35.3) scale(.31 .298)" vector-effect="non-scaling-stroke"/></g>'
    out += text(x0 + 3 * s + 11, y0 + 2 * s + s / 2, "7", 12, "#8A8494")
    return frame(PAPER, out)


# Catlas: a scrap of world map (sea, two pieces of land), one country lit up in coral, and a cat's face hiding in it.
def atlas():
    land = f'fill="{PAPER}" stroke="{INK}" stroke-width="2.2" stroke-linejoin="round"'
    out = (f'<path d="M14 24Q22 14 38 18Q50 14 56 24Q60 34 52 40Q46 48 50 58Q46 70 36 66Q30 58 24 56Q12 52 14 40Z" {land}/>'
           f'<path d="M62 46Q70 38 82 44Q90 52 86 64Q88 76 78 84Q66 86 60 76Q54 66 62 46Z" {land}/>'
           f'<path d="M58 22Q66 16 72 22Q76 28 70 32Q62 34 58 28Z" {land}/>'
           f'<path d="M24 26Q34 22 42 28Q48 36 42 44Q36 50 28 46Q20 40 24 26Z" fill="{ORANGE}" stroke="{INK}" stroke-width="2.2" stroke-linejoin="round"/>'
           f'<path d="M14 40Q22 46 24 56" fill="none" stroke="{INK}" stroke-width="1.2" opacity=".35"/>'
           f'<path d="M62 46Q72 58 86 64" fill="none" stroke="{INK}" stroke-width="1.2" opacity=".35"/>')
    out += catface(34, 37, 6.5, YELLOW)
    return frame("#C9DEE1", out)


def catburglar():
    """A painting in a gilt frame, a picture light over it, and a cat's face hiding in its hills."""
    out = (f'<rect x="38" y="13" width="24" height="6" rx="3" fill="{YELLOW}" stroke="{INK}" stroke-width="2"/>'
           f'<rect x="14" y="23" width="72" height="62" rx="3" fill="{YELLOW}" stroke="{INK}" stroke-width="2.5"/>'
           f'<rect x="22" y="31" width="56" height="46" fill="#CFE3E6" stroke="{INK}" stroke-width="2"/>'
           f'<circle cx="64" cy="42" r="5" fill="{PAPER}" stroke="{INK}" stroke-width="1.6"/>'
           f'<path d="M22 64Q34 50 46 58Q58 46 78 56L78 77L22 77Z" fill="{GREEN}" stroke="{INK}" stroke-width="2" stroke-linejoin="round"/>'
           f'<path d="M22 72Q40 64 56 70Q68 66 78 70L78 77L22 77Z" fill="{LIME}" stroke="{INK}" stroke-width="1.6" stroke-linejoin="round"/>')
    out += catface(40, 64, 6, "#8E9E5A")
    return frame("#D5D9E8", out)


# Cat Pile: a corner of the blanket with an L-shaped clump of napping cats on it (a long ginger cat along the bottom, a grey
# cat curled up above), and a toy on the blanket waiting for a cat to lie on it.
def catpile():
    s, o, out = 18, 14, ""
    for r in range(4):
        for c in range(4):
            out += f'<rect x="{o+c*s}" y="{o+r*s}" width="{s}" height="{s}" fill="{tint(YELLOW, .09)}"/>'
    out += f'<rect x="{o}" y="{o}" width="{4*s}" height="{4*s}" fill="none" stroke="{INK}" stroke-width="3" rx="2"/>'
    # the clump's blanket: an L of five squares in one piece, a deeper outline under a soft coral
    cells = [(0, 2), (0, 3), (1, 3), (2, 3), (3, 3)]
    for inset, fill in [(1.5, RED), (3, ORANGE)]:
        for (c, r) in cells:
            out += f'<rect x="{o+c*s+inset}" y="{o+r*s+inset}" width="{s-2*inset}" height="{s-2*inset}" rx="{max(1, 3-inset/2)}" fill="{fill}"/>'
        out += f'<rect x="{o+inset}" y="{o+3*s+inset}" width="{4*s-2*inset}" height="{s-2*inset}" fill="{fill}"/>'
        out += f'<rect x="{o+inset}" y="{o+2*s+inset}" width="{s-2*inset}" height="{2*s-2*inset}" fill="{fill}"/>'
    # a long ginger cat stretched along the bottom: body, head with ears, stripes and a tail
    y = o + 3.5 * s
    out += (f'<path d="M{o+s*1.2} {y}Q{o+s*.6} {y+5} {o+s*.75} {y+6.5}" fill="none" stroke="{INK}" stroke-width="5.2" stroke-linecap="round"/>'
            f'<path d="M{o+s*1.2} {y}Q{o+s*.6} {y+5} {o+s*.75} {y+6.5}" fill="none" stroke="{ORANGE}" stroke-width="3" stroke-linecap="round"/>'
            f'<rect x="{o+s*1.05}" y="{y-5.5}" width="{s*2.1}" height="11" rx="5.5" fill="{ORANGE}" stroke="{INK}" stroke-width="1.8"/>'
            f'<path d="M{o+s*1.6} {y-5}v10M{o+s*2} {y-5}v10M{o+s*2.4} {y-5}v10" stroke="{RED}" stroke-width="1.6"/>'
            f'<path d="M{o+s*3.4+2} {y-5}l5 -2.2l-1.2 5Z M{o+s*3.4+2} {y+5}l5 2.2l-1.2 -5Z" fill="{ORANGE}" stroke="{INK}" stroke-width="1.5" stroke-linejoin="round"/>'
            f'<circle cx="{o+s*3.4}" cy="{y}" r="5.6" fill="{ORANGE}" stroke="{INK}" stroke-width="1.8"/>'
            f'<path d="M{o+s*3.3} {y-2.4}q1.2 1 0 2M{o+s*3.3} {y+.6}q1.2 1 0 2" fill="none" stroke="{INK}" stroke-width="1.1"/>')
    # a grey cat curled up in a ball above it, nose to tail
    cx, cy = o + s / 2, o + 2.5 * s
    out += (f'<circle cx="{cx}" cy="{cy}" r="6.6" fill="{tint("#5E5866", .62)}" stroke="{INK}" stroke-width="1.8"/>'
            f'<path d="M{cx-5} {cy+2.5}Q{cx} {cy+7} {cx+5} {cy+1.5}" fill="none" stroke="#5E5866" stroke-width="2.2" stroke-linecap="round"/>'
            f'<path d="M{cx-3.6} {cy-5}l-1 -3.2l3 1.4Z M{cx+.6} {cy-6.4}l1.2 -3l1.8 2.6Z" fill="{tint("#5E5866", .62)}" stroke="{INK}" stroke-width="1.2" stroke-linejoin="round"/>')
    out += yarnball(o + 2.5 * s, o + 1.5 * s, 6, PLUM)
    return frame(PAPER, out)


# Fish Bones: the fish skeleton from the owner's sketch, a black head and tail with the spine between, and letter
# bones in Waffle's colours spelling BONES along it, with a rib down through the B and the N, and Bowtie peeking in.
def fishbones():
    s, x0, y0 = 11, 25, 50
    out = (f'<path d="M14 {y0}H86" stroke="{INK}" stroke-width="3" stroke-linecap="round"/>'
           f'<path d="M24 {y0-19}C17 {y0-22} 8 {y0-13} 8 {y0}C8 {y0+13} 17 {y0+22} 24 {y0+19}C20 {y0+9} 20 {y0-9} 24 {y0-19}Z" fill="{INK}"/>'
           f'<circle cx="14" cy="{y0-2}" r="2" fill="{PAPER}"/>'
           f'<path d="M81 {y0}C84 {y0-6} 88 {y0-15} 94 {y0-17}C93 {y0-8} 91 {y0-3} 90 {y0}C91 {y0+3} 93 {y0+8} 94 {y0+17}C88 {y0+15} 84 {y0+6} 81 {y0}Z" fill="{INK}"/>')
    grey = tint(INK, .22)
    bones = [(0, -1, "", YELLOW), (0, 1, "", grey), (2, -1, "", GREEN), (2, 1, "", YELLOW)]
    bones += [(i, 0, ch, c) for i, (ch, c) in enumerate(zip("BONES", (GREEN, YELLOW, GREEN, grey, GREEN)))]
    for c, r, ch, fill in bones:
        x, y = x0 + c * s, y0 + r * s - s / 2
        out += f'<rect x="{x+.6}" y="{y+.6}" width="{s-1.2}" height="{s-1.2}" rx="2.4" fill="{fill}" stroke="{INK}" stroke-width="1.3"/>'
        if ch: out += text(x + s / 2, y + s / 2 + .3, ch, 8.5, "#fff" if fill == GREEN else INK)
    out += tuxface(78, 22, 9)
    return frame(PAPER, out)


# Toy Stash: three shut boxes along the top, two guesses of toys under them, and paw prints beside each guess
# (dark for a right toy in the right box, light for a right toy in another box).
def pawprint(x, y, s, fill):
    toes = "".join(f'<ellipse cx="{x+dx*s}" cy="{y+dy*s}" rx="{s*.2}" ry="{s*.24}" fill="{fill}" stroke="{INK}" stroke-width="1"/>'
                   for dx, dy in ((-.5, -.22), (-.18, -.5), (.18, -.5), (.5, -.22)))
    return toes + f'<ellipse cx="{x}" cy="{y+s*.25}" rx="{s*.42}" ry="{s*.34}" fill="{fill}" stroke="{INK}" stroke-width="1"/>'


def stash():
    out = ""
    for i in range(3):
        x = 12 + i * 19
        out += (f'<rect x="{x}" y="14" width="16" height="16" rx="2" fill="#D9A86C" stroke="{INK}" stroke-width="2"/>'
                f'<line x1="{x}" y1="22" x2="{x+16}" y2="22" stroke="{INK}" stroke-width="1.2" opacity=".45"/>'
                f'<rect x="{x+6}" y="14" width="4" height="16" fill="#F3D7AE" opacity=".6"/>')
    out += f'<path d="M10 39H90" stroke="{INK}" stroke-width="1.6" stroke-dasharray="3 3" opacity=".45"/>'
    for r, (balls, paws) in enumerate((((PLUM, YELLOW, TEAL), (INK, "#fff", None)), ((YELLOW, PLUM, RED), (INK, INK, None)))):
        y = 55 + r * 24
        for i, c in enumerate(balls): out += yarnball(20 + i * 19, y, 8, c)
        for k, f in enumerate(paws):
            px, py = 74 + (k % 2) * 10, y - 4.5 + (k // 2) * 10
            out += pawprint(px, py, 6.5, f) if f else f'<circle cx="{px}" cy="{py}" r="1.8" fill="{INK}" opacity=".25"/>'
    return frame(tint(TEAL, .3), out)


# Knit Pick: a knitted blanket of letters in plain yarn, one word (KNIT) dyed in a colourway, and Laya peeking over the top.
def knitpick():
    out = f'<rect x="12" y="24" width="76" height="66" rx="6" fill="{tint(PERI, .45)}" stroke="{INK}" stroke-width="2.5"/>'
    out += "".join(f'<line x1="{x}" y1="25.5" x2="{x}" y2="88.5" stroke="{tint(PERI, .3)}" stroke-width="1.6"/>' for x in range(15, 88, 4))
    rows, dyed = ["CATS", "KNIT", "PURR", "YARN"], ("#9874CA", "#B94588", "#E16A4A", "#ECA818")
    for r, word in enumerate(rows):
        for c, ch in enumerate(word):
            x, y = 17 + c * 16.5, 29 + r * 14.5
            fill = dyed[c] if r == 1 else PAPER
            out += (f'<rect x="{x}" y="{y}" width="16.5" height="14.5" fill="{fill}"/>'
                    f'<path d="M{x+8.25} {y+13.5}C{x+4} {y+11} {x+2.5} {y+6} {x+3} {y+1.5}C{x+6} {y+3.5} {x+8} {y+8} {x+8.25} {y+13.5}Z'
                    f'M{x+8.25} {y+13.5}C{x+12.5} {y+11} {x+14} {y+6} {x+13.5} {y+1.5}C{x+10.5} {y+3.5} {x+8.5} {y+8} {x+8.25} {y+13.5}Z" '
                    f'fill="{INK}" opacity="{.12 if r != 1 else .18}"/>')
            out += text(x + 8.25, y + 7.8, ch, 10.5, "#fff" if r == 1 else INK)
    out += f'<rect x="17" y="29" width="66" height="58" fill="none" stroke="{INK}" stroke-width="1.2" opacity=".35"/>'
    out += layaface(74, 17, 10)
    return frame(PAPER, out)


def birdwatch():
    """A tall window of three panes on a periwinkle wall, a robin on the middle pane, and Zzz from the napping human."""
    sky, white = tint(TEAL, .4), PAPER
    out = f'<rect x="22" y="12" width="56" height="78" rx="3" fill="{white}" stroke="{INK}" stroke-width="2.5"/>'
    for y in (17, 41, 65):
        out += f'<rect x="27" y="{y}" width="46" height="21" fill="{sky}" stroke="{INK}" stroke-width="1.6"/>'
    out += f'<rect x="27" y="56" width="46" height="5" fill="{tint(GREEN, .55)}"/><rect x="27" y="80" width="46" height="6" fill="{tint(GREEN, .55)}"/>'
    # the robin, sitting on the bottom of the middle pane
    shade = lambda c, f: "#" + "".join(f"{round(int(c[k:k + 2], 16) * (1 - f) + int(INK[k:k + 2], 16) * f):02X}" for k in (1, 3, 5))
    brown, wing = shade(RED, .55), shade(RED, .7)   # as the robin in the game
    out += (f'<g stroke="{INK}" stroke-width="1.6" stroke-linejoin="round"><path d="M41 53 L33 49 L34 56 Z" fill="{wing}"/>'
            f'<ellipse cx="48" cy="54" rx="9" ry="6.5" fill="{brown}"/><path d="M52 50 C58 52 58 59 52 60 Z" fill="{ORANGE}" stroke="none"/>'
            f'<circle cx="55" cy="46" r="5.5" fill="{brown}"/><path d="M60 45 L65 46.5 L60 48 Z" fill="{YELLOW}"/></g>'
            f'<circle cx="56.5" cy="45" r="1.2" fill="{INK}"/>')
    out += f'<rect x="16" y="88" width="68" height="6" rx="2" fill="{white}" stroke="{INK}" stroke-width="2.2"/>'
    out += text(80, 76, "z", 10, PLUM) + text(86, 66, "Z", 13, PLUM)
    return frame(tint(PERI, .5), out)


# Shelf Life: a pale shelf of nine balls of yarn shading from corner to corner, with a tag on the one in the corner.
def shelflife():
    def mix(a, b, t):
        return "#" + "".join(f"{round(int(a[k:k + 2], 16) * (1 - t) + int(b[k:k + 2], 16) * t):02X}" for k in (1, 3, 5))
    corners = (tint(YELLOW, .55), ORANGE, TEAL, PLUM)
    out = f'<rect x="13" y="13" width="74" height="74" rx="4" fill="{PAPER}" stroke="{INK}" stroke-width="3"/>'
    for r in range(3):
        for c in range(3):
            x, y = 16 + c * 23, 16 + r * 23
            top, bottom = mix(corners[0], corners[1], c / 2), mix(corners[2], corners[3], c / 2)
            out += f'<rect x="{x}" y="{y}" width="22" height="22" rx="2" fill="{tint(INK, .1)}"/>'
            out += yarnball(x + 11, y + 12, 8.5, mix(top, bottom, r / 2))
    out += (f'<path d="M19 21Q22 24 24 25" fill="none" stroke="{INK}" stroke-width="1.2"/>'
            f'<g transform="translate(19 20) rotate(-35)"><path d="M-2 0L3 -4.5H12V4.5H3Z" fill="#fff" stroke="{INK}" stroke-width="1.5" stroke-linejoin="round"/></g>')
    return frame(PAPER, out)


# Meowbile: a mobile hanging level from the ceiling, two toys on one end balancing one on the other, with a weight
# badge on each.
def meowbile():
    out = (f'<rect x="38" y="13" width="24" height="5" rx="2" fill="{INK}"/><path d="M50 18V32M24 32V44M76 32V44M24 58V64" stroke="{INK}" stroke-width="1.8"/>'
           f'<path d="M22 32H78" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>' + circle(50, 32, 3.5, PAPER, 2))
    for x, y, c in ((24, 51, TEAL), (24, 71, YELLOW), (76, 51, PLUM)):
        out += yarnball(x, y, 7.5, c)
    for x, y, v in ((31, 57, "2"), (31, 77, "?"), (83, 57, "5")):
        out += circle(x, y, 5.5, PAPER, 1.8) + text(x, y + .5, v, 9)
    return frame(tint(PERI, .2), out)

def kittencaboodle():
    # the mother's sign, UN-, with her face beside it; under it three kittens' words: UNDO spelled (its kitten,
    # Marmalade, awake in orange), and two with only the root's letters in (their kittens asleep, in grey)
    out = (f'<rect x="12" y="11" width="50" height="22" rx="5" fill="{tint(PERI, .35)}" stroke="{INK}" stroke-width="2.2"/>'
           + text(37, 22.5, "UN-", 15) + catface(78, 22, 10, tint(INK, .3)))
    for r, (fill, word, kit) in enumerate(((ORANGE, "UNDO", True), (None, "UN", False), (None, "UN", False))):
        y = 44 + r * 17
        out += catface(19, y + 6, 6, fill if kit else tint(INK, .15))
        for i in range(4):
            ch = word[i] if i < len(word) else ""
            bg = tint(GREEN, .45) if kit else tint(PERI, .3) if ch else "#fff"
            out += f'<rect x="{31 + i * 14.5}" y="{y}" width="13" height="13" rx="2.5" fill="{bg}" stroke="{INK}" stroke-width="1.6"/>'
            if ch: out += text(37.5 + i * 14.5, y + 7, ch, 9.5)
    return frame(tint(LIME, .2), out)


# Wind Up: Gus above a wicker basket of yarn, a big teal ball and a plum one in it, and a small yellow ball dropping in.
def windup():
    gus = (catface(50, 22, 11, "#A8A7AE").split("<circle")[0]
           + f'<path d="M{50-11*.42} {22-11*.2}L{50-11*.3} {22-11*.5}L50 {22-11*.3}L{50+11*.3} {22-11*.5}L{50+11*.42} {22-11*.2}" stroke="#5E5866" stroke-width="1.6" fill="none" stroke-linecap="round"/>'
           f'<circle cx="{50-11*.38}" cy="{22+11*.1}" r="{11*.16}" fill="{LIME}"/><circle cx="{50+11*.38}" cy="{22+11*.1}" r="{11*.16}" fill="{LIME}"/>')
    wicker = "#BB871E"   # gold, a quarter ink, as the basket in the game
    out = yarnball(35, 56, 15, TEAL) + yarnball(65, 59, 12, PLUM) + yarnball(52, 40, 7.5, YELLOW)
    out += f'<path d="M14 62H86L80 90H20Z" fill="{tint(YELLOW, .75)}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>'
    out += "".join(f'<path d="M{x} 64V88" stroke="{wicker}" stroke-width="2"/>' for x in range(24, 80, 8))
    out += "".join(f'<path d="M{17 + (y - 62) * 6 / 28} {y}H{83 - (y - 62) * 6 / 28}" stroke="{wicker}" stroke-width="2.4" stroke-dasharray="4 4" stroke-dashoffset="{(y // 7) % 2 * 4}"/>' for y in (70, 77, 84))
    out += f'<rect x="10" y="58" width="80" height="8" rx="4" fill="{wicker}" stroke="{INK}" stroke-width="2.5"/>'
    return frame(PAPER, out + gus)



# L-M-N-O-Pom: a pile of letter pompoms, L M N O along the bottom and an M on top at the right, with a pair, P and O,
# falling on its gold string, and Marmalade's orange face peeking in at the top left. Pompoms in the game's colours
# (pacific blue, plum, sage, lime, periwinkle; gold for a 2L), ink letters with a white halo, on a tint of lavender.
def lmnopom():
    def pom(x, y, col, ch):
        return (f'<circle cx="{x}" cy="{y}" r="10.5" fill="{col}" stroke="{INK}" stroke-width="1.6"/>'
                f'<text x="{x}" y="{y + 1}" font-size="13" fill="{INK}" stroke="#fff" stroke-width="2.6" paint-order="stroke" stroke-linejoin="round" {FONT}>{ch}</text>')
    marm = (catface(25, 30, 11, ORANGE).split("<circle")[0]
            + f'<circle cx="{25-11*.38}" cy="{30+11*.1}" r="{11*.16}" fill="{GREEN}"/><circle cx="{25+11*.38}" cy="{30+11*.1}" r="{11*.16}" fill="{GREEN}"/>')
    out = f'<path d="M50 40H72" stroke="{YELLOW}" stroke-width="2.6"/>' + pom(50, 40, PLUM, "P") + pom(72, 40, YELLOW, "O")
    out += "".join(pom(x, 80, c, ch) for x, c, ch in [(20, TEAL, "L"), (40, PLUM, "M"), (60, GREEN, "N"), (80, LIME, "O")])
    out += pom(80, 59, PERI, "M")
    return frame(tint("#8D78AD", .15), marm + out)


# Window Ledges: a brick wall with arched windows, three of them lit gold with a digit, the rest dark, and two white
# shutters (the clue squares) with their totals, in the game's colours.
def windowledges():
    out = "".join(f'<path d="M10 {y}H90" stroke="#000" stroke-opacity=".22" stroke-width="1.4"/>' for y in range(18, 90, 10))
    def win(x, y, lit, d):
        fill = YELLOW if lit else INK
        return (f'<path d="M{x} {y + 20}V{y + 9}a9.5 9.5 0 0 1 19 0V{y + 20}Z" fill="{fill}" stroke="{PAPER}" stroke-width="3" stroke-linejoin="round"/>'
                + text(x + 9.5, y + 14.5, d, 13, INK if lit else PAPER))
    def shutter(x, y, n):
        return (f'<rect x="{x}" y="{y}" width="21" height="21" rx="2" fill="{PAPER}" stroke="{INK}" stroke-width="2"/>'
                f'<path d="M{x + 1} {y + 1}L{x + 20} {y + 20}" stroke="{tint(INK, .2)}" stroke-width="3.5"/>' + text(x + 15.5, y + 6.5, n, 8.5))
    out += shutter(14, 14, "7") + win(40, 14, True, "3") + win(66, 14, False, "")
    out += win(14, 40, False, "") + win(40, 40, True, "4") + shutter(66, 40, "9")
    out += shutter(14, 66, "5") + win(40, 66, False, "") + win(66, 66, True, "2")
    return frame(RED, out)

# Cat Shuffle: a cat's face on a patchwork quilt, cut into nine pieces with thin gaps between; the piece from the middle
# of the right-hand side has slid down into the gap. Palette colours: the quilt in tints of teal, gold, plum and
# periwinkle, the cat in coral, on lavender's palette neighbour (a tint of plum).
def catshuffle():
    x0, t = 14, 24
    patches = "".join(f'<rect x="{x0 + c * 18}" y="{x0 + r * 18}" width="18" height="18" fill="{tint((TEAL, YELLOW, PLUM, PERI)[(r * 3 + c * 2) % 4], .5)}"/>'
                      for r in range(4) for c in range(4))
    pic = f'<g id="pic">{patches}{catface(50, 54, 21, ORANGE)}</g>'
    out = f'<defs>{pic}' + "".join(f'<clipPath id="cs{p}"><rect x="{x0 + p % 3 * t}" y="{x0 + p // 3 * t}" width="{t}" height="{t}"/></clipPath>' for p in range(9)) + '</defs>'
    out += f'<rect x="{x0}" y="{x0}" width="{3 * t}" height="{3 * t}" fill="{tint(INK, .25)}"/>'
    where = {p: p for p in range(8)}; where[5] = 8   # piece 5 slid down into the bottom right; the gap is where it was
    for p, sq in where.items():
        dx, dy = (sq % 3 - p % 3) * t, (sq // 3 - p // 3) * t
        out += f'<g transform="translate({dx} {dy})"><use href="#pic" clip-path="url(#cs{p})"/></g>'
    out += "".join(f'<path d="M{x0 + k * t} {x0}V{x0 + 3 * t}M{x0} {x0 + k * t}H{x0 + 3 * t}" stroke="{PAPER}" stroke-width="1.6"/>' for k in (1, 2))
    out += f'<rect x="{x0}" y="{x0}" width="{3 * t}" height="{3 * t}" fill="none" stroke="{INK}" stroke-width="2.5"/>'
    return frame(tint(PLUM, .35), out)

ICONS = {"catdoku": catdoku, "yarn": yarn, "patches": patches, "sunbeams": sunbeams, "toybox": toybox, "pounce": pounce,
         "twirl": twirl, "toebeans": toebeans, "knockitoff": knockitoff, "hideseek": hideseek, "pawlette": pawlette,
         "tangle": tangle, "catwalk": catwalk, "tango": tango, "bubbles": bubbles,
         "opendoor": opendoor, "tunnelrun": tunnelrun, "copycat": copycat, "nightlight": nightlight, "unravel": unravel, "tailchase": tailchase, "keyboardcat": keyboardcat, "iffits": iffits, "highperch": highperch, "fuzzyspelling": fuzzyspelling, "catastrophe": catastrophe, "laserpointer": laserpointer, "treattime": treattime, "upatree": upatree, "toydoku": toydoku, "pickpile": pickpile, "scratchthat": scratchthat, "magnets": magnets, "purrfect": purrfect, "atlas": atlas, "catburglar": catburglar, "catpile": catpile, "fishbones": fishbones, "stash": stash, "knitpick": knitpick, "birdwatch": birdwatch, "shelflife": shelflife, "meowbile": meowbile, "kittencaboodle": kittencaboodle, "windup": windup, "lmnopom": lmnopom, "windowledges": windowledges, "catshuffle": catshuffle}

if __name__ == "__main__":
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "icons")
    os.makedirs(out, exist_ok=True)
    for name, make in ICONS.items():
        with open(os.path.join(out, name + ".svg"), "w") as f:
            f.write(make())
    print(len(ICONS), "icons")
