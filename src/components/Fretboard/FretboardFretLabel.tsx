import { FRETBOARD_THEME_FONT_FAMILY } from './theme';

type FretboardFretLabelProps = {
  x: number;
  y: number;
  fret: number;
};

export function FretboardFretLabel(props: FretboardFretLabelProps) {
  return (
    <text
      x={props.x}
      y={props.y}
      fill="rgba(192, 192, 192, 1)"
      fontFamily={FRETBOARD_THEME_FONT_FAMILY}
      fontSize={10}
      fontWeight={700}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {props.fret}
    </text>
  );
}
