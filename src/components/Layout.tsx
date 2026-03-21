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
              {import.meta.env.PACKAGE_CONFIG_NAME}
            </span>
          </a>{' '}
          <small className={styles.headerSubtitle}>
            {import.meta.env.PACKAGE_CONFIG_DESCRIPTION}
          </small>
        </h1>
      </header>

      <main className={styles.main}>{props.children}</main>

      <footer>
        <p>
          Made by{' '}
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
      </footer>
    </div>
  );
}
