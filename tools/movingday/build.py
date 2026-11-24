# Builds the rework's playable preview, preview.html (one file, everything inlined, for an artifact): the page
# (page.html) with games.css, games.js and the shared drawings put in, the rules (rules.js), and the cats' pictures
# as data URIs. Run: python3 tools/movingday/build.py
import base64, json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
R = os.path.join(HERE, "..", "..") + "/"
page = open(os.path.join(HERE, "page.html")).read()
css = open(R + "games.css").read()
js = "\n".join(open(R + f).read() for f in ["games.js", "boxes.js", "tablethings.js", "treats.js"])
rules = open(os.path.join(HERE, "rules.js")).read()
cats = [c for c in dict.fromkeys(re.findall(r'\["[a-z-]+", "[^"]+", "([a-z0-9-]+)"', page)) if os.path.exists(R + "cats/" + c + ".webp")]
src = {c: "data:image/webp;base64," + base64.b64encode(open(R + "cats/" + c + ".webp", "rb").read()).decode() for c in cats}
page = page.replace("/*@CSS@*/", css).replace("/*@JS@*/", js).replace("/*@RULES@*/", rules)
page = page.replace("const CAT_SRC = {/*@CATS@*/};", "const CAT_SRC = " + json.dumps(src) + ";")
open(os.path.join(HERE, "preview.html"), "w").write(page)
print(len(page), "bytes,", len(cats), "cats")
