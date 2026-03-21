import { useId } from 'react';
import type { Tuning } from '../../lib/instrument';
import type { Note } from '../../lib/music';
import {
  getDisplayNoteFromRoot,
  getIntervalLabelFromCondition,
  getIntervalLabelFromRoot,
  matchesCondition,
  transposeNote,
  type RuleDefinition,
} from '../../lib/rule-engine';
import { checkIsNever } from '../../lib/type';
import { FretboardFretLabel } from './FretboardFretLabel';
import { FretboardFretLine } from './FretboardFretLine';
import { FretboardMarkerCircle } from './FretboardMarkerCircle';
import { FretboardNote } from './FretboardNote';
import { FretboardString } from './FretboardString';
import {
  FRETBOARD_THEME_FRET_WIDTH,
  FRETBOARD_THEME_LABEL_FONT_SIZE,
  FRETBOARD_THEME_NECK_COLOR,
  FRETBOARD_THEME_NOTE_RADIUS,
  FRETBOARD_THEME_NUT_WIDTH,
} from './theme';

export type FretboardProps = {
  definition: RuleDefinition;
  tuning: Tuning<number>;
  startFret: number;
  endFret: number;
  noteDisplayMode: 'note' | 'interval' | 'none';
  rootNote: Note;
  ref?: React.Ref<SVGSVGElement> | undefined;
};

const FRETBOARD_MARKS: Record<number, 'single' | 'double'> = {
  3: 'single',
  5: 'single',
  7: 'single',
  9: 'single',
  12: 'double',
};

const FRETBOARD_CORNER_RADIUS = 14;
const BOARD_PADDING_Y = 30;
const FRET_SPACING = 62;
const STRING_SPACING = 28;
const FRET_LABEL_OFFSET = 24;
const SPACE_TO_STRINGS = 12;
const NECK_OVERHANG_RATIO = 0.4;

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
  tuning: tuning,
  startFret,
  endFret,
  noteDisplayMode,
  rootNote,
  ref,
}: FretboardProps) {
  const showOpenString = startFret === 0;
  const visibleFretSpaces = showOpenString ? endFret : endFret - startFret + 1;

  const stringCount = tuning.length;
  const boardWidth = visibleFretSpaces * FRET_SPACING;
  const boardHeight = Math.max(0, (stringCount - 1) * STRING_SPACING);
  const neckOverhang = FRET_SPACING * NECK_OVERHANG_RATIO;
  const leftOverhang = startFret > 1 ? neckOverhang : 0;
  const rightOverhang = neckOverhang;
  const outerPaddingY = BOARD_PADDING_Y - SPACE_TO_STRINGS;
  const baseMarginX = outerPaddingY;
  const neckLeftX = -leftOverhang;
  const neckTopY = -SPACE_TO_STRINGS;
  const neckWidth = boardWidth + leftOverhang + rightOverhang;
  const neckHeight = boardHeight + 2 * SPACE_TO_STRINGS;
  const neckPath = getRoundedRectPath({
    x: neckLeftX,
    y: neckTopY,
    width: neckWidth,
    height: neckHeight,
    radius: FRETBOARD_CORNER_RADIUS,
    roundLeft: startFret > 1,
    roundRight: true,
  });
  const stringStartX =
    startFret <= 1 ? -FRETBOARD_THEME_NUT_WIDTH / 2 : neckLeftX;
  const leftContentClipX = showOpenString
    ? Math.min(stringStartX, -FRET_SPACING / 2 - FRETBOARD_THEME_NOTE_RADIUS)
    : stringStartX;
  const leftClipWidth = Math.max(0, neckLeftX - leftContentClipX);

  const noteOccurrences = new Map<string, number>();
  const stringRows = tuning.toReversed().map((openNote, rowIndex) => {
    const occurrence = (noteOccurrences.get(openNote) ?? 0) + 1;
    noteOccurrences.set(openNote, occurrence);

    const originalIndex = stringCount - 1 - rowIndex;

    return {
      openNote,
      y: rowIndex * STRING_SPACING,
      gauge: Math.max(1.2, 3.2 - originalIndex * 0.35),
      number: rowIndex + 1,
    };
  });

  // @todo Is this even working?
  const neckClipId = `neck-clip-${useId()}`;

  const fretLineX = (physicalLine: number) => physicalLine * FRET_SPACING;
  const noteX = (actualFret: number) => {
    if (actualFret === 0) return -FRET_SPACING / 2;
    if (showOpenString) return actualFret * FRET_SPACING - FRET_SPACING / 2;
    return (actualFret - startFret + 1) * FRET_SPACING - FRET_SPACING / 2;
  };
  const markerStartFret = startFret > 1 ? startFret - 1 : 1;
  const markerFretCount = endFret - markerStartFret + 2;
  const openStringPaddingX = showOpenString
    ? FRET_SPACING / 2 + FRETBOARD_THEME_NOTE_RADIUS
    : 0;
  const nutMarginCompensationX =
    startFret === 1 ? FRETBOARD_THEME_NUT_WIDTH / 2 : 0;
  const translateX =
    baseMarginX + leftOverhang + openStringPaddingX + nutMarginCompensationX;
  const fretLineStrokeHalf =
    (startFret <= 1 ? FRETBOARD_THEME_NUT_WIDTH : FRETBOARD_THEME_FRET_WIDTH) /
    2;
  const highestContentY = -SPACE_TO_STRINGS - fretLineStrokeHalf;
  const neckBottomContentY =
    boardHeight + SPACE_TO_STRINGS + fretLineStrokeHalf;
  const labelBottomContentY =
    boardHeight + FRET_LABEL_OFFSET + FRETBOARD_THEME_LABEL_FONT_SIZE / 2;
  const bottomSpaceFromNeck = Math.max(
    outerPaddingY,
    labelBottomContentY - neckBottomContentY,
  );
  const translateY = outerPaddingY - highestContentY;
  const totalWidth = translateX + neckWidth + baseMarginX;
  const totalHeight = translateY + neckBottomContentY + bottomSpaceFromNeck;

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
          {leftClipWidth > 0 && (
            <rect
              x={leftContentClipX}
              y={neckTopY}
              width={leftClipWidth}
              height={neckHeight}
            />
          )}
        </clipPath>
      </defs>
      <g transform={`translate(${translateX}, ${translateY})`}>
        <g clipPath={`url(#${neckClipId})`}>
          <path
            d={neckPath}
            fill={FRETBOARD_THEME_NECK_COLOR}
          />

          {Array.from({ length: visibleFretSpaces + 1 }, (_, lineIndex) => (
            <FretboardFretLine
              key={lineIndex}
              x={fretLineX(lineIndex)}
              yTop={-SPACE_TO_STRINGS}
              yBottom={boardHeight + SPACE_TO_STRINGS}
              isNut={startFret <= 1 && lineIndex === 0}
            />
          ))}

          {/* Fret markers */}
          {Array.from({ length: markerFretCount }, (_, i) => {
            const actualFret = markerStartFret + i;
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

          {/* Strings + Notes */}
          {stringRows.map((row, rowIndex) => {
            // String
            const string = (
              <FretboardString
                xLeft={stringStartX}
                xRight={boardWidth + rightOverhang}
                gauge={row.gauge}
              />
            );

            // Notes
            const notes = Array.from(
              {
                length: endFret - (showOpenString ? 0 : startFret) + 1,
              },
              (_, i) => {
                const fret = (showOpenString ? 0 : startFret) + i;
                const note = transposeNote(row.openNote, fret);
                if (!note) {
                  return null;
                }

                const matchingRules = definition.filter((rule) =>
                  matchesCondition(
                    rule.condition,
                    {
                      string: row.number,
                      fret,
                      note,
                    },
                    {
                      rootNote,
                    },
                  ),
                );
                if (matchingRules.length === 0) {
                  return null;
                }

                const { condition: _condition, ...mergedProps } =
                  matchingRules.reduce((acc, rule) => ({ ...acc, ...rule }));

                const displayedNote =
                  getDisplayNoteFromRoot(note, rootNote) ?? note;
                const intervalLabelFromDefinition = matchingRules
                  .toReversed()
                  .find((rule) => rule.condition.interval !== undefined)
                  ?.condition.interval;
                const displayedInterval = intervalLabelFromDefinition
                  ? getIntervalLabelFromCondition(
                      note,
                      intervalLabelFromDefinition,
                      rootNote,
                    )
                  : null;

                const noteLabel =
                  noteDisplayMode === 'interval'
                    ? (displayedInterval ??
                      getIntervalLabelFromRoot(note, rootNote) ??
                      displayedNote)
                    : displayedNote;

                return (
                  <FretboardNote
                    key={fret}
                    x={noteX(fret)}
                    color={mergedProps.color}
                    label={noteDisplayMode === 'none' ? null : noteLabel}
                    opacity={mergedProps.opacity}
                  />
                );
              },
            );

            return (
              <g
                // eslint-disable-next-line react-x/no-array-index-key -- nothing else we can go by
                key={rowIndex}
                transform={`translate(0, ${row.y})`}
              >
                {string}
                {notes}
              </g>
            );
          })}
        </g>

        {/* Fret labels */}
        {Array.from({ length: visibleFretSpaces }, (_, i) => {
          const actualFret = showOpenString ? i + 1 : startFret + i;
          const fretModulo = ((actualFret - 1) % 12) + 1;
          const isBoundaryFret =
            actualFret === Math.max(1, startFret) || actualFret === endFret;

          if (!isBoundaryFret && !FRETBOARD_MARKS[fretModulo]) {
            return null;
          }

          return (
            <FretboardFretLabel
              key={`label-${actualFret}`}
              x={noteX(actualFret)}
              y={boardHeight + FRET_LABEL_OFFSET}
              fret={actualFret}
            />
          );
        })}
      </g>
    </svg>
  );
}
