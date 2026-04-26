import { useCallback, useEffect, useState } from 'react';
import { XIcon } from './FretboardPanel/icons.tsx';
import { setGlobalToastListener } from './global-toast.ts';
import styles from './GlobalToast.module.scss';

const AUTO_CLOSE_MS = 3000;

type Toast = { key: number; message: string; persistent: boolean };
let toastKey = 0;

export function GlobalToast() {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((message: string, persistent?: boolean) => {
    setToast({ key: ++toastKey, message, persistent: persistent ?? false });
  }, []);

  useEffect(() => {
    setGlobalToastListener(showToast);
    return () => {
      setGlobalToastListener(null);
    };
  }, [showToast]);

  // Auto-dismiss non-persistent toasts
  useEffect(() => {
    if (!toast || toast.persistent) return;
    const id = setTimeout(() => {
      setToast(null);
    }, AUTO_CLOSE_MS);
    return () => {
      clearTimeout(id);
    };
  }, [toast]);

  if (!toast) return null;

  return (
    <div
      key={toast.key}
      className={styles.toast}
      role="status"
      onClick={() => {
        setToast(null);
      }}
    >
      <span>{toast.message}</span>
      <XIcon className={styles.closeIcon} />
    </div>
  );
}
