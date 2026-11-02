# To do

Things to come back to, kept here so any chat can pick them up. Add an item when something is put aside; take it out
(in the same PR) once it's done. Game ideas go in `IDEAS.md`, and work on Apple's guidelines in `HIG.md` ("Still to do").

## Catlas: Safari still offers AutoFill Contact in the answer box

On an iPhone, typing an answer in Catlas (Type answers) brings up Safari's AutoFill Contact bar above the keyboard,
offering the player's contacts. Safari ignores `autocomplete="off"` when it decides a box belongs to a contact or
address form.

Tried (still shows, checked on the owner's iPhone after rhymes-with-tree/catdoku#216, 2026-11-02):
- `autocomplete="off"` on the box and on its form
- the placeholder changed from "Type the name" to "Your guess", and the box's name from `answer` to `guess`
- `type="search"` in place of `type="text"`

Still to try:
- take the box out of its `<form>` (handle Enter and the Go button in script); Safari looks for contact fields in forms
- `autocomplete` set to something Safari doesn't recognise (such as `autocomplete="nope"`) rather than `off`
- make the box read-only until it's tapped, then drop `readonly` on focus
- if none of that works, a `contenteditable` box styled like the input
Test each on a real iPhone: Safari's AutoFill doesn't show in the headless browser the tests use.
