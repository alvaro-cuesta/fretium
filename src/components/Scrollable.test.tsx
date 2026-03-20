import { fireEvent, render, waitFor } from '@testing-library/react';
import { Scrollable } from './Scrollable';
import styles from './Scrollable.module.scss';

test('shows scroll gradients only while more content remains off-screen', async () => {
  const { container } = render(
    <Scrollable>
      <div style={{ width: 480 }}>Mock content</div>
    </Scrollable>,
  );
  const viewport = container.querySelector(`.${styles.root}`);
  const scroller = container.querySelector(`.${styles.scroller}`);

  expect(viewport).not.toBeNull();
  expect(scroller).not.toBeNull();

  if (!viewport || !scroller) {
    throw new Error('Expected the scrollable viewport and scroller to render.');
  }

  Object.defineProperties(scroller, {
    clientWidth: {
      configurable: true,
      value: 240,
    },
    scrollLeft: {
      configurable: true,
      writable: true,
      value: 0,
    },
    scrollWidth: {
      configurable: true,
      value: 480,
    },
  });

  fireEvent(window, new Event('resize'));

  await waitFor(() => {
    expect(viewport.classList.contains(styles.fadeLeft)).toBe(false);
    expect(viewport.classList.contains(styles.fadeRight)).toBe(true);
  });

  scroller.scrollLeft = 120;
  fireEvent.scroll(scroller);

  expect(viewport.classList.contains(styles.fadeLeft)).toBe(true);
  expect(viewport.classList.contains(styles.fadeRight)).toBe(true);

  scroller.scrollLeft = 240;
  fireEvent.scroll(scroller);

  expect(viewport.classList.contains(styles.fadeLeft)).toBe(true);
  expect(viewport.classList.contains(styles.fadeRight)).toBe(false);

  Object.defineProperty(scroller, 'scrollWidth', {
    configurable: true,
    value: 240,
  });
  scroller.scrollLeft = 0;
  fireEvent(window, new Event('resize'));

  await waitFor(() => {
    expect(viewport.classList.contains(styles.fadeLeft)).toBe(false);
    expect(viewport.classList.contains(styles.fadeRight)).toBe(false);
  });
});
