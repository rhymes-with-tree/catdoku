"""Pawstcards: turn each place's Wikipedia article (raw wikitext) into postcards.

A postcard is 2 or 3 sentences in a row from one paragraph of one section, with every word that names the place
covered by a paw print: its names, its people (demonyms), its capital and a few other names given by hand.
The covered words are kept in the text as [[word]] so the page can show them once the place is answered.

This file is the workings; cands.py runs it. See NOTES.md.
"""
import json, re, sys, unicodedata
import mwparserfromhell as mw

# ---------- wikitext to plain text ----------

DROP = re.compile(r"^(cite|sfn|harv|main|see also|further|webarchive|efn|refn|notetag|citation|multiple image|coord|legend|"
                  r"ref|dead link|clear|color box|navbox|reflist|short description|infobox|notelist|authority control|about|"
                  r"use |portal|sister project|wikiatlas|cbignore|excerpt|tree list|pie chart|pp-|osm relation|isbn|google books|"
                  r"multiref|pb$|for timeline|official website|css image crop|increase|decrease|steady|ipa|pn$|in lang|"
                  r"broken anchor|anchor|failed verification|better source|update|when|which|clarify|dubious|full citation|"
                  r"page needed|by whom|vague|according to whom|nbsp$|-$|cn$|fact$|r$|rp$|image|gallery|location map|"
                  r"climate chart|weather box|graph|bar box|historical populations|largest cities|panorama|wide image|"
                  r"quote box|blockquote|quote$|cquote|listen|audio|external media|commons|wikisource|wiktionary|"
                  r"spoken|toc|col-|div col|columns-list|flagicon|flag|small caps|wp|hidden|collapsible|nts$|"
                  r"good article|featured article|lowercase|italic title|engvar|use british|use american|redirect)", re.I)

UNITS = {"km2": "km²", "sqkm": "km²", "sqmi": "sq mi", "mi2": "sq mi", "km": "km", "mi": "mi", "m": "m", "ft": "ft",
         "C": "°C", "F": "°F", "ha": "ha", "acre": "acres", "km/h": "km/h", "mph": "mph", "mm": "mm", "in": "in",
         "cm": "cm", "kg": "kg", "t": "tonnes", "lb": "lb", "nmi": "nautical miles", "km3": "km³", "m3": "m³",
         "L": "litres", "MW": "MW", "GW": "GW", "kW": "kW"}


def args(t):
    return [p for p in t.params if not p.showkey]


def text_of(v):
    return render(mw.parse(str(v.value))).strip()


def render(code):
    """The wikicode with each template replaced by the words it shows (or \x00 where it shows something unknown)."""
    for t in code.filter_templates(recursive=False):
        name = str(t.name).strip().lower().replace("_", " ")
        a = args(t)
        out = None
        if name in ("lang", "lang-x", "script"): out = text_of(a[1]) if len(a) > 1 else ""
        elif name in ("transliteration", "transl", "translit"): out = text_of(a[-1]) if a else ""
        elif name in ("nihongo", "nihongo2", "nihongo3", "nowrap", "small", "noitalic", "nobold", "center", "abbr",
                      "ill", "interlanguage link", "lang-en", "big", "em", "strong", "angle bracket", "math", "mvar",
                      "smaller", "resize", "sic", "nastaliq", "korean", "chinese", "zh", "noflag", "sup", "sub",
                      "unichar", "ruby", "keypress", "lit", "literally", "gloss", "spaces", "nbsp", "snd", "ndash",
                      "mdash", "dash", "en dash", "em dash", "linktext", "c.", "circa", "ca.", "as of", "frac", "fraction",
                      "us$", "usd", "inflation", "cvt", "convert", "nts", "value", "formatnum", "currency", "okina",
                      "ʻokina", "macron", "lang-mi", "mi", "!", "-", "·", "dot", "middot", "bull"):
            if name in ("spaces", "nbsp"): out = " "
            elif name in ("snd", "ndash", "en dash", "dash"): out = " – "
            elif name in ("mdash", "em dash"): out = "—"
            elif name in ("·", "dot", "middot", "bull"): out = " · "
            elif name in ("okina", "ʻokina"): out = "ʻ"
            elif name in ("gloss", "lit", "literally"): out = "“" + (text_of(a[0]) if a else "") + "”"
            elif name == "linktext": out = "".join(text_of(x) for x in a)
            elif name in ("c.", "circa", "ca."): out = "c. " + (text_of(a[0]) if a else "")
            elif name == "as of":
                months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September",
                          "October", "November", "December"]
                y = text_of(a[0]) if a else ""
                m = text_of(a[1]) if len(a) > 1 else ""
                out = "As of " + ((months[int(m)] + " ") if m.isdigit() and 0 < int(m) < 13 else "") + y
                if t.has("lc") and str(t.get("lc").value).strip() in ("y", "yes"): out = out[0].lower() + out[1:]
            elif name in ("frac", "fraction"):
                p = [text_of(x) for x in a]
                out = p[0] if len(p) == 1 else (p[0] + "/" + p[1] if len(p) == 2 else p[0] + " " + p[1] + "/" + p[2])
            elif name in ("us$", "usd"): out = "US$" + (text_of(a[0]) if a else "")
            elif name == "inflation": out = None
            elif name in ("convert", "cvt"): out = convert([text_of(x) for x in a])
            elif name in ("formatnum", "value", "currency"): out = text_of(a[0]) if a else ""
            elif name in ("!", "-"): out = None
            else: out = text_of(a[0]) if a else ""
        elif DROP.match(name): out = ""
        if out is None: out = "\x00"
        try: code.replace(t, out)
        except ValueError: pass
    for l in code.filter_wikilinks(recursive=False):
        title = str(l.title).strip()
        if re.match(r"(?i)(file|image|category|media|wikt|wiktionary|s|commons):", title):
            try: code.replace(l, "" if not title.lower().startswith(("wikt", "s:", "commons")) else (str(l.text or title.split(":", 1)[1])))
            except ValueError: pass
    return str(code)


def convert(p):
    if not p: return None
    v = p[0]
    rest = p[1:]
    rng = ""
    if len(rest) >= 2 and rest[0] in ("to", "-", "–", "and", "or", "x", "×", "by"):
        rng = " " + ("–" if rest[0] in ("-", "–") else rest[0]) + " " + rest[1]
        rest = rest[2:]
    if not rest: return None
    unit = UNITS.get(rest[0])
    if unit is None: return None
    def fmt(x):
        try:
            f = float(x.replace(",", ""))
            if f >= 10000 and "," not in x and "." not in x: return f"{int(f):,}"
        except ValueError: pass
        return x
    if rng: rng = " " + rng.split()[0] + " " + fmt(rng.split()[1])
    return fmt(v) + rng + (" " if unit not in ("°C", "°F") else "") + unit


def clean_text(wikitext):
    s = re.sub(r"<!--.*?-->", "", wikitext, flags=re.S)
    s = re.sub(r"<ref[^>]*/\s*>", "", s)
    s = re.sub(r"<ref[^>]*>.*?</ref\s*>", "", s, flags=re.S | re.I)
    s = re.sub(r"<(gallery|timeline|imagemap|graph|chart|math|score|syntaxhighlight|div)[^>]*>.*?</\1\s*>", "", s, flags=re.S | re.I)
    while True:   # tables, innermost first
        n = re.sub(r"\{\|(?:(?!\{\|).)*?\|\}", "", s, flags=re.S)
        if n == s: break
        s = n
    return s


def sections(wikitext):
    """[(h2, h3, paragraph plain text)] for the article's body (the lead is left out)."""
    s = clean_text(wikitext)
    code = mw.parse(s)
    s = render(code)
    out, h2, h3, para = [], None, None, []
    def flush():
        if para and h2:
            raw = " ".join(para)
            txt = mw.parse(raw).strip_code(normalize=True, collapse=True)
            txt = re.sub(r"'{2,}", "", txt)
            txt = re.sub(r"<[^>]+>", "", txt)
            txt = re.sub(r"\s+", " ", txt).strip()
            txt = re.sub(r"\(\s*[,;]?\s*\)", "", txt)
            txt = re.sub(r"\(\s*[,;]\s*", "(", txt)
            txt = re.sub(r"\s+([,.;:!?)])", r"\1", txt)
            txt = re.sub(r"\(\s+", "(", txt)
            txt = re.sub(r"\s{2,}", " ", txt).strip()
            if txt: out.append((h2, h3, txt))
        para.clear()
    for line in s.split("\n"):
        m = re.match(r"^(={2,6})\s*(.*?)\s*\1\s*$", line)
        if m:
            flush()
            title = mw.parse(m.group(2)).strip_code().strip()
            if len(m.group(1)) == 2: h2, h3 = title, None
            elif len(m.group(1)) == 3: h3 = title
            continue
        st = line.strip()
        if not st: flush(); continue
        if st[0] in "*#:;|!{}" or st.startswith(("[[", "__", "<")) and not re.match(r"\[\[[^|\]]+(\|[^\]]+)?\]\]\s*\w", st):
            flush(); continue
        para.append(st)
    flush()
    return out


# ---------- categories ----------

CATS = [
    ("history", "History", r"history|prehistory|independence|colonial|empire|era|period|dynasty|century|war|ancient|medieval|modern|kingdom|republic|occupation|unification|origins|early|contemporary|post-"),
    ("geography", "Geography", r"geography|climate|biodiversity|environment|wildlife|flora|fauna|geology|topography|landscape|ecology|nature|terrain|rivers|lakes|mountains|natural|conservation|tectonics|volcan"),
    ("politics", "Politics", r"politic|government|foreign|military|armed forces|defen[cs]e|administrative|subdivision|law|human rights|legal|judiciary|constitution|elections|parliament|monarchy|international relations|provinces|states|counties|prefectures|municipalities|regions and|police|crime|corruption"),
    ("economy", "Economy", r"econom|touris|agricultur|energy|transport|infrastructure|science|technology|industry|trade|mining|fisher|manufactur|finance|telecom|water supply|sanitation|communications|research|resources|labour|labor|poverty|innovation|services|banking"),
    ("people", "People", r"demograph|language|religio|education|health|ethnic|urban|population|immigra|emigra|society|cities|largest|diaspora|minorities|family|women|indigenous|people"),
    ("culture", "Culture", r"cultur|arts?$|arts |music|cuisine|food|sport|literature|media|film|cinema|architecture|holiday|festival|dance|fashion|theat|television|press|painting|philosophy|heritage|symbols|folklore|crafts|games|comics|anime|animation|clothing|dress|wine|drink|beverage|popular"),
]
SKIP = r"etymology|name|see also|references|notes|further reading|external links|bibliography|sources|citations|footnotes|works cited|gallery"


def category(h2, h3):
    if re.search(SKIP, h2, re.I): return None
    for key in ([h3] if h3 else []) + [h2]:
        for c, _, pat in CATS:
            if re.search(pat, key, re.I) and not (key is h3 and c == "history" and not re.search(r"^history", h2, re.I)):
                return c
    return None


# ---------- sentences ----------

ABBR = r"(?:c|ca|St|Mt|Dr|Mr|Mrs|Ms|Jr|Sr|vs|approx|est|no|No|Co|Ltd|Inc|Gen|Col|Lt|Capt|Sgt|Prof|Rev|Fr|e\.g|i\.e|etc|al|U\.S|U\.K|a\.m|p\.m|Ft|ft|km|mi|sq|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)"


def split_sentences(p):
    out, start = [], 0
    for m in re.finditer(r"[.!?][\"”’)]?\s+(?=[\"“(]?[A-Z0-9])", p):
        before = p[start:m.start() + 1]
        if re.search(r"(?:\b" + ABBR + r"|\b[A-Z])\.$", before): continue
        out.append(p[start:m.end()].strip())
        start = m.end()
    tail = p[start:].strip()
    if tail: out.append(tail)
    return out


# ---------- covering the place's names ----------

def fold(s):
    out = []
    for ch in s:
        d = unicodedata.normalize("NFD", ch)[0]
        d = {"đ": "d", "Đ": "D", "ø": "o", "Ø": "O", "ł": "l", "Ł": "L", "ı": "i", "ʻ": "'", "’": "'"}.get(d, d)
        out.append(d if len(d) == 1 else ch)
    return "".join(out)


def infobox(wikitext):
    code = mw.parse(wikitext[:60000])
    for t in code.filter_templates():
        if str(t.name).strip().lower().startswith("infobox country"):
            def val(n):
                if not t.has(n): return ""
                v = clean_text(str(t.get(n).value))
                v = re.sub(r"(?i)<br\s*/?>", "\n", v)
                v = mw.parse(v)
                for tt in v.filter_templates(recursive=False):
                    nm = str(tt.name).strip().lower()
                    keep = "\n".join(str(p.value) for p in args(tt)) if re.match(r"hlist|ublist|unbulleted|flatlist|plainlist|nowrap|lang$", nm) else ""
                    if nm.startswith("lang"): keep = str(args(tt)[-1].value) if args(tt) else ""
                    try: v.replace(tt, "\n" + keep + "\n")
                    except ValueError: pass
                return v.strip_code().strip()
            return {k: val(k) for k in ("conventional_long_name", "common_name", "capital", "demonym")}
    return {}


def cover_terms(name, aka, ib, extra):
    """[(regex on folded text, case-insensitive?)] for every word to cover with a paw print."""
    names = {name, *aka, ib.get("common_name", ""), *extra.get("names", [])}
    names = {fold(n).strip() for n in names if n and len(n) >= 3}
    dem = [d.strip() for d in re.split(r"[,/\n]| or ", ib.get("demonym", "")) if d.strip()]
    dem = [re.sub(r"\s*\(.*", "", d) for d in dem]
    dem = {fold(d) for d in dem + extra.get("demonyms", []) if d and not re.search(r"informal", d, re.I)}
    caps = {fold(re.sub(r"\s*\(.*", "", c).strip()) for c in re.split(r"\n|,| and ", ib.get("capital", "")) if c.strip()}
    caps = {c for c in caps if len(c) >= 3 and c[0].isupper() and len(c.split()) <= 3} | set(map(fold, extra.get("capital", [])))
    terms = []
    for n in sorted(names | set(map(fold, extra.get("stems", []))), key=len, reverse=True):
        terms.append((r"(?<![\w-])" + re.escape(n) + r"\w*", True))
    for d in sorted(dem, key=len, reverse=True):
        terms.append((r"(?<![\w])" + re.escape(d) + r"\w*", d not in extra.get("case", [])))
    for c in sorted(caps, key=len, reverse=True):
        terms.append((r"(?<![\w])" + re.escape(c) + r"\w*", False))
    for w in extra.get("words", []):
        terms.append((r"(?<![\w])" + re.escape(fold(w)) + r"\b", False))
    stems = {n.lower()[:5] for n in names | dem | set(map(fold, extra.get("stems", []))) if len(n) >= 5}
    return terms, stems, sorted(caps)


def cover(text, terms):
    f = fold(text)
    spans = []
    for pat, ci in terms:
        for m in re.finditer(pat, f, re.I if ci else 0):
            s, e = m.span()
            # keep a possessive or plural outside the paw: "Kenya's" -> [[Kenya]]'s
            if any(s < b and e > a for a, b in spans): continue
            spans.append((s, e))
    spans.sort()
    out, last = [], 0
    for s, e in spans:
        out.append(text[last:s]); out.append("[[" + text[s:e] + "]]"); last = e
    out.append(text[last:])
    return "".join(out), len(spans)


# ---------- picking postcards ----------

DANGLING = re.compile(r"^(It|Its|It's|This|These|That|Those|They|Them|Their|He|She|His|Her|However|But|And|Also|In addition|"
                      r"Additionally|Furthermore|Moreover|Similarly|As a result|Thus|Therefore|Hence|The latter|The former|"
                      r"Such|Both|Another|Meanwhile|Instead|Despite this|Nevertheless|Nonetheless|Subsequently|Consequently|"
                      r"Likewise|Still|Yet|Then|Here|There|Afterwards|Following this|After this|By then|In turn|"
                      r"In contrast|On the other hand|Conversely|Even so|Otherwise|Besides|Other|Some of|Many of|Most of|"
                      r"One of|Each|Among them|Of these|Of them|The same|The two|The three|The country|The nation|"
                      r"The state|The island|The city|The capital|The region|The area|The government)\b")
def points_back(first, prev):
    """Does the postcard's first sentence lean on the one before it ("these months", "The company" just named)?"""
    if re.search(r"\b(these|those|this|that|such|the latter|the former|the above|the following|aforementioned|the same|"
                 r"the rest|the remainder|the others?|the second|the third|the next|the previous|the new|both)\b(?! is| was| has| had)", first, re.I) \
            and not re.match(r"(this|that) (is|was)\b", first, re.I):
        return True
    if re.match(r"(Most|Many|Some|Few|Several|All|None|A few|Others) (are|were|have|had|of)\b", first): return True
    m = re.match(r"The ([a-z]+)\b", first)
    if m and prev and re.search(r"\b" + re.escape(m.group(1)) + r"\b", prev, re.I) and m.group(1) not in ("country", "world", "economy", "population", "government", "climate", "capital", "largest", "most", "first", "main", "official", "national"):
        return True
    return False


STOPCAPS = set("The A An In On At Of For By From With During After Before As It Its This That These Those Since Until "
               "Under Over Between Among Into Through About Around Following According Although While When Where "
               "Some Many Most Several Other Each Every Both Today Since However".split())


def proper_nouns(s):
    s = re.sub(r"\[\[.*?\]\]", "", s)
    words = re.findall(r"(?<=[\s(“\"])[A-Z][\w'’-]+", " " + s)
    return sum(1 for w in words if w not in STOPCAPS)


SUPER = re.compile(r"\b(largest|oldest|highest|longest|biggest|smallest|first|only|most famous|world's|famous|known for|renowned|"
                   r"traditional|national (dish|sport|symbol|animal|flower|instrument)|tallest|deepest|unique|iconic|celebrated)\b", re.I)
DULL = re.compile(r"\b(percent|per cent|%|rate|census|estimated|approximately|per capita|GDP|index|ranked|ranking|commission|ministry|"
                  r"constituenc\w*|subdivision\w*|regulation\w*|sector|statistic\w*|survey|indicator\w*|budget|fiscal|"
                  r"expenditure|deficit|quarter|fertility|mortality|enrol\w*|tertiary|privati[sz]\w*|infrastructure|"
                  r"provision|utilities|sanitation|municipal\w*|administrative|legislation|jurisdiction|authorit(y|ies)|"
                  r"policy|policies|reform\w*|implement\w*|framework|initiative\w*|programme|program)\b", re.I)


def interest(t):
    shown = re.sub(r"\[\[.*?\]\]", "", t)
    names = set(re.findall(r"(?<=[\s(“\"])[A-Z][\w'’-]+(?:\s+[A-Z][\w'’-]+)*", " " + shown)) - STOPCAPS
    good = min(len(names), 5) + 1.5 * len(SUPER.findall(shown)) + (0.5 if re.search(r"\b\d{3,4}\b", shown) else 0)
    bad = 0.8 * len(DULL.findall(shown)) + 0.3 * shown.count("%")
    return round(good - bad, 2)


def bad_text(s):
    return ("\x00" in s or re.search(r"[\[\]{}|=<>]|\bthumb\b|px\b|\bsee below\b|\bsee above\b|\bpictured\b|\b(left|right|above|below)\)", re.sub(r"\[\[.*?\]\]", "", s))
            or s.count("(") != s.count(")") or s.count("“") != s.count("”") or s.count('"') % 2
            or not re.match(r"[\"“(]?[A-Z0-9]", s) or not re.search(r"[.!?][\"”’)]?$", s) or "  " in s
            or re.search(r"\b(km|mi|°C)\s*\(|\bISBN\b|\bp\.\s*\d|https?:", s)
            or re.search(r"(^|[\s(])[%,.;:]|\b(the|a|an|of|in|to|from|by|with|at|since|as of|estimated|about|around|"
                         r"approximately|than|and|or|was|is|were|are|be|been|some|its|their|over|under|nearly|almost|roughly)\s*[,.;:%)]", s, re.I)
            or re.search(r"\b(As of|as of)\s+(the|a|an|[a-z])", s))


def postcards(paragraphs, terms, stems, per_cat=5):
    cands = {c: [] for c, _, _ in CATS}
    for pi, (h2, h3, para) in enumerate(paragraphs):
        cat = category(h2, h3)
        if not cat: continue
        sents = split_sentences(para)
        for i in range(len(sents)):
            for n in (2, 3):
                win = sents[i:i + n]
                if len(win) < n: break
                text = " ".join(win)
                if not (130 <= len(text) <= 340): continue
                if n == 3 and len(" ".join(win[:2])) >= 150: continue   # two were long enough
                if any(len(re.findall(r"[\w'’-]+", x)) < 6 for x in win): continue
                if DANGLING.match(win[0]) or bad_text(text) or points_back(win[0], sents[i - 1] if i else ""): continue
                covered, nblank = cover(text, terms)
                shown = fold(re.sub(r"\[\[.*?\]\]", "", covered)).lower()
                if any(st in shown for st in stems): continue           # a name showing through
                if nblank > 3 or len(re.findall(r"\b\d{4}\b", text)) > 4: continue
                if re.search(r"\]\][\w]", covered): continue
                cands[cat].append({"id": f"{pi}.{i}.{n}", "t": covered, "p": pi, "i": i, "n": n, "pn": proper_nouns(covered), "b": nblank,
                                   "h": h3 or h2, "len": len(text), "score": interest(covered)})
    if CANDIDATES:
        out = {}
        for cat, cs in cands.items():
            cs = sorted(cs, key=lambda c: -c["score"])
            seen, keep = set(), []
            for c in cs:
                if c["p"] in seen: continue
                seen.add(c["p"]); keep.append(c)
                if len(keep) >= CANDIDATES: break
            out[cat] = [(c["id"], c["score"], c["t"]) for c in keep]
        return out
    chosen = {}
    for cat, cs in cands.items():
        # a card has to say something: a name, a number or a covered word, beyond the commonplace
        cs = [c for c in cs if c["pn"] >= 1 or re.search(r"\d", c["t"])]
        cs.sort(key=lambda c: (abs(c["pn"] - 2.5) + c["b"] * 0.3, -c["len"] / 1000))
        picked, used_p, used_h = [], set(), set()
        for c in cs:     # one per subsection first, then one per paragraph
            if c["h"] in used_h: continue
            picked.append(c); used_p.add(c["p"]); used_h.add(c["h"])
            if len(picked) >= per_cat: break
        for c in cs:
            if len(picked) >= per_cat or c in picked or c["p"] in used_p: continue
            picked.append(c); used_p.add(c["p"])
        if len(picked) < per_cat:
            for c in cs:
                if c in picked or any(c["p"] == q["p"] and not (c["i"] >= q["i"] + q["n"] or q["i"] >= c["i"] + c["n"]) for q in picked): continue
                picked.append(c)
                if len(picked) >= per_cat: break
        # vaguest first: the fewest names of people and places showing
        picked.sort(key=lambda c: c["pn"] + c["b"] * 0.5)
        chosen[cat] = [c["t"] for c in picked]
    return chosen


EXTRA = {
    "IND": {"names": ["Bharat", "Hindustan"]},
    "MEX": {"names": ["México", "Mexic"]},
    "ITA": {"names": ["Italia", "Italo", "Ital"]},
    "AUS": {"names": ["Aussie"]},
    "TUR": {"names": ["Türkiye", "Turk", "Türk"]},
    "THA": {"names": ["Thai", "Siam"]},
    "ARG": {"names": ["Argentin"]},
    "ETH": {"names": ["Abyssinia"]},
    "ISL": {"demonyms": ["Icelander", "Icelandic"]},
    "CUB": {"names": ["Cuba"]},
    "JPN": {"names": ["Nippon", "Nihon"], "stems": []},
    "EGY": {"names": ["Misr", "Masr"]},
    "NOR": {"names": ["Norge", "Noreg"], "demonyms": ["Norwegian"]},
    "VNM": {"names": ["Viet Nam", "Việt Nam", "Viet", "Việt"]},
    "BRA": {"names": ["Brasil"]},
    "MAR": {"names": ["Maroc", "Maghrib", "Marruecos"], "demonyms": ["Moroccan"]},
    "NZL": {"names": ["Aotearoa", "Zealand"], "demonyms": ["New Zealander"], "case": ["Kiwi"]},
    "MNG": {"names": ["Mongol"]},
    "PRT": {"demonyms": ["Portuguese"]},
    "CAN": {"demonyms": ["Canadian"], "names": ["Canad"]},
    "PER": {"demonyms": ["Peruvian"]},
    "KEN": {"demonyms": ["Kenyan"]},
}
AKA = {"VNM": ["Viet Nam"], "NZL": ["Aotearoa"]}

CANDIDATES = 0
