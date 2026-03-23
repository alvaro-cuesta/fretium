# Fretium TODO

## Data

- Add more instruments and tunings
- Add more patterns (chords, scales, arpeggios...)
- Curate patterns: e.g. currently dom7 arpeggio G position is wrong(ish)
- Refactor pattern generation? E.g. tool to automatically mark duplicate options transparent, or automatically find overlapping chords instead of manually doing it

## Features

### Uncategorized

- Root note: auto fit -- it should automatically find the best root note to fit the pattern in the diagram, so that the diagram is as compact as possible (e.g. for a Cmaj7 chord, it should choose E as the root note, so that the diagram only shows 4 frets instead of 5)
- Min/max fret: auto fit -- it should automatically find the best max fret to fit the pattern in the diagram, so that the diagram is as compact as possible (e.g. for a Cmaj7 chord, if the root note is E, it should choose max fret 7 instead of 12, so that the diagram only shows 4 frets instead of 5) -- it should also have an option to avoid using open strings
- Allow forcing frets to full-neck for auto frets (to use in scales)
- Allow better pattern DSL
- Add support for custom pattern
  - Needs editing capabilities in the fretboard
  - Needs a way to save patterns (to hash? to file? to local storage?)
- Add current options to hash? E.g. selected instrument, tuning, chord/scale, diagram options...
- Add a way to customize diagram appearance (colors, fonts, sizes, shown elements... anything that can be customized as `Fretboard` props should be added, plus current constasnts like `SPACING_BETWEEN_STRINGS` -- probably themes and not individual options, to keep it simple)
- Add a way to display multiple diagrams at once (for chord progressions, scale variations...) -- i.e. sheet mode
  - Sheet mode should also have a way to customize layout (e.g. number of columns, spacing between diagrams... or even fully custom layout with drag and drop or similar?)
  - Should also have a special print view
- Add a way to display fingerings in diagrams
- Add collections (a way to quickly explore via dropdown related chords and scales)
- Transparent background in SVG only makes sense in the context of the webpage, but not for export, print, etc...
- Consider changing patterns from flat list to nested subvariations
- Somehow handle note overlaps -- e.g. dim7 chords have a lot of notes in common and they're currently overridden by each other in the diagram (which is also a feature, because we want to sometimes merge notes together, but in this case we don't want to merge, we want to show all of them -- hard to tell how to do this with these conflicting requirements and still keep UI/UX/pattern DSL simple and intuitive)
- Toggle to view as text?

### Share

- Add a way to share diagrams (e.g. via URL with hash, or via JSON file export/import, or both!)

### Export

- Download/copy to clipboard as text
- Make print view have a special layout that is optimized for printing (e.g. remove controls and replace them with a small description)
  - If printing only one diagram, do not trigger full-page print view, but instead just print the diagram it is being printed (inside the special layout)

### UI

- Make controls section more compact in mobile (currently it takes a lot of space and pushes the diagram down, which is not ideal)
- Make controls more compact in general (e.g. by using dropdowns, accordions, tabs, or similar to group related options together and save space)
- Improve diagram sizing calcs (becomes too small on mobile)

## Bugs

- Sometimes during dev, when React Refresh does its thing, the `MutationObserver` seems to be disconnected from the actual SVG -- not sure how or when than happens, but it causes the diagram to stop updating until you refresh the page, which is a bit annoying during development
  - This has been possibly solved but, since I haven't been able to reliably reproduce it, I'm not sure if the solution is actually working -- need to keep an eye on this and see if it happens again
