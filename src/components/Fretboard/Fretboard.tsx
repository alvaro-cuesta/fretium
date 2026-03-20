import { useId } from 'react';
import { Fragment } from 'react/jsx-runtime';
import type { Tuning } from '../../lib/instrument';
import { checkIsNever } from '../../lib/type';
import { FretboardFretLabel } from './FretboardFretLabel';
import { FretboardFretLine } from './FretboardFretLine';
import { FretboardMarkerCircle } from './FretboardMarkerCircle';
import { FretboardNote } from './FretboardNote';
import { FretboardString } from './FretboardString';

const SHARP_NOTES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const;

const FLAT_TO_SHARP: Readonly<Record<string, (typeof SHARP_NOTES)[number]>> = {
  CB: 'B',
  DB: 'C#',
  EB: 'D#',
  FB: 'E',
  GB: 'F#',
  AB: 'G#',
  BB: 'A#',
  'E#': 'F',
  'B#': 'C',
};

export type FretboardRule = {
  condition: string;
  color: string;
};

export type FretboardDefinition = readonly FretboardRule[];

export type FretboardProps = {
  definition: FretboardDefinition;
  tuning: Tuning<number>;
  startFret: number;
  endFret: number;
  ref?: React.Ref<SVGSVGElement> | undefined;
};

const FRETBOARD_MARKS: Record<number, 'single' | 'double'> = {
  3: 'single',
  5: 'single',
  7: 'single',
  9: 'single',
  12: 'double',
};

function normalizeNote(note: string): (typeof SHARP_NOTES)[number] | null {
  const upper = note.trim().toUpperCase();
  if (SHARP_NOTES.includes(upper as (typeof SHARP_NOTES)[number])) {
    return upper as (typeof SHARP_NOTES)[number];
  }

  return FLAT_TO_SHARP[upper] ?? null;
}

function transposeNote(
  root: string,
  semitones: number,
): (typeof SHARP_NOTES)[number] | null {
  const normalized = normalizeNote(root);
  if (!normalized) {
    return null;
  }

  const rootIndex = SHARP_NOTES.indexOf(normalized);
  const nextIndex =
    (((rootIndex + semitones) % SHARP_NOTES.length) + SHARP_NOTES.length) %
    SHARP_NOTES.length;
  return SHARP_NOTES[nextIndex] ?? null;
}

function matchesCondition(condition: string, note: string): boolean {
  const match = /^\s*note\s*=\s*([a-g](?:#|b)?)\s*$/i.exec(condition);
  if (!match?.[1]) {
    return false;
  }

  const target = normalizeNote(match[1]);
  return target === note;
}

export function Fretboard({
  definition,
  tuning: tuning,
  startFret,
  endFret,
  ref,
}: FretboardProps) {
  const showOpenString = startFret === 0;
  const visibleFretSpaces = showOpenString ? endFret : endFret - startFret + 1;

  const stringCount = tuning.length;

  const boardPaddingX = 50;
  const boardPaddingY = 30;
  const fretSpacing = 62;
  const stringSpacing = 28;
  const fretLabelOffset = 24;

  const boardWidth = visibleFretSpaces * fretSpacing;
  const boardHeight = Math.max(0, (stringCount - 1) * stringSpacing);
  const totalWidth = boardPaddingX * 2 + boardWidth;
  const spaceToStrings = 12;
  const neckOverhang = fretSpacing * 0.4;
  const leftOverhang = startFret > 1 ? neckOverhang : 0;
  const rightOverhang = neckOverhang;
  const totalHeight = boardPaddingY * 2 + boardHeight + fretLabelOffset;

  const noteOccurrences = new Map<string, number>();
  const stringRows = tuning.toReversed().map((openNote, rowIndex) => {
    const occurrence = (noteOccurrences.get(openNote) ?? 0) + 1;
    noteOccurrences.set(openNote, occurrence);

    const originalIndex = stringCount - 1 - rowIndex;

    return {
      id: `${openNote}-${occurrence}`,
      openNote,
      y: rowIndex * stringSpacing,
      gauge: Math.max(1.2, 3.2 - originalIndex * 0.35),
    };
  });

  const neckClipId = `neck-clip-${useId()}`;

  const fretLineX = (physicalLine: number) => physicalLine * fretSpacing;
  const noteX = (actualFret: number) => {
    if (actualFret === 0) return -fretSpacing / 2;
    if (showOpenString) return actualFret * fretSpacing - fretSpacing / 2;
    return (actualFret - startFret + 1) * fretSpacing - fretSpacing / 2;
  };

  return (
    <svg
      role="img"
      // @todo better aria-label based on props
      aria-label="Fretboard diagram"
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      ref={ref}
    >
      <defs>
        <clipPath id={neckClipId}>
          <rect
            x={-leftOverhang}
            y={-spaceToStrings}
            width={boardWidth + leftOverhang + rightOverhang}
            height={boardHeight + 2 * spaceToStrings}
            rx={14}
          />
        </clipPath>
      </defs>
      <g transform={`translate(${boardPaddingX}, ${boardPaddingY})`}>
        <rect
          x={-leftOverhang}
          y={-spaceToStrings}
          width={boardWidth + leftOverhang + rightOverhang}
          height={boardHeight + 2 * spaceToStrings}
          fill="rgba(120, 78, 43, 0.13)"
          rx={14}
        />

        {Array.from({ length: visibleFretSpaces + 1 }, (_, lineIndex) => (
          <FretboardFretLine
            key={lineIndex}
            x={fretLineX(lineIndex)}
            yTop={-spaceToStrings}
            yBottom={boardHeight + spaceToStrings}
            isNut={startFret <= 1 && lineIndex === 0}
          />
        ))}

        <g clipPath={`url(#${neckClipId})`}>
          {/* Fret markers */}
          {Array.from({ length: visibleFretSpaces }, (_, i) => {
            const actualFret = showOpenString ? i + 1 : startFret + i;
            const fretModulo = ((actualFret - 1) % 12) + 1;

            const markType = FRETBOARD_MARKS[fretModulo];
            if (!markType) return null;

            const x = noteX(actualFret);

            switch (markType) {
              case 'single': {
                return (
                  <FretboardMarkerCircle
                    key={i}
                    x={x}
                    y={boardHeight * 0.5}
                  />
                );
              }

              case 'double': {
                return (
                  <g key={i}>
                    <FretboardMarkerCircle
                      x={x}
                      y={boardHeight * 0.3}
                    />
                    <FretboardMarkerCircle
                      x={x}
                      y={boardHeight * 0.7}
                    />
                  </g>
                );
              }
              default: {
                checkIsNever(markType);
              }
            }
          })}

          {stringRows.map((row) => {
            const y = row.y;

            return (
              <Fragment key={`string-${row.id}`}>
                {/* String line */}
                <FretboardString
                  key={row.id}
                  xLeft={-leftOverhang}
                  xRight={boardWidth + rightOverhang}
                  y={y}
                  gauge={row.gauge}
                />
              </Fragment>
            );
          })}
        </g>

        {stringRows.map((row) => {
          const y = row.y;

          return Array.from(
            {
              length: endFret - (showOpenString ? 0 : startFret) + 1,
            },
            (_, i) => {
              const fret = (showOpenString ? 0 : startFret) + i;
              const note = transposeNote(row.openNote, fret);
              if (!note) {
                return null;
              }

              const matchingRule = definition.find((rule) =>
                matchesCondition(rule.condition, note),
              );
              if (!matchingRule) {
                return null;
              }

              return (
                <FretboardNote
                  key={`${row.id}-${fret}`}
                  x={noteX(fret)}
                  y={y}
                  color={matchingRule.color}
                  note={note}
                />
              );
            },
          );
        })}

        {Array.from({ length: visibleFretSpaces }, (_, i) => {
          const actualFret = showOpenString ? i + 1 : startFret + i;
          const fretModulo = ((actualFret - 1) % 12) + 1;

          if (!FRETBOARD_MARKS[fretModulo]) {
            return null;
          }

          return (
            <FretboardFretLabel
              key={`label-${actualFret}`}
              x={noteX(actualFret)}
              y={boardHeight + fretLabelOffset}
              fret={actualFret}
            />
          );
        })}
      </g>
    </svg>
  );
}
