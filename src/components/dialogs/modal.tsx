import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import styles from './dialog.module.css';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

/** Native <dialog>, so focus trapping and Escape handling come from the browser. */
export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!isOpen) {
      dialogRef.current?.close();
      return;
    }
    dialogRef.current?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onCancel={onClose}
      onClick={(event) => {
        const clickedBackdrop = event.target === event.currentTarget;
        if (clickedBackdrop) onClose();
      }}
    >
      <div className={styles.dialogContent}>
        <button
          className={styles.dialogClose}
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </dialog>
  );
}
