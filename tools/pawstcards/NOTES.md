# Pawstcards: how the postcards are made

Every postcard is a passage from English Wikipedia (CC BY-SA 4.0), unchanged except for cuts: 2 or 3 sentences in a
row from one paragraph (1 or 2 for Cats). The game credits the articles by name, with links, once a place is answered.

## A batch of new places

Run these from `tools/pawstcards/`. `raw/`, `rawcats/` and `cand/` are working folders and aren't kept in the repo.

1. Add each place to `places.py` (its Catlas code, name, Wikipedia title and the region for its postmark), any other
   names to cover to `EXTRA` in `build.py`, and the articles about its cats to `catsrc.py`.
2. `python3 fetch.py` fetches the articles. It needs `en.wikipedia.org` allowed. Only raw wikitext comes through from
   a cloud session (Wikipedia's APIs answer 429 there, as Wiktionary's do), so `build.py` turns wikitext into plain
   text itself, with `mwparserfromhell` (`pip install mwparserfromhell`).
3. `python3 cands.py` writes the candidates: `cand/CODE.txt` for each new place (the 8 best of each kind) and
   `cand/catcards.txt` (Cats, for every place).
4. Read them and choose, by hand: add the place to `picks.py` and `catpicks.py`. This is the step that makes the
   postcards good; see below.
5. `python3 make.py` writes `pawstcards/postcards.js` and `pawstcards/places.js`. Bump the build.

To rebuild everything from nothing, fetch, then `python3 cands.py` and `python3 make.py`: the ids in `picks.py` are
paragraph.sentence.count in the article as fetched, so an article that has changed since may need its picks redone
(`make.py` stops at an id it can't find).

## What the script does (build.py)

- **Sections to kinds:** History, Geography, Politics, Economy, People and Culture, by the section's heading
  (a subsection's own heading first). The lead, Etymology and the reference sections are left out.
- **Covering the name:** the place's names (Catlas's other names too), its people (the infobox's demonym), its
  capital, and anything in `EXTRA`, each with whatever letters follow ("Kenya" covers Kenyan and Kenyatta; "Mongol"
  covers Mongols). A passage where part of a name still shows is dropped. Accents are ignored when matching.
  Mind names that are also words: Iceland's own name, Ísland, covered every "island" until it was taken out.
- **What's dropped:** a first sentence that leans on one that isn't there ("These…", "However…", "The company…" just
  named), a gap where a template showed nothing ("As of, the…"), unbalanced brackets or quotes, a sentence under six
  words, more than three covered words.
- **Ranking:** more for names of things, superlatives and "national dish" and the like; less for the words of
  statistics and administration. It only orders the shortlist; it doesn't choose.

## Choosing (the part done by hand)

The script's own choices were tried first and the owner found them "a little off". From each kind's candidates, keep
3 or 4 that:
- make sense with nothing before them;
- say something particular to the place (a landmark, a food, an event, a custom, a record), not a figure anyone
  could have;
- read like something Pinecone might write home about.

Order them hardest first, so the postcard that nearly gives it away comes last. A candidate may be cut down (drop a
sentence, or an opening that points back), never added to: write it as `[id, text]`, and `make.py` checks that every
word is from the candidate.

Cats come from other articles: the place's wild cats (Catlas has one for every place), its breeds, and its cat lore
(Japan's cat islands, Iceland's Yule cat, Vietnam's Year of the Cat). Where there are no native cats, how cats got
there. Breed names are covered like any other name ("[[Egyptian]] Mau").

The owner compared picks made on two models (the first 12 places on Opus, the next 10 on Fable) and preferred Fable's.
