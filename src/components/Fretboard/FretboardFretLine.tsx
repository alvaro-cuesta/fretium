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
      stroke={props.isNut ? '#5a4535' : '#8a735f'}
      strokeWidth={props.isNut ? 6 : 2}
    />
  );
}
