import json, math, sys
S, wj = sys.argv[1:3]
names = json.load(open(S+'/names.json')); w = json.load(open(wj))
ALIAS = {'CYN':'CYP','SOL':'SOM','ALD':'FIN'}
R = 6371.0
def ring_area(r):
    a = 0
    for (x1,y1),(x2,y2) in zip(r, r[1:]):
        a += math.radians(x2-x1) * (2 + math.sin(math.radians(y1)) + math.sin(math.radians(y2)))
    return abs(a * R*R / 2)
area, pts = {}, {}
for code, *_rest in w:
    mp = _rest[-1]; o = ALIAS.get(code, code)
    a = sum(ring_area(p[0]) - sum(ring_area(h) for h in p[1:]) for p in mp)
    area[o] = area.get(o, 0) + a
    pts.setdefault(o, set()).update((x, y) for p in mp for r in p for x, y in r)
owner_of = {}
for o, s in pts.items():
    for q in s: owner_of.setdefault(q, set()).add(o)
island = {c: not any(len(owner_of[q]) > 1 for q in pts[c]) for c in names}
def tier(a): return 'large' if a >= 500000 else 'medium' if a >= 100000 else 'small' if a >= 10000 else 'tiny'
out = {c: {'km2': round(area[c]), 'island': island[c], 'tier': tier(area[c])} for c in names}
json.dump(out, open(S+'/sizes.json','w'), indent=0)
from collections import Counter
print(Counter(v['tier'] for v in out.values()), 'islands', sum(v['island'] for v in out.values()))
for t in ['large','medium','small','tiny']:
    xs = sorted((c for c in out if out[c]['tier']==t), key=lambda c: -out[c]['km2'])
    print(t, len(xs), ', '.join(names[c] + ('*' if out[c]['island'] else '') for c in xs))
