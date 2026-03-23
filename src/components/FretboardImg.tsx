import cx from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Exact } from 'type-fest';
import { useImperativeAnimationFrame } from '../hooks/useImperativeAnimationFrame.ts';
import { useMutationObserverLifecycle } from '../hooks/useMutationObserverLifecycle.ts';
import { SVG_CONTENT_TYPE } from '../lib/file.ts';
import {
  getFretboardDescription,
  getFretboardImageFilenameBase,
} from '../lib/fretboard.ts';
import { svgElementToFileContents } from '../lib/image.ts';
import { Fretboard, type FretboardProps } from './Fretboard/Fretboard.tsx';
import styles from './FretboardImg.module.scss';

export type ImgChangeEvent = {
  url: string;
  filenameBase: string;
};

type FretboardImgProps = Omit<FretboardProps, 'ref'> &
  React.ImgHTMLAttributes<HTMLImageElement> & {
    imgRef?: React.Ref<HTMLImageElement> | undefined;
    onImgChange?: ((event: ImgChangeEvent | null) => void) | undefined;
  };

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
    showBackgroundNeck,
    showStrings,
    showFretLines,
    showFretMarkers,
    showFretLabels,
    showStringLabels,
    showDropShadows,
    noteDisplayMode,
    rootNote,
    className,
    style,
    onImgChange,
    imgRef,
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
    showFretLabels,
    showStringLabels,
    noteDisplayMode,
    rootNote,
  });
  const filenameBase = getFretboardImageFilenameBase({
    pattern,
    patternName,
    instrumentName,
    tuningName,
    tuning,
    startFret,
    endFret,
    showFretLabels,
    showStringLabels,
    noteDisplayMode,
    rootNote,
  });

  const [imgData, setImgData] = useState<ImgChangeEvent | null>(null);
  const animationFrame = useImperativeAnimationFrame();
  const onImgChangeRef = useRef(onImgChange);

  useEffect(() => {
    onImgChangeRef.current = onImgChange;
  }, [onImgChange]);

  const regenerateImgUrl = useCallback(
    (svgElement: SVGSVGElement) => {
      const svgData = svgElementToFileContents(svgElement);
      const blob = new Blob([svgData], { type: SVG_CONTENT_TYPE });
      // @todo this is not working to make "Right click > Save image as..." have a filename :/
      const file = new File([blob], `${filenameBase}.svg`, {
        type: SVG_CONTENT_TYPE,
      });
      const objectUrl = URL.createObjectURL(file);

      setImgData({
        url: objectUrl,
        filenameBase,
      });

      return () => {
        // Defer revocation to ensure the URL is not revoked before the actual DOM has changed
        // Without this, Firefox shows this error:
        // "Security Error: Content at http://localhost:5173/ may not load data from blob:http://localhost:5173/c0d6b05f-5b17-4539-ad92-ec2b5d03bf09."
        setTimeout(() => {
          URL.revokeObjectURL(objectUrl);
        }, 0);
      };
    },
    [filenameBase],
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

  useEffect(() => {
    onImgChange?.(imgData);
  }, [imgData, onImgChange]);

  useEffect(() => {
    return () => {
      onImgChangeRef.current?.(null);
    };
  }, []);

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
          showBackgroundNeck={showBackgroundNeck}
          showStrings={showStrings}
          showFretLines={showFretLines}
          showFretMarkers={showFretMarkers}
          showFretLabels={showFretLabels}
          showStringLabels={showStringLabels}
          showDropShadows={showDropShadows}
          noteDisplayMode={noteDisplayMode}
          rootNote={rootNote}
          ref={mutationObserverRef}
        />
      </div>

      {imgData && (
        <img
          {...imgProps}
          ref={imgRef}
          src={imgData.url}
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
