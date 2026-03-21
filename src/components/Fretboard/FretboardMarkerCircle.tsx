import {
  FRETBOARD_THEME_MARKER_COLOR,
  FRETBOARD_THEME_MARKER_RADIUS,
} from './theme';

type FretboardMarkerCircleProps = {
  x: number;
  y: number;
};

export function FretboardMarkerCircle(props: FretboardMarkerCircleProps) {
  return (
    <circle
      cx={props.x}
      cy={props.y}
      r={FRETBOARD_THEME_MARKER_RADIUS}
      fill={FRETBOARD_THEME_MARKER_COLOR}
    />
  );
}
