import {
  FRETBOARD_THEME_FONT_FAMILY,
  FRETBOARD_THEME_NOTE_COLORS,
  type FretboardNoteColor,
} from './theme';

type FretboardNoteProps = {
  x: number;
  y: number;
  color: FretboardNoteColor;
  label: string | null;
  opacity?: number | undefined;
};

export function FretboardNote(props: FretboardNoteProps) {
  return (
    <g
      transform={`translate(${props.x}, ${props.y})`}
      opacity={props.opacity}
    >
      <circle
        r={10}
        fill={FRETBOARD_THEME_NOTE_COLORS[props.color]}
        opacity={0.95}
      />
      {props.label !== null && (
        <text
          x={0}
          y={0}
          fill="#fff"
          fontFamily={FRETBOARD_THEME_FONT_FAMILY}
          fontSize={9.5}
          fontWeight={700}
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
