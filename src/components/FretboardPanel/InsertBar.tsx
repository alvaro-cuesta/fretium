import cx from 'classnames';
import globalStyles from '../../index.module.scss';
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, TrashIcon } from './icons.tsx';
import styles from './InsertBar.module.scss';

type InsertBarProps = {
  direction: 'above' | 'below';
  /** Show reorder/delete controls and make the bar draggable. False when this is the only panel. */
  showControls: boolean;
  /**
   * When true, force the bar into its "active" visual (same as hover). The
   * parent uses this to keep both bars of a panel lit when either is hovered
   * or the panel is being dragged.
   */
  isActive: boolean;
  /**
   * When true, escalate the active visual to the "dragging" state — stronger
   * than a plain hover so the user can tell the panel is being moved.
   */
  isDragging: boolean;
  /** Called with true/false as the pointer enters/leaves the bar's hit area. */
  onHoverChange: (hovered: boolean) => void;
  onInsertCopy: () => void;
  onMove: () => void;
  onRequestDelete: () => void;
};

export function InsertBar({
  direction,
  showControls,
  isActive,
  isDragging,
  onHoverChange,
  onInsertCopy,
  onMove,
  onRequestDelete,
}: InsertBarProps) {
  const MoveIcon = direction === 'above' ? ArrowUpIcon : ArrowDownIcon;
  const moveLabel =
    direction === 'above' ? 'Move fretboard up' : 'Move fretboard down';
  const insertLabel =
    direction === 'above'
      ? 'Insert a copy of this fretboard above'
      : 'Insert a copy of this fretboard below';

  return (
    <div
      className={cx(styles.wrapper, {
        [styles.wrapperDraggable]: showControls,
        [styles.wrapperActive]: isActive,
        [styles.wrapperDragging]: isDragging,
      })}
      onPointerEnter={() => {
        onHoverChange(true);
      }}
      onPointerLeave={() => {
        onHoverChange(false);
      }}
    >
      {/*
        The bar background — its `data-drag-bar` attribute is used by
        FretboardPanel's PointerSensor.preventActivation to whitelist drag
        activation only when the pointerdown target is inside this element.
        When the panel is solo we drop the attribute so drag stays disabled.
      */}
      <div
        className={styles.bar}
        aria-hidden="true"
        data-drag-bar={showControls ? 'true' : undefined}
      >
        <span className={styles.barLine}>
          <span />
          <span />
        </span>
        <span className={styles.barLine}>
          <span />
          <span />
        </span>
      </div>

      {/*
        Side-button overlay: centered, max-width matches the controls card so
        the move/delete buttons sit at the controls' edges instead of the bar's
        edges. pointer-events: none lets pointerdowns fall through to the bar
        below; the buttons re-enable their own hits.
      */}
      <div
        className={styles.sideButtons}
        aria-hidden={!showControls}
      >
        {showControls && (
          <button
            type="button"
            className={cx(
              globalStyles.linkButton,
              styles.iconButton,
              styles.moveButton,
            )}
            aria-label={moveLabel}
            onClick={onMove}
          >
            <MoveIcon />
          </button>
        )}

        {showControls && (
          <button
            type="button"
            className={cx(
              globalStyles.linkButton,
              styles.iconButton,
              styles.deleteButton,
            )}
            aria-label="Delete fretboard"
            onClick={onRequestDelete}
          >
            <TrashIcon />
          </button>
        )}
      </div>

      <button
        type="button"
        className={cx(globalStyles.linkButton, styles.insertButton)}
        aria-label={insertLabel}
        onClick={onInsertCopy}
      >
        <PlusIcon />
      </button>
    </div>
  );
}
