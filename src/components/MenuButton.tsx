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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuListRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const focusTargetOnOpenRef = useRef<'first' | 'last' | null>(null);

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
    containerRef,
    () => {
      setIsOpen(false);
    },
    isOpen,
  );

  useEffect(() => {
    if (!isOpen || !focusTargetOnOpenRef.current) {
      return;
    }

    return openAnimationFrame.schedule(() => {
      const focusTargetOnOpen = focusTargetOnOpenRef.current;
      const menuItems = Array.from(
        menuListRef.current?.querySelectorAll<HTMLElement>(
          '[role="menuitem"]',
        ) ?? [],
      );

      focusTargetOnOpenRef.current = null;

      if (menuItems.length === 0) {
        return;
      }

      const targetIndex = menuItems.length - 1;
      const menuItemToFocus =
        focusTargetOnOpen === 'last' ? menuItems[targetIndex] : menuItems[0];

      menuItemToFocus?.focus();
    });
  }, [isOpen, openAnimationFrame]);

  const closeMenu = () => {
    setIsOpen(false);
  };

  const closeMenuAndFocusButton = () => {
    closeMenu();
    buttonRef.current?.focus();
  };

  return (
    <div
      className={cx(styles.menuButton, className)}
      ref={containerRef}
      style={
        {
          '--menu-button-transition-ms': `${transitionMs}ms`,
        } as CSSProperties
      }
      onBlurCapture={(event) => {
        if (
          !isOpen ||
          (event.relatedTarget instanceof Node &&
            containerRef.current?.contains(event.relatedTarget))
        ) {
          return;
        }

        closeMenu();
      }}
      onKeyDownCapture={(event) => {
        if (!isOpen || event.key !== 'Escape') {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        closeMenuAndFocusButton();
      }}
    >
      <div
        id={menuId}
        role="menu"
        aria-label={ariaLabel}
        aria-hidden={!isOpen}
        className={cx(styles.menuList, isOpen && styles.menuListOpen)}
        ref={menuListRef}
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
        ref={buttonRef}
        className={cx(
          globalStyles.linkButton,
          styles.button,
          styles.buttonToggle,
          (isOpen || isExpanded) && styles.buttonExpanded,
          buttonClassName,
        )}
        onPointerDown={() => {
          focusTargetOnOpenRef.current = null;
        }}
        onKeyDown={(event) => {
          switch (event.key) {
            case 'ArrowDown': {
              event.preventDefault();
              focusTargetOnOpenRef.current = 'first';
              setIsOpen(true);
              return;
            }

            case 'ArrowUp': {
              event.preventDefault();
              focusTargetOnOpenRef.current = 'last';
              setIsOpen(true);
              return;
            }

            case 'Enter':
            case ' ': {
              if (!isOpen) {
                focusTargetOnOpenRef.current = 'first';
              }

              return;
            }

            default: {
              return;
            }
          }
        }}
        onClick={() => {
          setIsOpen((isMenuOpen) => !isMenuOpen);
        }}
      >
        {children({ isOpen })}
      </button>
    </div>
  );
}
