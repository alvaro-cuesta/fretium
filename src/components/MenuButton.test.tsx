import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MenuButton } from './MenuButton';

function renderSubject() {
  render(
    <>
      <MenuButton
        ariaLabel="Example menu"
        transitionMs={0}
        renderMenu={({ closeMenu, menuItemClassName }) => (
          <>
            <button
              type="button"
              role="menuitem"
              className={menuItemClassName}
              onClick={closeMenu}
            >
              First action
            </button>
            <button
              type="button"
              role="menuitem"
              className={menuItemClassName}
            >
              Second action
            </button>
          </>
        )}
      >
        {({ isOpen }) => <span>{isOpen ? 'Close' : 'Open'}</span>}
      </MenuButton>

      <button type="button">Outside</button>
    </>,
  );

  return {
    toggleButton: screen.getByRole('button', { name: 'Example menu' }),
    getFirstMenuItem: () =>
      screen.getByRole('menuitem', { name: 'First action' }),
    getLastMenuItem: () =>
      screen.getByRole('menuitem', { name: 'Second action' }),
    outsideButton: screen.getByRole('button', { name: 'Outside' }),
  };
}

test('moves focus to the first menu item when opened with ArrowDown', async () => {
  const { toggleButton, getFirstMenuItem } = renderSubject();

  toggleButton.focus();
  fireEvent.keyDown(toggleButton, { key: 'ArrowDown' });

  await waitFor(() => {
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    expect(getFirstMenuItem()).toHaveFocus();
  });
});

test('moves focus to the last menu item when opened with ArrowUp', async () => {
  const { toggleButton, getLastMenuItem } = renderSubject();

  toggleButton.focus();
  fireEvent.keyDown(toggleButton, { key: 'ArrowUp' });

  await waitFor(() => {
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    expect(getLastMenuItem()).toHaveFocus();
  });
});

test('keeps focus on the trigger when opened with pointer input', async () => {
  const { toggleButton } = renderSubject();

  toggleButton.focus();
  fireEvent.pointerDown(toggleButton);
  fireEvent.click(toggleButton);

  await waitFor(() => {
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
  });

  expect(toggleButton).toHaveFocus();
});

test('returns focus to the trigger when Escape closes the menu', async () => {
  const { toggleButton, getFirstMenuItem } = renderSubject();

  toggleButton.focus();
  fireEvent.keyDown(toggleButton, { key: 'ArrowDown' });

  await waitFor(() => {
    expect(getFirstMenuItem()).toHaveFocus();
  });

  fireEvent.keyDown(getFirstMenuItem(), { key: 'Escape' });

  await waitFor(() => {
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(toggleButton).toHaveFocus();
  });
});

test('closes the menu when focus leaves the widget', async () => {
  const { toggleButton, getFirstMenuItem, outsideButton } = renderSubject();

  toggleButton.focus();
  fireEvent.keyDown(toggleButton, { key: 'ArrowDown' });

  await waitFor(() => {
    expect(getFirstMenuItem()).toHaveFocus();
  });

  fireEvent.blur(getFirstMenuItem(), { relatedTarget: outsideButton });
  fireEvent.focus(outsideButton);

  await waitFor(() => {
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  });
});
