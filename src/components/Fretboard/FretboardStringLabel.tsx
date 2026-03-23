import {
  FRETBOARD_THEME_FONT_FAMILY,
  FRETBOARD_THEME_LABEL_COLOR,
  FRETBOARD_THEME_LABEL_FONT_SIZE,
  FRETBOARD_THEME_LABEL_FONT_WEIGHT,
} from './theme';

type FretboardStringLabelProps = {
  x: number;
  y: number;
  label: string;
};

export function FretboardStringLabel({
  x,
  y,
  label,
}: FretboardStringLabelProps) {
  return (
    <text
      x={x}
      y={y}
      fill={FRETBOARD_THEME_LABEL_COLOR}
      fontFamily={FRETBOARD_THEME_FONT_FAMILY}
      fontSize={FRETBOARD_THEME_LABEL_FONT_SIZE}
      fontWeight={FRETBOARD_THEME_LABEL_FONT_WEIGHT}
      textAnchor="middle"
      dominantBaseline="central"
      alignmentBaseline="central"
    >
      {label}
    </text>
  );
}
