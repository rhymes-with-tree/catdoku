# Dependencies and overseas pieces: area, continent/subregion, name. Pieces inside a country's shape are found by
# where they sit (a lon/lat box).
import json, math, sys
S, wj = sys.argv[1:3]
R = 6371.0
def ring_area(r): return abs(sum(math.radians(x2 - x1) * (2 + math.sin(math.radians(y1)) + math.sin(math.radians(y2))) for (x1, y1), (x2, y2) in zip(r, r[1:])) * R * R / 2)
def poly_area(p): return ring_area(p[0]) - sum(ring_area(h) for h in p[1:])
w = {r[0]: r for r in json.load(open(wj, encoding="utf-8"))}
OWN = {"PRI": ("Puerto Rico", "United States"), "GUM": ("Guam", "United States"), "VIR": ("U.S. Virgin Islands", "United States"),
  "MNP": ("Northern Mariana Islands", "United States"), "ASM": ("American Samoa", "United States"),
  "BMU": ("Bermuda", "United Kingdom"), "CYM": ("Cayman Islands", "United Kingdom"), "TCA": ("Turks and Caicos Islands", "United Kingdom"),
  "VGB": ("British Virgin Islands", "United Kingdom"), "AIA": ("Anguilla", "United Kingdom"), "MSR": ("Montserrat", "United Kingdom"),
  "FLK": ("Falkland Islands", "United Kingdom"), "SGS": ("South Georgia and the South Sandwich Islands", "United Kingdom"),
  "SHN": ("Saint Helena, Ascension and Tristan da Cunha", "United Kingdom"), "PCN": ("Pitcairn Islands", "United Kingdom"),
  "JEY": ("Jersey", "United Kingdom"), "GGY": ("Guernsey", "United Kingdom"), "IMN": ("Isle of Man", "United Kingdom"),
  "PYF": ("French Polynesia", "France"), "NCL": ("New Caledonia", "France"), "WLF": ("Wallis and Futuna", "France"),
  "SPM": ("Saint Pierre and Miquelon", "France"), "MAF": ("Saint Martin", "France"), "BLM": ("Saint Barthélemy", "France"),
  "ATF": ("French Southern and Antarctic Lands", "France"), "ABW": ("Aruba", "Netherlands"), "CUW": ("Curaçao", "Netherlands"),
  "SXM": ("Sint Maarten", "Netherlands"), "GRL": ("Greenland", "Denmark"), "FRO": ("Faroe Islands", "Denmark"),
  "HKG": ("Hong Kong", "China"), "MAC": ("Macao", "China"), "IOA": ("Christmas and Cocos (Keeling) Islands", "Australia"),
  "NFK": ("Norfolk Island", "Australia"), "HMD": ("Heard Island and McDonald Islands", "Australia"),
  "ATC": ("Ashmore and Cartier Islands", "Australia"), "IOT": ("Chagos Islands", "Mauritius")}
FIX_SUB = {"Northern America": "North America"}
rows = []
for code, (name, owner) in OWN.items():
    if code not in w: print("missing", code); continue
    r = w[code]; rows.append((sum(poly_area(p) for p in r[5]), r[3], FIX_SUB.get(r[2], r[2]), name, owner))
# pieces inside a country's shape: (name, owner, parent code, lon range, lat range, region, subregion)
PIECES = [("French Guiana", "France", "FRA", (-55, -51), (2, 6.5), "Americas", "South America"),
  ("Guadeloupe", "France", "FRA", (-62, -60.9), (15.8, 16.6), "Americas", "Caribbean"),
  ("Martinique", "France", "FRA", (-61.3, -60.7), (14.3, 14.95), "Americas", "Caribbean"),
  ("Réunion", "France", "FRA", (55, 56), (-21.5, -20.8), "Africa", "Eastern Africa"),
  ("Mayotte", "France", "FRA", (44.9, 45.4), (-13.1, -12.5), "Africa", "Eastern Africa"),
  ("Bonaire", "Netherlands", "NLD", (-68.5, -68), (11.9, 12.4), "Americas", "Caribbean"),
  ("Sint Eustatius and Saba", "Netherlands", "NLD", (-63.4, -62.9), (17.4, 17.7), "Americas", "Caribbean"),
  ("Svalbard", "Norway", "NOR", (9, 35), (76, 81), "Europe", "Northern Europe"),
  ("Tokelau", "New Zealand", "NZL", (-173, -171), (-10, -8), "Oceania", "Polynesia"),
  ("Azores", "Portugal", "PRT", (-32, -24), (36.5, 40), "Europe", "Southern Europe"),
  ("Madeira", "Portugal", "PRT", (-17.5, -16), (32, 33.5), "Africa", "Northern Africa"),
  ("Canary Islands", "Spain", "ESP", (-18.5, -13), (27.5, 29.5), "Africa", "Northern Africa")]
for name, owner, parent, (x0, x1), (y0, y1), reg, sub in PIECES:
    ps = [p for p in w[parent][5] if all(x0 <= x <= x1 and y0 <= y <= y1 for x, y in p[0])]
    if not ps: print("no pieces for", name); continue
    rows.append((sum(poly_area(p) for p in ps), reg, sub, name, owner, len(ps)))
tier = lambda a: "Large" if a >= 500000 else "Medium" if a >= 100000 else "Small" if a >= 10000 else "Tiny"
rows.sort(key=lambda r: -r[0])
print("| Size | Continental group / region | Name |\n|---|---|---|")
for r in rows: print(f"| {tier(r[0])} ({r[0]:,.0f} km²) | {r[1]} · {r[2]} | {r[3]} ({r[4]}) |")
