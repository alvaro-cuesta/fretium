import cx from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Scrollable.module.scss';

type ScrollCueState = {
  left: boolean;
  right: boolean;
};

type ScrollableProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
};

export function Scrollable({ children, className, ...props }: ScrollableProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollCue, setScrollCue] = useState<ScrollCueState>({
    left: false,
    right: false,
  });

  const syncScrollCue = useCallback(() => {
    const scrollerElement = scrollerRef.current;
    if (!scrollerElement) {
      return;
    }

    const overflowTolerance = 1;
    const maxScrollLeft = Math.max(
      0,
      scrollerElement.scrollWidth - scrollerElement.clientWidth,
    );
    const nextScrollCue = {
      left: scrollerElement.scrollLeft > overflowTolerance,
      right: maxScrollLeft - scrollerElement.scrollLeft > overflowTolerance,
    };

    setScrollCue((previousCue) => {
      if (
        previousCue.left === nextScrollCue.left &&
        previousCue.right === nextScrollCue.right
      ) {
        return previousCue;
      }

      return nextScrollCue;
    });
  }, []);

  useEffect(() => {
    const scrollerElement = scrollerRef.current;
    const contentElement = contentRef.current;
    if (!scrollerElement || !contentElement) {
      return;
    }

    const frameId = requestAnimationFrame(syncScrollCue);

    scrollerElement.addEventListener('scroll', syncScrollCue, {
      passive: true,
    });
    window.addEventListener('resize', syncScrollCue);

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(syncScrollCue);

    resizeObserver?.observe(scrollerElement);
    resizeObserver?.observe(contentElement);

    return () => {
      cancelAnimationFrame(frameId);
      scrollerElement.removeEventListener('scroll', syncScrollCue);
      window.removeEventListener('resize', syncScrollCue);
      resizeObserver?.disconnect();
    };
  }, [syncScrollCue]);

  return (
    <div
      className={cx(
        styles.root,
        {
          [styles.fadeLeft]: scrollCue.left,
          [styles.fadeRight]: scrollCue.right,
        },
        className,
      )}
      {...props}
    >
      <div
        ref={scrollerRef}
        className={styles.scroller}
      >
        <div
          ref={contentRef}
          className={styles.content}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
