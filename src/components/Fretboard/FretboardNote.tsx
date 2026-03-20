import { FRETBOARD_THEME_FONT_FAMILY } from './theme';

type FretboardNoteProps = {
  x: number;
  y: number;
  color: string;
  note: string;
};

export function FretboardNote(props: FretboardNoteProps) {
  return (
    <g transform={`translate(${props.x}, ${props.y})`}>
      <circle
        r={10}
        fill={props.color}
        opacity={0.95}
      />
      <text
        fill="#fff"
        fontFamily={FRETBOARD_THEME_FONT_FAMILY}
        fontSize={9.5}
        fontWeight={700}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {props.note}
      </text>
    </g>
  );
}
