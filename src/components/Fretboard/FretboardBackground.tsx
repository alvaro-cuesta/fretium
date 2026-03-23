import { FRETBOARD_THEME_BACKGROUND_COLOR } from './theme';

type FretboardBackgroundProps = {
  width: number;
  height: number;
};

export function FretboardBackground({
  width,
  height,
}: FretboardBackgroundProps) {
  return (
    <rect
      x={0}
      y={0}
      width={width}
      height={height}
      fill={FRETBOARD_THEME_BACKGROUND_COLOR}
    />
  );
}
