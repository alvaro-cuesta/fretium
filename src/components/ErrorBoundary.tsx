import cx from 'classnames';
import {
  Component,
  type ErrorInfo,
  type ReactNode,
  useCallback,
  useState,
} from 'react';
import { useTimeout } from '../hooks/useTimeout.ts';
import styles from './ErrorBoundary.module.scss';

const COPY_SUCCESS_DURATION_MS = 3000;

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: unknown;
};

type CopyState = 'idle' | 'success' | 'error';

function summarizeError(error: unknown) {
  if (error instanceof Error) {
    const name = error.name.trim() || 'Error';
    const message = error.message.trim() || '(no error message)';

    const indentedStack = error.stack
      ? error.stack
          .trim()
          .split('\n')
          .map((line) => `  ${line}`)
          .join('\n')
      : '  (no stack trace available)';

    return `${name}: ${message}\nStack trace:\n${indentedStack}`;
  }

  return String(error);
}

const COPY_PAYLOAD_PREFIX = 'Fretium error report';
const COPY_PAYLOAD_SEPARATOR = '='.repeat(COPY_PAYLOAD_PREFIX.length);

function ErrorBoundaryContent({ error }: { error: unknown }) {
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const resetCopyState = useTimeout();

  const issueUrl = import.meta.env.PACKAGE_BUGS;
  const errorSummary = summarizeError(error);
  const copyPayload = `${COPY_PAYLOAD_PREFIX}\n${COPY_PAYLOAD_SEPARATOR}\nIssue tracker: ${issueUrl}\n\n${errorSummary}`;
  const copyUnavailable = !('clipboard' in navigator);
  const copyButtonLabel =
    copyState === 'success' ? 'Copied to clipboard!' : 'Copy details';

  const copyErrorDetails = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(copyPayload);
      setCopyState('success');
      resetCopyState.schedule(() => {
        setCopyState('idle');
      }, COPY_SUCCESS_DURATION_MS);
    } catch {
      setCopyState('error');
    }
  }, [copyPayload, resetCopyState]);

  return (
    <section
      role="alert"
      className={styles.root}
    >
      <h2 className={styles.heading}>
        <p>This part of the page failed to load 😢</p>
        <p>
          Please report this issue at our{' '}
          <a
            href={issueUrl}
            target="_blank"
            rel="noreferrer"
          >
            issue tracker
          </a>
          !
        </p>
      </h2>

      <p className={styles.instructions}>
        Include these <strong>error details</strong> in the issue description,
        along with <strong>any relevant information</strong> about what you were
        doing when the error occurred and your environment (browser, OS, etc.).
      </p>
      <div className={styles.actions}>
        {!copyUnavailable && (
          <button
            type="button"
            onClick={() => {
              void copyErrorDetails();
            }}
            className={cx({
              [styles.copyDetailsButtonSuccess]: copyState === 'success',
            })}
          >
            <span aria-hidden="true">📋</span>{' '}
            <span
              aria-live="polite"
              aria-atomic="true"
            >
              {copyButtonLabel}
            </span>
          </button>
        )}
        <p className={styles.copyStatus}>
          {copyState === 'error' &&
            'Could not copy automatically. Please select and copy the details below.'}
          {copyUnavailable &&
            'Clipboard access is unavailable in this environment. Please copy manually.'}
        </p>
      </div>
      <pre className={styles.errorSummary}>{errorSummary}</pre>
    </section>
  );
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  declare state: ErrorBoundaryState;

  public constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  public static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error };
  }

  public override componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    console.error('Unhandled React error', error, errorInfo);
  }

  public override render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return <ErrorBoundaryContent error={this.state.error} />;
  }
}
