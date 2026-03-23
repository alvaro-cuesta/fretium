import cx from 'classnames';
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { useDismiss } from '../hooks/useDismiss.ts';
import { useImperativeAnimationFrame } from '../hooks/useImperativeAnimationFrame.ts';
import { useImperativeTimeout } from '../hooks/useImperativeTimeout.ts';
import globalStyles from '../index.module.scss';
import styles from './MenuButton.module.scss';

type MenuButtonRenderChildrenProps = {
  isOpen: boolean;
};

type MenuButtonRenderMenuProps = {
  closeMenu: () => void;
  menuItemClassName: string;
};

type MenuButtonProps = {
  ariaLabel: string;
  children: (renderProps: MenuButtonRenderChildrenProps) => ReactNode;
  renderMenu: (renderProps: MenuButtonRenderMenuProps) => ReactNode;
  className?: string;
  buttonClassName?: string;
  transitionMs: number;
};

export function MenuButton({
  ariaLabel,
  children,
  renderMenu,
  className,
  buttonClassName,
  transitionMs,
}: MenuButtonProps) {
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Keep animation timing separate from open state so the menu can transition cleanly
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const openAnimationFrame = useImperativeAnimationFrame();
  const closeTimeout = useImperativeTimeout();
  useEffect(() => {
    return isOpen
      ? openAnimationFrame.schedule(() => {
          setIsExpanded(true);
        })
      : closeTimeout.schedule(() => {
          setIsExpanded(false);
        }, transitionMs);
  }, [closeTimeout, isOpen, openAnimationFrame, transitionMs]);

  // Dismiss the open menu when the user clicks outside it or presses Escape
  useDismiss(
    menuRef,
    () => {
      setIsOpen(false);
    },
    isOpen,
  );

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={cx(styles.menuButton, className)}
      ref={menuRef}
      style={
        {
          '--menu-button-transition-ms': `${transitionMs}ms`,
        } as CSSProperties
      }
    >
      <div
        id={menuId}
        role="menu"
        aria-label={ariaLabel}
        aria-hidden={!isOpen}
        className={cx(styles.menuList, isOpen && styles.menuListOpen)}
      >
        <div className={styles.menuListInner}>
          {renderMenu({
            closeMenu,
            menuItemClassName: styles.menuItem,
          })}
        </div>
      </div>

      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-expanded={isOpen}
        className={cx(
          globalStyles.linkButton,
          styles.button,
          styles.buttonToggle,
          isExpanded && styles.buttonExpanded,
          buttonClassName,
        )}
        onClick={() => {
          setIsOpen((isMenuOpen) => !isMenuOpen);
        }}
      >
        {children({ isOpen })}
      </button>
    </div>
  );
}
