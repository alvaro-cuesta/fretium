import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactElement } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

function ThrowingChild(): ReactElement {
  throw new Error('Boom');
}

describe('ErrorBoundary', () => {
  test('renders detailed fallback for content failures', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    expect(
      screen.getByRole('heading', {
        name: /This part of the page failed to load/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Include these/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'issue tracker' })).toHaveAttribute(
      'href',
      import.meta.env.PACKAGE_BUGS,
    );
    expect(screen.queryByRole('main')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Copy details' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/Clipboard access is unavailable in this environment/i),
    ).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  test('renders the same fallback for root-level failures', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    expect(
      screen.getByRole('heading', {
        name: /This part of the page failed to load/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'issue tracker' })).toHaveAttribute(
      'href',
      import.meta.env.PACKAGE_BUGS,
    );

    consoleErrorSpy.mockRestore();
  });

  test('copies error details to clipboard', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const writeText = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText,
      },
    });

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Copy details' }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledTimes(1);
    });

    expect(
      screen.getByRole('button', { name: 'Copied to clipboard!' }),
    ).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
