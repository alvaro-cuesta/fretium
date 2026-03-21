import cx from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Scrollable.module.scss';

type ScrollCueState = {
  left: boolean;
  right: boolean;
  scrollbarBlockSize: number;
  scrollbarInlineSize: number;
};

type ScrollableProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
};

export function Scrollable({
  children,
  className,
  style,
  ...props
}: ScrollableProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollCue, setScrollCue] = useState<ScrollCueState>({
    left: false,
    right: false,
    scrollbarBlockSize: 0,
    scrollbarInlineSize: 0,
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
    const scrollbarBlockSize = Math.max(
      0,
      scrollerElement.offsetHeight - scrollerElement.clientHeight,
    );
    const scrollbarInlineSize = Math.max(
      0,
      scrollerElement.offsetWidth - scrollerElement.clientWidth,
    );
    const nextScrollCue = {
      left: scrollerElement.scrollLeft > overflowTolerance,
      right: maxScrollLeft - scrollerElement.scrollLeft > overflowTolerance,
      scrollbarBlockSize,
      scrollbarInlineSize,
    };

    setScrollCue((previousCue) => {
      if (
        previousCue.left === nextScrollCue.left &&
        previousCue.right === nextScrollCue.right &&
        previousCue.scrollbarBlockSize === nextScrollCue.scrollbarBlockSize &&
        previousCue.scrollbarInlineSize === nextScrollCue.scrollbarInlineSize
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
      style={
        {
          ...(style ?? {}),
          '--scrollbar-block-size': `${scrollCue.scrollbarBlockSize}px`,
          '--scrollbar-inline-size': `${scrollCue.scrollbarInlineSize}px`,
        } as React.CSSProperties
      }
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
