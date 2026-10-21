import json, sys, os
S, repo, mapstudy = sys.argv[1:4]
src = lambda f: open(os.path.join(S, 'src', f), encoding='utf-8').read()
names = json.load(open(os.path.join(S, 'names.json'), encoding='utf-8'))
js = src('atlas.js').replace('/*NAMES*/', json.dumps(names, ensure_ascii=False, separators=(',', ':')))
js = js.replace('/*DEPS*/', json.dumps(json.load(open(os.path.join(S, 'deps.json'), encoding='utf-8')), ensure_ascii=False, separators=(',', ':')))
sizes = json.load(open(os.path.join(S, 'sizes.json')))
js = js.replace('/*SIZES*/', json.dumps({c: [v['km2'], int(v['island'])] for c, v in sizes.items()}, separators=(',', ':')))
js = js.replace('.join(" ").replace(/ {3}/g, "   ");', '.join(" ");')
out = f'''<title>Cat Atlas</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;800&display=swap" rel="stylesheet">
<style>
{open(os.path.join(repo, 'games.css'), encoding='utf-8').read()}
{src('atlas.css')}
/* preview only: no games menu, sharing or cat photos (an artifact can't reach the rest of the site) */
#games,#shareBtn,.card .catpic,.card .catname{{display:none!important}}
</style>
{src('atlas.body.html')}
<script>
{open(os.path.join(repo, 'games.js'), encoding='utf-8').read()}
</script>
<script>
const PREVIEW = true;
{js}
</script>
'''
os.makedirs(os.path.join(S, 'preview'), exist_ok=True)
open(os.path.join(S, 'preview', 'cat-atlas.html'), 'w', encoding='utf-8').write(out)
open(os.path.join(S, 'preview', 'atlas.js.check.js'), 'w', encoding='utf-8').write(js)
import shutil; shutil.copy(os.path.join(S, 'world_un.json'), os.path.join(S, 'preview', 'world.json')); shutil.copy(os.path.join(S, 'disputed.json'), os.path.join(S, 'preview', 'disputed.json'))
print(len(out))
