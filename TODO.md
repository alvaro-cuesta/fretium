# Fretium TODO

## Data

- Add more instruments and tunings
- More patterns
  - Triads
  - Hexatonic scales
  - Chords
- Curate patterns: e.g. currently dom7 arpeggio G position is wrong(ish)
- Refactor pattern generation? E.g. tool to automatically mark duplicate options transparent, or automatically find overlapping chords instead of manually doing it
- Overlap chords on "Arpeggio - Full" -- the same (individual ones) + the full one with all 4 variants!

## Features

### Uncategorized

- Root note: auto fit
  - It should automatically find the best root note to fit the pattern in the diagram, so that the diagram is as compact as possible (e.g. for a Cmaj7 chord, it should choose E as the root note, so that the diagram only shows 4 frets instead of 5)
  - It should also have an option to avoid using open strings, so the Cmaj7 chord chooses F instead
  - Consider thoroughly how this interacts with min/max fret auto options
- Add support for custom pattern
  - Needs editing capabilities in the fretboard or maybe a way to allow editing JSON of patterns?
  - Needs a way to save patterns (to hash? to file? to local storage?)
  - Possibly even a way to share patterns
- Add current options to hash? E.g. selected instrument, tuning, chord/scale, diagram options... so the configuration can be bookmarked, shared, etc.
- Add a way to customize diagram appearance
  - Colors, fonts, sizes, shown elements... anything that can be customized as `Fretboard` props should be added, plus current constants like `SPACING_BETWEEN_STRINGS`
  - Probably many of the options should be grouped as themes and not individual options, to keep it simple
- Transparent background in SVG only makes sense in the context of the webpage, but not for export, print, etc...
  - Actually it kinda makes sense to support both black/white backgrounds... but it feels weird at the same time -- see what we can do
- Consider changing complex patterns (e.g we have arpeggio+chord in a single pattern which hasan explosion of combinations) into just allowing having multiple patterns on the same fretboard
  - In a way this is worse for the user because they have to find related stuff
  - But it's more flexible too (they don't need their specific combination listed) as long as they can bookmark somehow (so they can come back to their saved presets)
  - Maybe this can be mitigated with a "suggested" section
- Somehow handle note overlaps
  - E.g. dim7 chords have a lot of notes in common and they're currently overridden by each other in the diagram
  - But note that this overriding/merging is also a feature, because we want to sometimes merge notes together
  - But in this specific case (showing multiple chords) we don't want to merge, we want to show all of them!
  - Hard to tell how to do this with these conflicting requirements and still keep UI/UX/pattern DSL simple and intuitive
- PWA

### Multiple fretboards

- Add a way to display multiple diagrams at once (for chord progressions, scale variations...) -- i.e. sheet mode
  - Sheet mode should also have a way to customize layout (e.g. number of columns, spacing between diagrams... or even fully custom layout with drag and drop or similar?)
  - Should also have a special print view
  - Should also be able to be shared, saved, exported, restored...
- Add collections (a way to quickly explore via dropdown related chords and scales)

I think the above could be easily implemented by just:

- Adding visualization modes for N columns + dropdown (collection mode)

### Share

- Add a way to share diagrams (e.g. via URL with hash, or via JSON file export/import, or both!) -- possibly copying to clipboard?
- Implement share if available (so you can share PNG, SVG, etc.)

### Export

- Make print view have a special layout that is optimized for printing (e.g. remove controls and replace them with a small description)
  - If printing only one diagram, do not trigger full-page print view, but instead just print the diagram it is being printed (inside the special layout)

### UI

- Make controls section more compact in mobile (currently it takes a lot of space and pushes the diagram down, which is not ideal)
- Make controls more compact in general (e.g. by using dropdowns, accordions, tabs, or similar to group related options together and save space)
- Improve diagram sizing calcs (becomes too small on mobile, but there's tension between width and height)
- Toast when "copy to clipboard" (in save menu) succeeds or fails

## Bugs

- Print view is not usable right now

## Features to consider

- Text view/export?
  - E.g.
    ```
    E--|-------|-------|--
    B--|---5---|-------|--
    G--|-------|---3---|--
    D--|-------|---7---|--
    A--|-------|-------|--
    E--|---1---|-------|--
    ```
  - Toggle to view as text, e.g.:
  - Download .txt file
  - Copy to clipboard as text
- Add a way to specify (and display) fingerings in diagrams
