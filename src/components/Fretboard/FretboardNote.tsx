import {
  FRETBOARD_THEME_FONT_FAMILY,
  FRETBOARD_THEME_NOTE_COLORS,
  FRETBOARD_THEME_NOTE_FONT_SIZE,
  FRETBOARD_THEME_NOTE_FONT_WEIGHT,
  FRETBOARD_THEME_NOTE_RADIUS,
  type FretboardNoteColorName,
} from './theme';

type FretboardNoteProps = {
  x: number;
  y?: number | undefined;
  color: FretboardNoteColorName;
  label: string | null;
  opacity?: number | undefined;
};

export function FretboardNote({
  x,
  y = 0,
  color: colorName,
  label,
  opacity = 1,
}: FretboardNoteProps) {
  const color = FRETBOARD_THEME_NOTE_COLORS[colorName];

  return (
    <g
      transform={`translate(${x}, ${y})`}
      opacity={opacity}
    >
      <circle
        r={FRETBOARD_THEME_NOTE_RADIUS}
        fill={color.background}
      />
      {label !== null && (
        <text
          x={0}
          y={0}
          fill={color.text}
          fontFamily={FRETBOARD_THEME_FONT_FAMILY}
          fontSize={FRETBOARD_THEME_NOTE_FONT_SIZE}
          fontWeight={FRETBOARD_THEME_NOTE_FONT_WEIGHT}
          textAnchor="middle"
          dominantBaseline="central"
          alignmentBaseline="central"
        >
          {label}
        </text>
      )}
    </g>
  );
}
