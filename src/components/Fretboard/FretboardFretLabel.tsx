import {
  FRETBOARD_THEME_FONT_FAMILY,
  FRETBOARD_THEME_LABEL_COLOR,
  FRETBOARD_THEME_LABEL_FONT_SIZE,
  FRETBOARD_THEME_LABEL_FONT_WEIGHT,
} from './theme';

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
      fill={FRETBOARD_THEME_LABEL_COLOR}
      fontFamily={FRETBOARD_THEME_FONT_FAMILY}
      fontSize={FRETBOARD_THEME_LABEL_FONT_SIZE}
      fontWeight={FRETBOARD_THEME_LABEL_FONT_WEIGHT}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {props.fret}
    </text>
  );
}
