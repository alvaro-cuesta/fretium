import styles from './Layout.module.scss';

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout(props: LayoutProps) {
  return (
    <div className={styles.root}>
      <header>
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
            </span>
          </a>{' '}
          <small className={styles.headerSubtitle}>
            {import.meta.env.PACKAGE_CONFIG_SHORT_DESCRIPTION}
          </small>
        </h1>
      </header>

      <main className={styles.main}>{props.children}</main>

      <footer className={styles.footer}>
        <p>
          Made with ❤️ by{' '}
          <a
            href={import.meta.env.PACKAGE_AUTHOR.url}
            target="_blank"
            rel="noreferrer"
          >
            {import.meta.env.PACKAGE_AUTHOR.name}
          </a>
          . Source code on{' '}
          <a
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
