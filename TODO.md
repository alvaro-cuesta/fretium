# Fretium TODO

## Data

- Add more instruments and tunings
- Add more patterns (chords, scales, arpeggios...)

## Features

- Allow better pattern DSL
- Add support for custom pattern
  - Needs editing capabilities in the fretboard
  - Needs a way to save patterns (to hash? to file? to local storage?)
- Add current options to hash? E.g. selected instrument, tuning, chord/scale, diagram options...
- Add a way to customize diagram appearance (colors, fonts, sizes, shown elements... anything that can be customized as `Fretboard` props should be added, plus current constasnts like `SPACING_BETWEEN_STRINGS`)
- Add a way to display multiple diagrams at once (for chord progressions, scale variations...)
- Add a way to display fingerings in diagrams
- Add collections (a way to quickly explore via dropdown related chords and scales)
- Somehow handle note overlaps -- e.g. dim7 chords have a lot of notes in common and they're currently overridden by each other in the diagram (which is also a feature, because we want to sometimes merge notes together, but in this case we don't want to merge, we want to show all of them -- hard to tell how to do this with these conflicting requirements and still keep UI/UX/pattern DSL simple and intuitive)
- Make controls section more compact in mobile (currently it takes a lot of space and pushes the diagram down, which is not ideal)

## Bugs

- The controls section changes size as the diagram changes size, which can be a bit jarring
