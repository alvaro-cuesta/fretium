import { useEffect, useRef } from 'react';
import globalStyles from '../index.module.scss';
import styles from './ConfirmDialog.module.scss';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  body?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  // Sync `open` prop with the native dialog's imperative open/close. This keeps
  // the backdrop, focus trap, and <form method="dialog"> semantics from the
  // browser rather than reimplementing them.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Native `close` event fires on Escape / backdrop-close as well as programmatic
  // .close(). Translate those into onCancel so the parent's `open` state stays
  // in sync with the dialog's actual visibility.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      if (open) onCancel();
    };

    dialog.addEventListener('close', handleClose);
    return () => {
      dialog.removeEventListener('close', handleClose);
    };
  }, [open, onCancel]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={`${styles.title}-label`}
    >
      <div className={styles.content}>
        <h2
          id={`${styles.title}-label`}
          className={styles.title}
        >
          {title}
        </h2>
        {body !== undefined && <div className={styles.body}>{body}</div>}
        <div className={styles.actions}>
          <button
            type="button"
            className={globalStyles.linkButton}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`${globalStyles.linkButton} ${styles.confirmButton}`}
            onClick={onConfirm}
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
