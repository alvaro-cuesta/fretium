type FretboardMarkerCircleProps = {
  x: number;
  y: number;
};

export function FretboardMarkerCircle(props: FretboardMarkerCircleProps) {
  return (
    <circle
      cx={props.x}
      cy={props.y}
      r={4.5}
      // fill="rgba(45, 45, 45, 0.4)"
      fill="rgba(192, 192, 192, 1)"
    />
  );
}
