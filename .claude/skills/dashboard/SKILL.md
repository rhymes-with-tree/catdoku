---
name: dashboard
description: Update Pawprints, the owner's dashboard of Catdoku's GoatCounter numbers and players' feedback, each note with its status and a suggested fix. Use when the owner asks to update or refresh the dashboard, asks what GoatCounter or the feedback says lately, or wants a change to the dashboard's page.
---

# Pawprints

Pawprints is the owner's dashboard: https://claude.ai/artifact/JSbJmiFqQ3dQrNtsyW64FX (a claude.ai artifact of the
Data type, private to the owner until they share it). It looks like the site (Baloo 2, sage paper, the rainbow
stripe, tiles with their shelf's colour along the top). A timeline at the top (7 days, 14 days, 28 days, All) sets
the days every section below covers, each figure against as many days just before. It shows:

- **To look at**: players' feedback and the games' errors, each with a status (Open, To check, Fixed, Done, Not ours)
  and a suggested fix, or what happened for one that's done. The ones to look at come first; the rest are folded away.
- **The tiles**: visits that opened a page (against the period before), puzzles started and solved, notes waiting.
- **Days**: visits each day.
- **Games**: each game's visits, puzzles started, solved, solved as a share of started, and lost.
- **Visits**: what visits open on, the first game played, and puzzles in a row (the visit tally, since 2026-11-17).
- **Errors**: the "Error: …" moments the games send.

Its numbers are attached files, not live queries: GoatCounter is a service connected to this environment's proxy, not
a claude.ai connector, so a reader's browser can't ask it. So the dashboard is only as fresh as its last update, and
each update is this skill: a scheduled task runs it every morning (Update Pawprints, 6:44 New York time), and the
owner can ask for one any time.

## Updating it

1. **Pull the numbers.** `python3 -I .claude/skills/dashboard/pull.py <scratchpad>/pawprints` writes `daily.json`,
   `game_days.json`, `visits.json` and `errors.json` (each `{rows, meta}`, a row a day, every day GoatCounter has, the
   script's own text in `meta`); the page adds up the days the timeline picks. It takes a
   minute or two: GoatCounter allows a few requests a second and the script waits when it's refused. The game names
   and shelves come from `games.js`, so a new game shows up by itself; a game whose win or loss moment uses a new verb
   needs it added to `SOLVED_RE` or `LOST_RE`.
2. **Read the feedback.** The Google Drive connector's `read_file_content` on the sheet "Website Feedback Form
   (Responses)" (`1uOKFrs2O5aLL4sAZhFbTwMQ6yWZjVyqGH55RUpl4PiE`, tab Form Responses 1). Columns: Timestamp, Kind,
   Message, Game, Details, Contact, Build, Browser, Device (the page's address), Text. The connector can cut a long
   message short; say so in the note ("the sheet cuts it off here") rather than guess the rest.
3. **Write the notes.** Read the dashboard's current `notes.json` first (`Artifact` `read` with the dashboard's url and
   the `path` of the `datasets/notes` source's blob id) and keep its notes, updating their status. Add one note for
   each new feedback row, and one for each new error in `errors.json` (one note for an error that repeats). For each,
   find out where it stands from the repository (pull the default branch first, so fixes merged since count): `git log`, `TODO.md`, the game's code. Then give it:
   - `status`: Open (a real problem, not fixed), To check (unclear, or fixed but unconfirmed), Fixed (a commit or PR
     fixed it), Done (not a problem, handled), Not ours (a test row, a browser extension, "Script error.").
   - `suggestion`: for an Open or To check note, the fix in a sentence or three: what's wrong and where, and what to
     change. Base it on the code, not a guess; say "probably" where it's a reading. For a done one, what happened.
   - `ref`: the commit, PR or TODO item, or the file to look in.
   Fields: `id` (`fb-<date>-<slug>` or `err-<date>-<slug>`), `date`, `from` (Feedback or Error), `kind`, `game`, `slug`
   (the game's folder, for its colour), `said` (the message or error, cleaned of typos only where the meaning is plain),
   `context` (level, build, device in a few words), `reply` ("yes" when they left a way to reach them), `status`,
   `suggestion`, `ref`. **Never put a name, email or other contact detail in a note**: the dashboard can be shared,
   and the file is readable by everyone who can open it. Write `{rows, meta}` as `notes.json` beside the other files.
   The site's own house style applies to the words (plain, the owner's terms: Dark Mode, level, the game's own name).
4. **Upload and point the datasets at the new files.** Upload each file (`Artifact`, `url` the dashboard's, `asset:
   true`, one `file_path` per call). Then one `ArtifactData` `batch` that `update`s each `datasets/<id>` (ids `daily`,
   `game_days`, `visits`, `errors`, `notes`) with the new `source.url` and `updated: {at, by}`, each pinned with the
   `if_version` you read. Then delete the old blobs (`Artifact` `delete`, `url` and `path` the old blob id), which are
   nothing's now.
5. **Look at how it ran.** `ArtifactData` `get` `data/users/me` `check` (and `runs` if it exists) until `check` says
   `passed`, or fix what it names. `still_loading` or `checking` that doesn't move means the owner hasn't got it open;
   say so.
6. **Tell the owner** in chat (or, in the morning task, in the session's last message, which reaches their phone), briefly: what's new since the last update (new notes and their suggested fixes, figures
   that moved a lot, games that stand out), and the link. Offer to make any Open fix.

## Changing the page

The page is `files/index.html` in the dashboard's store, with the font in `files/font.css` (Baloo 2, the site's
typeface, embedded). `page.html` here is a copy for the repository's history. The owner can edit the page's words in
place, so read the store's `files/index.html` before changing it, change that, and copy the result back to
`page.html`. The page follows the Data type's rules (its `artifact-type/reference/one-writer.md`): words in the HTML,
what the data decides drawn by `dash.draw` into elements stored empty or with a `—`. The timeline is the page's
`range` setting (`dash/params`, default `"7"`); the calcs `days_r`, `period`, `games`, `totals`, `visits_r` and
`errors_r` cut the files to it, so a pick redraws without fetching anything. Its colours are the site's
(`games.css`), with the site's Dark Mode colours.
