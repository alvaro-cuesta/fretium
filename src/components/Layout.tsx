import { useEffect } from 'react';
import globalStyles from '../index.module.scss';
import { initPwa } from '../pwa.ts';
import { ErrorBoundary } from './ErrorBoundary.tsx';
import { showGlobalToast } from './global-toast.ts';
import { GlobalToast } from './GlobalToast.tsx';
import styles from './Layout.module.scss';

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout(props: LayoutProps) {
  useEffect(() => {
    initPwa(showGlobalToast);
  }, []);

  return (
    <div className={styles.root}>
      <GlobalToast />
      <header className={styles.header}>
        <h1>
          <a
            href={import.meta.env.PACKAGE_HOMEPAGE}
            className={styles.headerLink}
          >
            <img
              src="/favicon.svg"
              className={styles.headerLogo}
              aria-hidden="true"
            />
            <span className={styles.headerTitle}>
              {import.meta.env.PACKAGE_CONFIG_SHORT_NAME}
            </span>{' '}
            <small className={styles.headerSubtitle}>
              {import.meta.env.PACKAGE_CONFIG_SHORT_DESCRIPTION}
            </small>
          </a>
        </h1>
      </header>

      <main className={styles.main}>
        <ErrorBoundary>{props.children}</ErrorBoundary>
      </main>

      <footer className={styles.footer}>
        <p>
          Made with{' '}
          <span
            role="img"
            aria-label="love"
          >
            ❤️
          </span>{' '}
          by{' '}
          <a
            className={globalStyles.printLink}
            href={import.meta.env.PACKAGE_AUTHOR.url}
            target="_blank"
            rel="noreferrer"
          >
            {import.meta.env.PACKAGE_AUTHOR.name}
          </a>
          . Source code on{' '}
          <a
            className={globalStyles.printLink}
            href={import.meta.env.PACKAGE_CONFIG_REPOSITORY_URL}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          .
        </p>
        <p>
          <a
            className={globalStyles.printLink}
            href={import.meta.env.PACKAGE_BUGS}
            target="_blank"
            rel="noreferrer"
          >
            Suggestions and feedback
          </a>{' '}
          are welcome!
        </p>
        <p className={styles.version}>
          (Version {import.meta.env.GIT_COMMIT_SHORT_SHA})
        </p>
      </footer>
    </div>
  );
}
