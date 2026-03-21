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
  y: number;
  color: FretboardNoteColorName;
  label: string | null;
  opacity?: number | undefined;
};

export function FretboardNote(props: FretboardNoteProps) {
  const color = FRETBOARD_THEME_NOTE_COLORS[props.color];

  return (
    <g
      transform={`translate(${props.x}, ${props.y})`}
      opacity={props.opacity}
    >
      <circle
        r={FRETBOARD_THEME_NOTE_RADIUS}
        fill={color.background}
      />
      {props.label !== null && (
        <text
          fill={color.text}
          fontFamily={FRETBOARD_THEME_FONT_FAMILY}
          fontSize={FRETBOARD_THEME_NOTE_FONT_SIZE}
          fontWeight={FRETBOARD_THEME_NOTE_FONT_WEIGHT}
          textAnchor="middle"
          dominantBaseline="central"
          alignmentBaseline="central"
        >
          {props.label}
        </text>
      )}
    </g>
  );
}
