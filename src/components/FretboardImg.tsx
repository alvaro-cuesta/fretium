import cx from 'classnames';
import { useCallback, useState } from 'react';
import type { Exact } from 'type-fest';
import { useImperativeAnimationFrame } from '../hooks/useImperativeAnimationFrame.ts';
import { useMutationObserverLifecycle } from '../hooks/useMutationObserverLifecycle.ts';
import { svgElementToFile } from '../lib/file.ts';
import {
  getFretboardDescription,
  getFretboardImageFilename,
} from '../lib/fretboard.ts';
import { Fretboard, type FretboardProps } from './Fretboard/Fretboard.tsx';
import styles from './FretboardImg.module.scss';

type FretboardImgProps = Omit<FretboardProps, 'ref'> &
  React.ImgHTMLAttributes<HTMLImageElement>;

type FretboardImgStyle = React.CSSProperties & {
  '--fretboard-string-scale'?: number;
};

export function FretboardImg(props: FretboardImgProps) {
  const {
    pattern,
    patternName,
    instrumentName,
    tuningName,
    tuning,
    startFret,
    endFret,
    showStringNames,
    noteDisplayMode,
    rootNote,
    className,
    style,
    ...imgProps
  } = props;

  imgProps satisfies Exact<
    React.ImgHTMLAttributes<HTMLImageElement>,
    typeof imgProps
  >;

  const description = getFretboardDescription({
    pattern,
    patternName,
    instrumentName,
    tuningName,
    tuning,
    startFret,
    endFret,
    showStringNames,
    noteDisplayMode,
    rootNote,
  });
  const filename = getFretboardImageFilename({
    pattern,
    patternName,
    instrumentName,
    tuningName,
    tuning,
    startFret,
    endFret,
    showStringNames,
    noteDisplayMode,
    rootNote,
  });

  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const animationFrame = useImperativeAnimationFrame();

  const regenerateImgUrl = useCallback(
    (svgElement: SVGSVGElement) => {
      const svgData = svgElementToFile(svgElement);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      // @todo this is not working to make "Right click > Save image as..." have a filename :/
      const file = new File([blob], filename, { type: 'image/svg+xml' });
      const objectUrl = URL.createObjectURL(file);

      setImgUrl(objectUrl);

      return () => {
        // Defer revocation to ensure the URL is not revoked before the actual DOM has changed
        // Without this, Firefox shows this error:
        // "Security Error: Content at http://localhost:5173/ may not load data from blob:http://localhost:5173/c0d6b05f-5b17-4539-ad92-ec2b5d03bf09."
        setTimeout(() => {
          URL.revokeObjectURL(objectUrl);
        }, 0);
      };
    },
    [filename],
  );

  // We have to use a MutationObserver here because during development any change to the code changed the SVG element
  // but did NOT rerun the surrounding code, so the image did not update until some unrelated state changed.
  //
  // Keeping this observer-based sync also handles manual DOM changes without extra React state plumbing.
  const mutationObserverRef = useMutationObserverLifecycle<SVGSVGElement>(
    // Coalesce attach, dependency, and mutation bursts into a single regeneration.
    (svgElement) => animationFrame.schedule(() => regenerateImgUrl(svgElement)),
    [animationFrame, regenerateImgUrl],
    {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    },
  );

  return (
    <>
      <div className={styles.hidden}>
        <Fretboard
          pattern={pattern}
          patternName={patternName}
          instrumentName={instrumentName}
          tuningName={tuningName}
          tuning={tuning}
          startFret={startFret}
          endFret={endFret}
          showStringNames={showStringNames}
          noteDisplayMode={noteDisplayMode}
          rootNote={rootNote}
          ref={mutationObserverRef}
        />
      </div>

      {imgUrl && (
        <img
          {...imgProps}
          src={imgUrl}
          alt={description}
          className={cx(styles.fretboardImg, className)}
          style={
            {
              '--fretboard-string-scale': tuning.length / 6,
              ...style,
            } as FretboardImgStyle
          }
        />
      )}
    </>
  );
}
