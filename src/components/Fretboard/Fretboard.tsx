import { useId } from 'react';
import { Fragment } from 'react/jsx-runtime';
import type { Tuning } from '../../lib/instrument';
import type { Note } from '../../lib/music';
import {
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

const FRETBOARD_NOTE_RADIUS = 10;
const FRETBOARD_LABEL_FONT_SIZE = 10;
const FRETBOARD_CORNER_RADIUS = 14;
const FRETBOARD_NUT_WIDTH = 6;
const FRETBOARD_FRET_WIDTH = 2;

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

  const boardPaddingY = 30;
  const fretSpacing = 62;
  const stringSpacing = 28;
  const fretLabelOffset = 24;
  const spaceToStrings = 12;

  const boardWidth = visibleFretSpaces * fretSpacing;
  const boardHeight = Math.max(0, (stringCount - 1) * stringSpacing);
  const neckOverhang = fretSpacing * 0.4;
  const leftOverhang = startFret > 1 ? neckOverhang : 0;
  const rightOverhang = neckOverhang;
  const outerPaddingY = boardPaddingY - spaceToStrings;
  const baseMarginX = outerPaddingY;
  const neckLeftX = -leftOverhang;
  const neckTopY = -spaceToStrings;
  const neckWidth = boardWidth + leftOverhang + rightOverhang;
  const neckHeight = boardHeight + 2 * spaceToStrings;
  const neckPath = getRoundedRectPath({
    x: neckLeftX,
    y: neckTopY,
    width: neckWidth,
    height: neckHeight,
    radius: FRETBOARD_CORNER_RADIUS,
    roundLeft: startFret > 1,
    roundRight: true,
  });
  const stringStartX = startFret <= 1 ? -FRETBOARD_NUT_WIDTH / 2 : neckLeftX;

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
      number: rowIndex + 1,
    };
  });

  const neckClipId = `neck-clip-${useId()}`;

  const fretLineX = (physicalLine: number) => physicalLine * fretSpacing;
  const noteX = (actualFret: number) => {
    if (actualFret === 0) return -fretSpacing / 2;
    if (showOpenString) return actualFret * fretSpacing - fretSpacing / 2;
    return (actualFret - startFret + 1) * fretSpacing - fretSpacing / 2;
  };
  const openStringPaddingX = showOpenString
    ? fretSpacing / 2 + FRETBOARD_NOTE_RADIUS
    : 0;
  const nutMarginCompensationX = startFret === 1 ? FRETBOARD_NUT_WIDTH / 2 : 0;
  const translateX =
    baseMarginX + leftOverhang + openStringPaddingX + nutMarginCompensationX;
  const fretLineStrokeHalf =
    (startFret <= 1 ? FRETBOARD_NUT_WIDTH : FRETBOARD_FRET_WIDTH) / 2;
  const highestContentY = -spaceToStrings - fretLineStrokeHalf;
  const neckBottomContentY = boardHeight + spaceToStrings + fretLineStrokeHalf;
  const labelBottomContentY =
    boardHeight + fretLabelOffset + FRETBOARD_LABEL_FONT_SIZE / 2;
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
        </clipPath>
      </defs>
      <g transform={`translate(${translateX}, ${translateY})`}>
        <path
          d={neckPath}
          fill="rgba(120, 78, 43, 0.13)"
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
        </g>

        {stringRows.map((row) => {
          const y = row.y;

          return (
            <Fragment key={`string-${row.id}`}>
              <FretboardString
                key={row.id}
                xLeft={stringStartX}
                xRight={boardWidth + rightOverhang}
                y={y}
                gauge={row.gauge}
              />
            </Fragment>
          );
        })}

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

              const noteLabel =
                noteDisplayMode === 'interval'
                  ? (getIntervalLabelFromRoot(note, rootNote) ?? note)
                  : note;

              return (
                <FretboardNote
                  key={`${row.id}-${fret}`}
                  x={noteX(fret)}
                  y={y}
                  color={mergedProps.color}
                  label={noteDisplayMode === 'none' ? null : noteLabel}
                  opacity={mergedProps.opacity}
                />
              );
            },
          );
        })}

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
              y={boardHeight + fretLabelOffset}
              fret={actualFret}
            />
          );
        })}
      </g>
    </svg>
  );
}
