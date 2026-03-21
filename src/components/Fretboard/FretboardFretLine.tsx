import {
  FRETBOARD_THEME_FRET_COLOR,
  FRETBOARD_THEME_FRET_WIDTH,
  FRETBOARD_THEME_NUT_COLOR,
  FRETBOARD_THEME_NUT_WIDTH,
} from './theme';

type FretboardFretLineProps = {
  x: number;
  yTop: number;
  yBottom: number;
  isNut: boolean;
};

export function FretboardFretLine(props: FretboardFretLineProps) {
  return (
    <line
      x1={props.x}
      x2={props.x}
      y1={props.yTop}
      y2={props.yBottom}
      stroke={
        props.isNut ? FRETBOARD_THEME_NUT_COLOR : FRETBOARD_THEME_FRET_COLOR
      }
      strokeWidth={
        props.isNut ? FRETBOARD_THEME_NUT_WIDTH : FRETBOARD_THEME_FRET_WIDTH
      }
    />
  );
}
