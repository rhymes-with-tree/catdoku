# Business plan: things to do and keep track of

Written 2026-11-01 from a planning chat. Nothing here is decided or started unless it says so. Income estimates are left out on purpose (they were guesses); what's here is what to do, what to watch, and what to decide.

## The plan in brief

- **Model:** a free iPhone app that is a **suite** (one subscription unlocks every game, not per-game purchases).
- **Always free:** the daily challenge.
- **Free tier:** each game is free up to a set level or size (for example Catdoku up to 7×7, Toy Box up to level 10), then the subscription. Limit by level, not by number of plays, because it fits the climb-the-levels system and a play counter feels like being cut off.
- **Subscription:** about $2.99 a month or $19.99 a year, 7-day free trial, Family Sharing on. Consider a lifetime option (about $39.99) for people who won't subscribe.
- **The website** stays a free demo of the same thing. Its paywall is only a nudge ("Unlock in the App Store"): the repo is public and MIT-licensed and progress lives in localStorage, so it can't be enforced.
- **Subscriber perk:** submit your cat to be featured, as a waitlist or monthly draw (not a promise to everyone; each cat has to be drawn).
- **Existing players:** a free first year ("founding players") with App Store offer codes. They are the sharers and reviewers.
- **Later:** themed packs on top of the suite (for example a "Cat Math" pack, one shelf's games) for people who only want one kind of puzzle. Not at launch: start with the suite, add packs if subscribers ask. A subscription for the unlimited suite can come after the app has shown it can release steadily.

## What grows it (the thing to protect)

Featuring a friend's real cat in the games. The owner shares it and their friends come. Evidence: traffic had faded to about 185 visits a day by Oct 14; after Bugsy and Bowtie were added (about Oct 14), Oct 15 hit 447 and daily visits held higher for weeks. Gus, Peanut and Marmalade (one owner, who doesn't share much) did not do the same. So **the owner matters more than the cat**.

## To do, in order

### 1. Now, on the web
- [ ] Merge branch `claude/cat-links` (adds `?cat=<name>` links; build 2026-11-01.12). Then give owners links like `https://rhymes-with-tree.github.io/catdoku/?cat=bugsy`.
- [ ] Check GoatCounter for "Via <name>: new player" and "returning player" events after each feature.
- [ ] Stop ad blockers hiding visitors: copy GoatCounter's `count.js` into the repo instead of loading it from `gc.zgo.at`, and/or buy a domain and use a GoatCounter custom subdomain. The domain is also needed for the App Store listing and privacy policy.
- [ ] Share the link online for the first time: r/cats, r/puzzles, and above all **cat accounts on Instagram and TikTok** (feature a cat whose owner has a big following; they share it to their followers, which is the same thing that worked for Bugsy and Bowtie at larger scale).
- [ ] Treat each featured cat like a launch: ask the owner first, give them a share kit (their link plus a ready-made share image with their cat in the game), and pick a release day. Space features out so each restarts the curve as interest fades.
- [ ] Decide what "more audience" looks like before building the app: weekly visits clearly above about 2,000, and each feature bringing tens to hundreds of new players. If the online posts don't move it, don't build the app yet; look at what people actually play.

### 2. Before building the app
- [ ] **Get written permission from every featured cat's owner.** One line is enough: the owner lets you use the cat's name and likeness in the games, the owner keeps their own photos, you own the drawings (matches `ARTWORK.md`). Needed before the cats appear in a paid app.
- [ ] Check commercial-use terms for TheCatAPI and Cataas (cat photos on the win cards). Cataas photos are user-uploaded, which is a moderation risk under App Store guideline 1.2. Safer: replace them with your own cat artwork.
- [ ] Run a trademark search on "Catdoku".
- [ ] Decide: should the web stay fully free, or become a demo (daily challenge plus a few games, rest in the app)? Chosen so far: demo. Revisit after the online test.
- [ ] Decide which level each game is free up to, and how existing players are let in.
- [ ] Decide what to do for the roughly 28% of players on Android or desktop, who can't subscribe in an iOS app: let them keep the demo, add a web subscription (Stripe), or later an Android version. Apple currently allows linking from the app to a web checkout in the US.

### 3. Building the app
- [ ] Wrap the site (Capacitor or WKWebView) **and** add native features, or App Review rejects it as a website in a wrapper (guideline 4.2): Game Center leaderboards and achievements (gold paws and Mastered fit), a daily-challenge notification, a home-screen widget (today's game, your streak, and the featured cat), haptics, iCloud sync for progress.
- [ ] Bundle everything inside the app: Google Fonts (Baloo 2's license allows it), the word lists, and the Met Museum images (check each is Open Access).
- [ ] Subscriptions with StoreKit 2: monthly, yearly, free trial, Family Sharing, offer codes for founding players.
- [ ] Universal links, so shared links open the app if it's installed.
- [ ] Privacy policy URL; fill in the privacy "nutrition label" honestly (GoatCounter counts as analytics). Age rating 4+, but don't enter the Kids category (it bans third-party analytics and needs a parental gate).
- [ ] Store listing: use generic puzzle names ("minesweeper-style" is fine; avoid other games' trademarks). Screenshots and a preview video.
- [ ] Join Apple's Small Business Program (15% instead of 30%). Cost: $99 a year Apple Developer Program, plus a domain.

### 4. Launch
- [ ] TestFlight beta with current web players.
- [ ] Submit an Apple featuring nomination 6 to 8 weeks before launch. Lead with the accessibility work (VoiceOver, text size to 2.4×, the Slower switch, dark mode).
- [ ] Pick a quiet week, not the holidays. Feature a few well-followed cats that week.
- [ ] Consider reaching out to Apple Arcade (invite-only; an ad-free, accessible, family-friendly puzzle collection fits it).

### 5. After launch
- [ ] Watch in App Store Connect: downloads, free-trial to paid conversion, retention.
- [ ] Test price and the free limit (for example $19.99 vs $29.99 a year; how many levels are free).
- [ ] Keep the "new games keep coming" promise; the subscription depends on it.

## Things to keep track of

- Who features when, who shared it, and what each feature brought (the `?cat=` events).
- Cat owners' permissions (a list of who agreed and when).
- Which cats are real and which aren't (Willow is not a real cat).
- The numbers that decide whether to build the app (weekly visits, new players per feature).
- `/weather` shows up in the GoatCounter data and looks like another site sharing the counter; its visits aren't Catdoku's.
- GoatCounter can't count unique people, and ad-blocking users aren't counted at all, so player numbers are estimates.
