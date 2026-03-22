import { fireEvent, render, waitFor } from '@testing-library/react';
import { Scrollable } from './Scrollable';
import styles from './Scrollable.module.scss';

test('shows scroll gradients only while more content remains off-screen', async () => {
  const { container } = render(
    <Scrollable>
      <div style={{ width: 480 }}>Mock content</div>
    </Scrollable>,
  );
  const viewport = container.querySelector<HTMLElement>(`.${styles.root}`);
  const scroller = container.querySelector<HTMLDivElement>(
    `.${styles.scroller}`,
  );

  expect(viewport).toBeInTheDocument();
  expect(scroller).toBeInTheDocument();

  if (!viewport || !scroller) {
    throw new Error('Expected the scrollable viewport and scroller to render.');
  }

  Object.defineProperties(scroller, {
    clientWidth: {
      configurable: true,
      value: 240,
    },
    clientHeight: {
      configurable: true,
      value: 90,
    },
    offsetWidth: {
      configurable: true,
      value: 252,
    },
    offsetHeight: {
      configurable: true,
      value: 102,
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
    expect(viewport).not.toHaveClass(styles.fadeLeft);
    expect(viewport).toHaveClass(styles.fadeRight);
    expect(viewport).toHaveStyle({
      '--scrollbar-block-size': '12px',
      '--scrollbar-inline-size': '12px',
    });
  });

  scroller.scrollLeft = 120;
  fireEvent.scroll(scroller);

  expect(viewport).toHaveClass(styles.fadeLeft);
  expect(viewport).toHaveClass(styles.fadeRight);

  scroller.scrollLeft = 240;
  fireEvent.scroll(scroller);

  expect(viewport).toHaveClass(styles.fadeLeft);
  expect(viewport).not.toHaveClass(styles.fadeRight);

  Object.defineProperty(scroller, 'scrollWidth', {
    configurable: true,
    value: 240,
  });
  scroller.scrollLeft = 0;
  fireEvent(window, new Event('resize'));

  await waitFor(() => {
    expect(viewport).not.toHaveClass(styles.fadeLeft);
    expect(viewport).not.toHaveClass(styles.fadeRight);
  });
});
