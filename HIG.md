# Catdoku and Apple's Human Interface Guidelines

A page-by-page review of the site against Apple's Human Interface Guidelines (HIG), read from Apple's own pages on
2026-11-01 (all 173 of them, through developer.apple.com's JSON for each page). Catdoku is a web app, played in Safari
or from the home screen, so the guidelines are applied where they fit a web page; the rest are listed at the end with
the reason they don't apply.

✅ follows it · 🔧 fixed in this round · ⚠️ partly, or a choice we've made · ❌ not done yet

## Foundations

### Design principles
- ✅ **Purpose, simplicity, delight:** one game per page, the board first, cats and gold paws for delight.
- ✅ **Agency: help people recover from mistakes:** Undo (and Ctrl/⌘Z), Restart, Undo guess, revives.
- ✅ **Familiarity: provide clear feedback:** message line, red/green marks, win cards.
- ✅ **Flexibility: preserve a person's context:** every game saves progress and reopens it.
- ✅ **Flexibility: a variety of input methods:** touch, mouse and keyboard in every game.

### Designing for games
- ✅ **Let people play as soon as possible:** no sign-in, no setup; a puzzle is on the board at once.
- ✅ **Provide great default settings.**
- 🔧 **Teach through play:** the first visit's walkthrough is shorter and can now be interactive (see Onboarding).
- ✅ **Defer requests:** nothing is asked for (no permissions, ratings or purchases).
- ✅ **Text always legible (17 pt default, 11 pt minimum):** body text is 17 px; 🔧 the last 10 and 10.5 px labels are 11 px now.
- 🔧 **Buttons always easy to use (44 × 44 default, 28 × 28 minimum):** see Accessibility.
- ✅ **Resolution-independent graphics:** icons and boards are SVG; photos are WebP.
- ✅ **Integrate device features (safe areas):** `viewport-fit=cover` and `env(safe-area-inset-*)`.
- ✅ **In-game menus adapt to aspect ratios and both orientations:** the sideways layout (`.stage`).
- ✅ **Design for full screen:** `G.fullScreen` where the board gains from it.
- ✅ **Touch first, keyboard and pointer too.**
- ⚠️ **Physical game controllers:** not supported (a browser can, through the Gamepad API; few players of puzzle games
  would use one).
- ✅ **Prioritize perceivability:** rules never rest on colour alone in the logic games (borders, symbols, numbers).
  ⚠️ Pawlette and Shelf Life are colour games by nature.
- ⚠️ **Help players personalize (type size, motion…):** follows the system's text size, motion and contrast settings
  rather than adding its own (which Apple's Settings page asks for).
- ⚠️ **Game Center, iCloud saves, haptics, Spatial Audio:** not available to a web page (Safari on iPhone has no
  vibration; saves are per device).

### Accessibility
- 🔧 **Support larger text sizes / Dynamic Type:** text follows the iPhone's text size setting, now up to 1.6 times
  (about AX1, the first larger accessibility size). ❌ The four largest accessibility sizes (AX2–AX5) stop at 1.6.
- ✅ **Color contrast (4.5:1 up to 17 pt, 3:1 for 18 pt or bold):** checked on every page in light and dark.
- 🔧 **Increase Contrast:** with the system setting on, soft grey text goes to full ink and lines get stronger.
- ✅ **Convey information with more than color alone** (see Designing for games).
- ⚠️ **Describe the interface for VoiceOver:** buttons, menus and settings are labelled, cards are dialogs (🔧) and
  the message line is announced. Board squares are labelled in Catdoku, Pawlette and some others; ❌ not every game's
  board reads out sensibly yet (a per-game job: each needs `aria-label`s on its squares or pieces).
- 🔧 **Sufficiently sized controls (44 × 44 default, 28 × 28 minimum):** 44 for all controls outside the board;
  nothing under 28 (the launch calendar's chips were 21 tall and are 28 now).
- ✅ **Consider spacing between controls.**
- ✅ **Offer alternatives to gestures:** every drag has a tap way, every swipe has buttons or keys.
- ✅ **Let people use the keyboard alone.**
- 🔧 **Minimize time-boxed elements:** hints no longer vanish after five seconds; they stay until the board changes.
  ⚠️ Short notes in the message line still clear after a few seconds (they repeat what the board already shows).
- ✅ **Difficulty accommodations:** every game has levels; hints, Undo and revives.
  ⚠️ The action games (Tail Chase, Bird Watch, Wind Up, L-M-N-O-Pom) have no slower speed setting.
- ✅ **Be cautious with fast-moving and blinking animations / Reduce Motion:** animations turn off, hint marks stay.
- ⚠️ **Assistive Access, Switch Control, Voice Control:** not tested.

### VoiceOver
- ✅ **Alternative labels for key elements;** ✅ decorative images hidden (`alt=""`, `aria-hidden`).
- ✅ **Titles and headings:** one `h1` per page; card titles are `h2`.
- ✅ **Inform VoiceOver of changes:** `aria-live` message line; 🔧 the walkthrough says "Step 2 of 6".
- ⚠️ Board contents: see Accessibility.

### Inclusion
- ✅ Plain, friendly language; cats rather than people; no gendered references needed for play.

### Color
- ✅ **Don't use the same colour to mean different things:** gold for a hint or a gold paw, red for a mistake, green
  for done, violet for a guess.
- 🔧 **Colours work in light, dark and increased contrast.**
- ✅ **Avoid relying on colour alone.**

### Dark Mode
- ✅ **No app-specific appearance setting:** follows the system.
- 🔧 **Looks good in both:** the page, menus and cards go dark; boards keep their light colours, now 🔧 a shade dimmer
  in the dark ("soften the color of white backgrounds"); theme colours for Safari's bars in both.
- 🔧 **Sufficient contrast in all appearances.**
- ⚠️ **Full-colour images look good in both:** the front-page icons are drawn on light tiles, which reads as a board
  on a dark table; no separate dark icons.

### Typography
- ✅ **17 pt default, 11 pt minimum;** ✅ **avoid light weights** (500–800).
- ✅ **Minimize typefaces:** one (Baloo 2), with the system's rounded font as its fallback.
- 🔧 **Layout adapts to all font sizes:** checked at 1.33 and 1.6 at 320 px wide and sideways; tile names wrap.
- ⚠️ **Custom font legibility:** Baloo 2 is a custom font, which Apple allows for branding; it scales with Dynamic Type.

### Layout
- ✅ **Order content by importance:** title, status, board, tools, settings.
- ✅ **Group related items; progressive disclosure:** settings in their own row with a line each; Pawlette's menu.
- ✅ **Adapt to sizes, orientations and text size;** ✅ safe areas.

### Motion
- ✅ **Purposeful, brief, optional.** ⚠️ "Let's Play!" fades by itself after the walkthrough (decoration, nothing to read).

### Writing
- ✅ **Consistent voice, action-oriented labels, consistent terms (Restart, New puzzle, Hint, Share).**
- ✅ **Clear next steps on blank screens:** "No games match that. Try another word…".
- ✅ **Show hints in text fields:** search placeholders.

### Icons / app icons / images
- ✅ **Simple, consistent interface icons with text labels** (the tool buttons); ✅ SVG.
- ⚠️ **App icon dark, clear and tinted variants:** a web page's home-screen icon can only be one PNG.
- ⚠️ **Don't use text in the app icon name:** the home-screen name is "🐾 Catdoku" (emoji in a name is unusual on iOS).

### Branding / materials
- ✅ **Branding defers to content;** no logo repeated on every screen. Materials (Liquid Glass) don't apply to a web page.

## Patterns

### Onboarding (and Offering help)
- 🔧 **Teach through interactivity:** a walkthrough step can now wait for the player to do it on the real board
  (`try` in `G.spotlight`). Catdoku has the first one: tap the middle square twice for a cat; the board goes back as it was.
  ❌ The other 46 games still teach by showing; each needs its own interactive step (see "Still to do").
- 🔧 **Context-specific tips instead of one flow:** on a first visit, steps that only point at a tool or a setting are
  kept back and come later as one-off tips: the Hint tip after 45 seconds without a move, the others a few seconds after
  the first move of a visit, at most one a day.
- 🔧 **Tips: short, actionable, only for people who'd benefit, at a reasonable cadence:** one line each; dropped
  unseen if you've already used that button; one a day.
- 🔧 **Brief:** first visits are now 3 to 11 steps (Catdoku 11 → 6, Open the Door! 13 → 8).
  ⚠️ Bubbles (11), Stash (10), Catwalk, Fish Bones, Patches, Pawlette and Toydoku (9) are still long.
- 🔧 **Optional:** Skip on every step (and Escape); skipping counts as seen; How to play plays it all again.
- 🔧 **Page control for multi-page flows (dots, centred at the bottom, not coloured).**
- ✅ **Focused on the game, not the device;** ✅ no splash screen, licences or setup.

### Feedback
- ✅ **Status in the interface** (the message line and counts); ✅ **confirm significant completions** (win cards).
- ✅ **Show when something can't be done and why** (hints that can't find anything say so).
- ⚠️ **Warn before unexpected, irreversible data loss:** New puzzle replaces a puzzle in progress without asking. That's
  the button's plain meaning, and Apple also asks not to put up alerts for common actions, so it stays as it is.

### Launching / loading
- ✅ **Launch instantly; restore the previous state.** ✅ Puzzles are built in a worker in the background.

### Modality (cards)
- ✅ **Keep modal tasks short; an obvious way out:** every card has its buttons, and Back to the front page on every
  ending card. 🔧 Escape now takes a card's way out where it has one (Close, Cancel, Keep playing, Done, or a look at
  the board). 🔧 Cards are dialogs to VoiceOver.

### Settings
- ✅ **Few settings, good defaults; task-specific options next to the task** (each game's settings row).
- ✅ **Respect system settings** (appearance, text size, motion, contrast) rather than repeating them.

### Undo and redo
- ✅ **Undo many times; show the result;** ✅ ⌘Z / Ctrl+Z. ⚠️ No redo (Apple: only provide when necessary).
  ⚠️ Shake and three-finger swipe to undo are system gestures a web page can't receive.

### Searching / search fields
- ✅ **Search in a primary place; results as you type; placeholder suggests what to search; scope by shelf.**

### Going full screen
- ✅ **Where it makes sense; keeps essential controls; F and Escape to leave; resumes where you were.**

### Collaboration and sharing / activity views
- ✅ **Share button in the toolbar;** it uses the system share sheet where the browser has one.

### Entering data
- ✅ **Offer choices instead of typing where possible** (Catlas's List and Pick modes; number pads).

### Privacy
- ✅ **Process data on the device:** everything is kept in the browser; GoatCounter counts plays without cookies.

### Multitasking
- ✅ **Pause when people switch away:** the clock runs only while the page is showing; action games pause.

## Inputs
- ✅ **Gestures:** tap, drag, swipe and pinch are used as people expect, each with another way to do it.
- ✅ **Keyboards:** single-key commands in games; Escape cancels; ⌘Z undoes; standard shortcuts left alone.
- ✅ **Pointing devices:** hover states and pointer cursors.
- ✅ **Focus:** a visible focus ring on everything focusable; a cursor on boards.
- ✅ **Game controls (touch):** controls large enough, visible press states, symbols with words.
- ⚠️ **Virtual keyboards: the right keyboard type and Return key:** Catlas sets its Return key; other text fields are few.

## Components
- ✅ **Buttons:** press state, the prominent style for the likeliest action (New puzzle), familiar icons with words.
- ⚠️ **Toggles:** Apple keeps the switch style for list rows; ours are switches in the settings row, each with a line
  saying what it does, which reads like a list row. Left as is.
- ✅ **Pickers** (level menus); ✅ **segmented control** (Pawlette's Zen and Swipe); ✅ **labels**; ✅ **lists and tables**
  (Best times); ✅ **collections** (the front page's tiles); ✅ **page controls** (🔧 the walkthrough's dots);
  ✅ **progress** (counts and the Catdoku streak).
- ✅ **Alerts:** none at launch; cards only for things that need a choice.

## Pages that don't apply

Platform pages for tvOS, watchOS, visionOS, CarPlay and iPhone Duo; system integrations a web page can't use (App
Clips, App Shortcuts, Home Screen quick actions, widgets, Live Activities, complications, Siri, Spotlight, iMessage
apps, SharePlay, Game Center, Wallet, Apple Pay, In-App Purchase, Sign in with Apple, Tap to Pay, ID Verifier, HealthKit,
CareKit, ResearchKit, HomeKit, ShazamKit, Maps, NFC, Nearby Interactions, AirPlay, Always On, Action button, Camera
Control, Digital Crown, remotes, eyes, gyro and accelerometer, Apple Pencil, spatial layout, immersive experiences,
ornaments, Top Shelf, watch faces, workouts, activity rings, machine learning, generative AI, augmented reality, live
photos, photo editing, playing audio and video, printing, file management, iCloud, notifications, managing accounts,
ratings and reviews); and macOS-only components (the menu bar, dock menus, windows, panels, sidebars, split views, column,
outline and path views, toolbars, tab bars, token fields, combo boxes, color and image wells, steppers, sliders, gauges,
rating indicators, charts, context and edit menus, pull-down and pop-up buttons, disclosure controls, boxes, lockups,
snippets, status bars, text views, web views, right-to-left, SF Symbols, materials).

## Still to do

1. **An interactive step for every game,** like Catdoku's: one move the player makes on the real board in the first
   few steps, put back afterwards. Each game needs its own (which square, what counts as done).
2. **Shorter first visits** for Bubbles, Stash, Catwalk, Fish Bones, Patches, Pawlette and Toydoku: fold steps
   together, or move rules that only matter later into tips.
3. **VoiceOver on every board:** squares and pieces labelled, the way Catdoku's are.
4. **A slower speed for the action games** (difficulty accommodation).
5. **The largest accessibility text sizes (AX2–AX5)** for the words around the board.
