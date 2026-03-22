import { FRETBOARD_THEME_STRING_COLOR } from './theme';

type FreboardStringProps = {
  xLeft: number;
  xRight: number;
  y?: number | undefined;
  gauge: number;
  shadowFilterId?: string | undefined;
};

export function FretboardString({
  xLeft,
  xRight,
  y = 0,
  gauge,
  shadowFilterId,
}: FreboardStringProps) {
  return (
    <line
      x1={xLeft}
      x2={xRight}
      y1={y}
      y2={y}
      stroke={FRETBOARD_THEME_STRING_COLOR}
      strokeWidth={gauge}
      filter={shadowFilterId ? `url(#${shadowFilterId})` : undefined}
    />
  );
}
