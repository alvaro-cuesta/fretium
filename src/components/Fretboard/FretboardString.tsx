type FreboardStringProps = {
  xLeft: number;
  xRight: number;
  y: number;
  gauge: number;
};

export function FretboardString(props: FreboardStringProps) {
  return (
    <line
      x1={props.xLeft}
      x2={props.xRight}
      y1={props.y}
      y2={props.y}
      stroke="#6f7f8f"
      strokeWidth={props.gauge}
    />
  );
}
