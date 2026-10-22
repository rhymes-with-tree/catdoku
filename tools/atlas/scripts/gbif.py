import json, sys, urllib.request, concurrent.futures as cf
S=sys.argv[1]
iso2=json.load(open(S+'/iso2.json')); iso2['SDS']='SS'
def q(cc):
    u=("https://api.gbif.org/v1/occurrence/search?familyKey=9703&country=%s&limit=0&facet=speciesKey&facetLimit=40"
       "&basisOfRecord=HUMAN_OBSERVATION&basisOfRecord=MACHINE_OBSERVATION&basisOfRecord=OCCURRENCE"
       "&occurrenceStatus=PRESENT&year=1990,2026") % cc
    for t in range(4):
        try:
            d=json.load(urllib.request.urlopen(u,timeout=60))
            return {c['name']:c['count'] for c in d['facets'][0]['counts']} if d['facets'] else {}
        except Exception as e: err=e
    return {'error':str(err)}
with cf.ThreadPoolExecutor(6) as ex:
    res=dict(zip(iso2, ex.map(q, iso2.values())))
keys={k for r in res.values() for k in r if k!='error'}
sp={}
for k in keys:
    d=json.load(urllib.request.urlopen("https://api.gbif.org/v1/species/"+k,timeout=60))
    sp[k]=d.get('species') or d.get('canonicalName')
out={c:{sp.get(k,k):n for k,n in r.items()} for c,r in res.items()}
json.dump(out,open(S+'/gbif_counts.json','w'),indent=0)
print(len(out), sum('error' in r for r in res.values()), sorted(set(sp.values())))
