import { useId } from 'react';
import type { NoteDisplayMode } from '../../lib/config';
import type { Tuning } from '../../lib/instrument';
import {
  LOOSE_INTERVAL_TO_NOTE_CLASS,
  NOTE_TO_NOTE_CLASS,
  semitonesToNoteClass,
  type DegreeWithAccidental,
  type Interval,
  type LooseInterval,
  type Note,
  type NoteClass,
} from '../../lib/music';
import {
  getAppliedRules,
  type GetAppliedRulesResult,
  type RuleDefinition,
} from '../../lib/rule-engine';
import { checkIsNever } from '../../lib/type';
import { FretboardFretLabel } from './FretboardFretLabel';
import { FretboardFretLine } from './FretboardFretLine';
import { FretboardMarkerCircle } from './FretboardMarkerCircle';
import { FretboardNote } from './FretboardNote';
import { FretboardString } from './FretboardString';
import {
  FRETBOARD_THEME_FONT_FAMILY,
  FRETBOARD_THEME_LABEL_COLOR,
  FRETBOARD_THEME_LABEL_FONT_SIZE,
  FRETBOARD_THEME_LABEL_FONT_WEIGHT,
  FRETBOARD_THEME_NECK_COLOR,
  FRETBOARD_THEME_NUT_WIDTH,
} from './theme';

export type FretboardProps = {
  definition: RuleDefinition;
  tuning: Tuning<number>;
  startFret: number;
  endFret: number;
  showStringNames: boolean;
  noteDisplayMode: NoteDisplayMode;
  rootNote: Note;
  ref?: React.Ref<SVGSVGElement> | undefined;
};

const FRETS_WITH_MARKERS: Record<number, 'single' | 'double'> = {
  3: 'single',
  5: 'single',
  7: 'single',
  9: 'single',
  12: 'double',
};

const FRETBOARD_CORNER_RADIUS = 14;
const BOARD_PADDING = 16;
const FRET_SPACING = 64;
const OVERHANG_SPACING = 24;
const SPACING_BETWEEN_STRINGS = 28;
const FRET_LABEL_OFFSET = 12;
const SPACE_TO_STRINGS = 12;
const OPEN_STRING_X = FRETBOARD_THEME_NUT_WIDTH / 2 - FRET_SPACING / 2;

function getRoundedRectPath({
  x,
  y,
  width,
  height,
  radius,
  roundLeft,
  roundRight,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  roundLeft: boolean;
  roundRight: boolean;
}): string {
  const limitedRadius = Math.min(radius, width / 2, height / 2);
  const leftRadius = roundLeft ? limitedRadius : 0;
  const rightRadius = roundRight ? limitedRadius : 0;
  const right = x + width;
  const bottom = y + height;

  return [
    `M ${x + leftRadius} ${y}`,
    `H ${right - rightRadius}`,
    rightRadius > 0
      ? `A ${rightRadius} ${rightRadius} 0 0 1 ${right} ${y + rightRadius}`
      : `L ${right} ${y}`,
    `V ${bottom - rightRadius}`,
    rightRadius > 0
      ? `A ${rightRadius} ${rightRadius} 0 0 1 ${right - rightRadius} ${bottom}`
      : `L ${right} ${bottom}`,
    `H ${x + leftRadius}`,
    leftRadius > 0
      ? `A ${leftRadius} ${leftRadius} 0 0 1 ${x} ${bottom - leftRadius}`
      : `L ${x} ${bottom}`,
    `V ${y + leftRadius}`,
    leftRadius > 0
      ? `A ${leftRadius} ${leftRadius} 0 0 1 ${x + leftRadius} ${y}`
      : `L ${x} ${y}`,
    'Z',
  ].join(' ');
}

export function Fretboard({
  definition,
  tuning,
  startFret,
  endFret,
  showStringNames,
  noteDisplayMode,
  rootNote,
  ref,
}: FretboardProps) {
  const showOpenString = startFret === 0;
  const hasNut = startFret <= 1;
  const hasLeftOverhang = startFret > 1;
  const firstNeckFret = Math.max(1, startFret);
  const stringCount = tuning.length;

  const neckHeight =
    SPACE_TO_STRINGS +
    Math.max(0, (stringCount - 1) * SPACING_BETWEEN_STRINGS) +
    SPACE_TO_STRINGS;

  const fretLineX = (fret: number) => {
    if (hasNut) {
      return FRETBOARD_THEME_NUT_WIDTH / 2 + (fret - 1) * FRET_SPACING;
    }

    return OVERHANG_SPACING + (fret - firstNeckFret) * FRET_SPACING;
  };

  const noteX = (fret: number) => {
    if (fret === 0) {
      return fretLineX(1) - FRET_SPACING / 2;
    }

    return fretLineX(fret) + FRET_SPACING / 2;
  };

  const neckWidth = fretLineX(endFret + 1) + OVERHANG_SPACING;

  const neckPath = getRoundedRectPath({
    x: 0,
    y: 0,
    width: neckWidth,
    height: neckHeight,
    radius: FRETBOARD_CORNER_RADIUS,
    roundLeft: hasLeftOverhang,
    roundRight: true,
  });

  const neckClipId = `neck-clip-${useId()}`;

  const leftMargin = Math.max(
    BOARD_PADDING,
    showOpenString || showStringNames ? FRET_SPACING : 0,
  );
  const translateX = leftMargin;
  const translateY = BOARD_PADDING;

  const contentHeight = FRET_LABEL_OFFSET * 2;
  const totalWidth = translateX + neckWidth + BOARD_PADDING;
  const totalHeight =
    translateY + neckHeight + Math.max(BOARD_PADDING, contentHeight);

  const renderStringName = (openNote: Note, y: number) => (
    <text
      key={`string-name-${openNote}-${y}`}
      x={OPEN_STRING_X}
      y={y}
      fill={FRETBOARD_THEME_LABEL_COLOR}
      fontFamily={FRETBOARD_THEME_FONT_FAMILY}
      fontSize={FRETBOARD_THEME_LABEL_FONT_SIZE}
      fontWeight={FRETBOARD_THEME_LABEL_FONT_WEIGHT}
      textAnchor="middle"
      dominantBaseline="central"
      alignmentBaseline="central"
    >
      {openNote}
    </text>
  );

  const renderNote = (stringNumber: number, fret: number, y: number) => {
    const appliedRulesResult = getAppliedRules(
      tuning,
      stringNumber,
      fret,
      rootNote,
      definition,
    );
    if (!appliedRulesResult) {
      return null;
    }

    const noteLabel = getNoteLabel(
      noteDisplayMode,
      rootNote,
      appliedRulesResult,
    );

    return (
      <FretboardNote
        key={`${stringNumber}-${fret}`}
        x={fret === 0 ? OPEN_STRING_X : noteX(fret)}
        y={y}
        color={appliedRulesResult.appliedRules.color}
        label={noteDisplayMode === 'none' ? null : noteLabel}
        opacity={appliedRulesResult.appliedRules.opacity}
      />
    );
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
          <path d={neckPath} />
        </clipPath>
      </defs>
      <g transform={`translate(${translateX}, ${translateY})`}>
        <g clipPath={`url(#${neckClipId})`}>
          <rect
            x={0}
            y={0}
            width={neckWidth}
            height={neckHeight}
            fill={FRETBOARD_THEME_NECK_COLOR}
          />

          {/* Fret lines */}
          {Array.from(
            rangeInclusiveRight(firstNeckFret, endFret + 1),
            (fret) => (
              <FretboardFretLine
                key={fret}
                x={fretLineX(fret)}
                yTop={0}
                yBottom={neckHeight}
                isNut={fret === 1}
              />
            ),
          )}

          {/* Fret markers */}
          {Array.from(
            rangeInclusiveRight(Math.max(1, firstNeckFret - 1), endFret + 1),
            (fret) => {
              const fretMarkerType = getFretMarkerType(fret);
              const x = noteX(fret);
              const middle = neckHeight * 0.5;
              const stringAreaHeight = neckHeight - 2 * SPACE_TO_STRINGS;

              switch (fretMarkerType) {
                case 'single': {
                  return (
                    <FretboardMarkerCircle
                      key={fret}
                      x={x}
                      y={middle}
                    />
                  );
                }

                case 'double': {
                  return (
                    <g key={fret}>
                      <FretboardMarkerCircle
                        x={x}
                        y={SPACE_TO_STRINGS + stringAreaHeight * 0.3}
                      />
                      <FretboardMarkerCircle
                        x={x}
                        y={SPACE_TO_STRINGS + stringAreaHeight * 0.7}
                      />
                    </g>
                  );
                }

                case null: {
                  return null;
                }

                default: {
                  checkIsNever(fretMarkerType);
                }
              }
            },
          )}

          {/* Strings and notes (inside neck) */}
          {tuning.toReversed().map((openNote, i) => {
            const stringNumber = i + 1;
            const y = SPACE_TO_STRINGS + i * SPACING_BETWEEN_STRINGS;
            const gauge = Math.max(
              1.2,
              3.2 - (stringCount - stringNumber) * 0.35,
            );

            return (
              <g key={`${openNote}-${stringNumber}`}>
                {/* Strings */}
                <FretboardString
                  xLeft={0}
                  xRight={neckWidth}
                  y={y}
                  gauge={gauge}
                />

                {/* Notes */}
                {Array.from(
                  rangeInclusiveRight(firstNeckFret, endFret),
                  (fret) => renderNote(stringNumber, fret, y),
                )}
              </g>
            );
          })}
        </g>

        {/* String names */}
        {showStringNames &&
          tuning.toReversed().map((openNote, i) => {
            const y = SPACE_TO_STRINGS + i * SPACING_BETWEEN_STRINGS;
            return renderStringName(openNote, y);
          })}

        {/* Open string notes */}
        {showOpenString &&
          tuning.toReversed().map((_, i) => {
            const stringNumber = i + 1;
            const y = SPACE_TO_STRINGS + i * SPACING_BETWEEN_STRINGS;
            return renderNote(stringNumber, 0, y);
          })}

        {/* Fret labels */}
        {Array.from(rangeInclusiveRight(firstNeckFret, endFret))
          .filter((fret) => {
            const isBoundaryFret = fret === firstNeckFret || fret === endFret;

            return isBoundaryFret || getFretMarkerType(fret) !== null;
          })
          .map((fret) => (
            <FretboardFretLabel
              key={fret}
              x={noteX(fret)}
              y={neckHeight + FRET_LABEL_OFFSET}
              fret={fret}
            />
          ))}
      </g>
    </svg>
  );
}

function* rangeInclusiveRight(start: number, end: number): Generator<number> {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

function getFretMarkerType(fret: number): 'single' | 'double' | null {
  const fretModulo = ((fret - 1) % 12) + 1;
  return FRETS_WITH_MARKERS[fretModulo] ?? null;
}

const NOTE_CLASS_TO_DISPLAY_INTERVAL: Record<NoteClass, Interval> = {
  0: 'P1',
  1: 'm2',
  2: 'M2',
  3: 'm3',
  4: 'M3',
  5: 'P4',
  6: 'TT',
  7: 'P5',
  8: 'm6',
  9: 'M6',
  10: 'm7',
  11: 'M7',
} as const;
const NOTE_CLASS_TO_DISPLAY_DEGREE_WITH_ACCIDENTAL: Record<
  NoteClass,
  DegreeWithAccidental
> = {
  0: '1',
  1: 'b2',
  2: '2',
  3: 'b3',
  4: '3',
  5: '4',
  6: 'b5',
  7: '5',
  8: 'b6',
  9: '6',
  10: 'b7',
  11: '7',
} as const;

const NOTE_CLASS_TO_DISPLAY_SHARP_NOTE: Readonly<Record<NoteClass, Note>> = {
  0: 'C',
  1: 'C#',
  2: 'D',
  3: 'D#',
  4: 'E',
  5: 'F',
  6: 'F#',
  7: 'G',
  8: 'G#',
  9: 'A',
  10: 'A#',
  11: 'B',
};

const NOTE_CLASS_TO_DISPLAY_FLAT_NOTE: Readonly<Record<NoteClass, Note>> = {
  0: 'C',
  1: 'Db',
  2: 'D',
  3: 'Eb',
  4: 'E',
  5: 'F',
  6: 'Gb',
  7: 'G',
  8: 'Ab',
  9: 'A',
  10: 'Bb',
  11: 'B',
};

const MATCHED_INTERVAL_TO_DISPLAY_INTERVAL: Record<LooseInterval, Interval> = {
  P1: 'P1',
  d2: 'd2',
  m2: 'm2',
  A1: 'A1',
  S: 'S',
  M2: 'M2',
  d3: 'd3',
  T: 'T',
  m3: 'm3',
  A2: 'A2',
  M3: 'M3',
  d4: 'd4',
  P4: 'P4',
  A3: 'A3',
  d5: 'd5',
  A4: 'A4',
  TT: 'TT',
  P5: 'P5',
  d6: 'd6',
  m6: 'm6',
  A5: 'A5',
  M6: 'M6',
  d7: 'd7',
  m7: 'm7',
  A6: 'A6',
  M7: 'M7',
  d8: 'd8',
  P8: 'P8',
  A7: 'A7',
  A8: 'A8',
  AA1: 'AA1',
  AA2: 'AA2',
  AA3: 'AA3',
  AA4: 'AA4',
  AA5: 'AA5',
  AA6: 'AA6',
  AA7: 'AA7',
  AA8: 'AA8',
  d1: 'd1',
  dd1: 'dd1',
  dd2: 'dd2',
  dd3: 'dd3',
  dd4: 'dd4',
  dd5: 'dd5',
  dd6: 'dd6',
  dd7: 'dd7',
  dd8: 'dd8',

  bb1: 'dd1',
  b1: 'd1',
  '1': 'P1',
  '#1': 'A1',
  '##1': 'AA1',

  bb2: 'd2',
  b2: 'm2',
  '2': 'M2',
  '#2': 'A2',
  '##2': 'AA2',

  bb3: 'd3',
  b3: 'm3',
  '3': 'M3',
  '#3': 'A3',
  '##3': 'AA3',

  bb4: 'dd4',
  b4: 'd4',
  '4': 'P4',
  '#4': 'A4',
  '##4': 'AA4',

  bb5: 'dd5',
  b5: 'd5',
  '5': 'P5',
  '#5': 'A5',
  '##5': 'AA5',

  bb6: 'd6',
  b6: 'm6',
  '6': 'M6',
  '#6': 'A6',
  '##6': 'AA6',

  bb7: 'd7',
  b7: 'm7',
  '7': 'M7',
  '#7': 'A7',
  '##7': 'AA7',

  bb8: 'dd8',
  b8: 'd8',
  '8': 'P8',
  '#8': 'A8',
  '##8': 'AA8',
};

const MATCHED_INTERVAL_TO_DISPLAY_DEGREE_WITH_ACCIDENTAL: Record<
  LooseInterval,
  DegreeWithAccidental
> = {
  bb1: 'bb1',
  b1: 'b1',
  '1': '1',
  '#1': '#1',
  '##1': '##1',
  bb2: 'bb2',
  b2: 'b2',
  '2': '2',
  '#2': '#2',
  '##2': '##2',
  bb3: 'bb3',
  b3: 'b3',
  '3': '3',
  '#3': '#3',
  '##3': '##3',
  bb4: 'bb4',
  b4: 'b4',
  '4': '4',
  '#4': '#4',
  '##4': '##4',
  bb5: 'bb5',
  b5: 'b5',
  '5': '5',
  '#5': '#5',
  '##5': '##5',
  bb6: 'bb6',
  b6: 'b6',
  '6': '6',
  '#6': '#6',
  '##6': '##6',
  bb7: 'bb7',
  b7: 'b7',
  '7': '7',
  '#7': '#7',
  '##7': '##7',
  bb8: 'bb8',
  b8: 'b8',
  '8': '8',
  '#8': '#8',
  '##8': '##8',

  P1: '1',
  d2: 'bb2',
  m2: 'b2',
  A1: '##1',
  S: 'b2',
  M2: '2',
  d3: 'bb3',
  T: '2',
  m3: 'b3',
  A2: '##2',
  M3: '3',
  d4: 'b4',
  P4: '4',
  A3: '#3',
  d5: 'b5',
  A4: '#4',
  TT: 'b5',
  P5: '5',
  d6: 'bb6',
  m6: 'b6',
  A5: '#5',
  M6: '6',
  d7: 'bb7',
  m7: 'b7',
  A6: '#6',
  M7: '7',
  A7: '#7',
  d8: 'b8',
  P8: '8',
  A8: '#8',
  AA1: '##1',
  AA2: '##2',
  AA3: '##3',
  AA4: '##4',
  AA5: '##5',
  AA6: '##6',
  AA7: '##7',
  AA8: '##8',
  d1: 'b1',
  dd1: 'bb1',
  dd4: 'bb4',
  dd5: 'bb5',
  dd8: 'bb8',

  // Fallbacks
  dd2: '1',
  dd3: '2',
  dd6: '5',
  dd7: '6',
};

function getNoteLabel(
  noteDisplayMode: NoteDisplayMode,
  rootNote: Note,
  appliedRulesResult: GetAppliedRulesResult,
) {
  switch (noteDisplayMode) {
    case 'interval':
    case 'degree': {
      const rootNoteClass = NOTE_TO_NOTE_CLASS[rootNote];
      const noteSemitonesFromRoot = semitonesToNoteClass(
        appliedRulesResult.noteClass - rootNoteClass,
      );

      const matchedInterval = getMatchedInterval(rootNote, appliedRulesResult);

      switch (noteDisplayMode) {
        case 'interval': {
          return matchedInterval
            ? MATCHED_INTERVAL_TO_DISPLAY_INTERVAL[matchedInterval]
            : NOTE_CLASS_TO_DISPLAY_INTERVAL[noteSemitonesFromRoot];
        }

        case 'degree': {
          return matchedInterval
            ? MATCHED_INTERVAL_TO_DISPLAY_DEGREE_WITH_ACCIDENTAL[
                matchedInterval
              ]
            : NOTE_CLASS_TO_DISPLAY_DEGREE_WITH_ACCIDENTAL[
                noteSemitonesFromRoot
              ];
        }

        default: {
          return checkIsNever(noteDisplayMode);
        }
      }
    }

    case 'note': {
      const shouldPreferFlatNoteNames = rootNote.includes('b');
      return shouldPreferFlatNoteNames
        ? NOTE_CLASS_TO_DISPLAY_FLAT_NOTE[appliedRulesResult.noteClass]
        : NOTE_CLASS_TO_DISPLAY_SHARP_NOTE[appliedRulesResult.noteClass];
    }

    case 'none': {
      return null;
    }

    default: {
      return checkIsNever(noteDisplayMode);
    }
  }
}

function getMatchedInterval(
  rootNote: Note,
  appliedRulesResult: GetAppliedRulesResult,
): LooseInterval | null {
  const matchedIntervalCondition = appliedRulesResult.matchingRules
    .toReversed()
    .find((rule) => rule.condition.interval !== undefined)?.condition.interval;

  if (!matchedIntervalCondition) {
    return null;
  }

  const candidateIntervals: readonly LooseInterval[] =
    typeof matchedIntervalCondition === 'string'
      ? [matchedIntervalCondition]
      : matchedIntervalCondition;

  const rootNoteClass = NOTE_TO_NOTE_CLASS[rootNote];
  const noteSemitonesFromRoot = semitonesToNoteClass(
    appliedRulesResult.noteClass - rootNoteClass,
  );

  for (const interval of candidateIntervals) {
    if (LOOSE_INTERVAL_TO_NOTE_CLASS[interval] === noteSemitonesFromRoot) {
      return interval;
    }
  }

  return null;
}
