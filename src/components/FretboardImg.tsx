import { useCallback, useEffect, useRef, useState } from 'react';
import { svgElementToFile } from '../lib/file.ts';
import { Fretboard, type FretboardProps } from './Fretboard/Fretboard.tsx';
import styles from './FretboardImg.module.scss';

export function FretboardImg(props: FretboardProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  const regenerateImgUrl = useCallback((svgElement: SVGSVGElement) => {
    const svgData = svgElementToFile(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    // @todo this is not working to make "Right click > Save image as..." have a filename :/
    // @todo if we manage to fix the above, make a more specific filename based on props, e.g. "fretboard-EADGBE-22frets.svg"
    const file = new File([blob], 'fretboard.svg', { type: 'image/svg+xml' });
    const objectUrl = URL.createObjectURL(file);

    // eslint-disable-next-line react-x/set-state-in-effect -- I don't think there's any way to do cleanup here without using `useEffect` + `setState`?
    setImgUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, []);

  // @todo React Refresh isn't triggering this `useEffect` so the image doesn't update on code edits
  useEffect(() => {
    if (!svgRef.current) return;
    return regenerateImgUrl(svgRef.current);
  }, [
    regenerateImgUrl,
    props.definition,
    props.tuning,
    props.startFret,
    props.endFret,
  ]);

  return (
    <>
      <div className={styles.hidden}>
        <Fretboard
          definition={props.definition}
          tuning={props.tuning}
          startFret={props.startFret}
          endFret={props.endFret}
          ref={svgRef}
        />
      </div>
      {imgUrl && (
        <img
          src={imgUrl}
          // @todo better alt based on props
          alt="Fretboard diagram"
          className={styles.image}
        />
      )}
    </>
  );
}
