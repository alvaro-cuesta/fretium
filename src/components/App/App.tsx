import { DragDropProvider } from '@dnd-kit/react';
import { useCallback, useState } from 'react';
import { CommonControls } from '../CommonControls/CommonControls.tsx';
import { ConfirmDialog } from '../ConfirmDialog.tsx';
import { FretboardPanel } from '../FretboardPanel/FretboardPanel.tsx';
import { Layout } from '../Layout.tsx';
import styles from './App.module.scss';
import { useAppState } from './app-state.ts';

export function App() {
  const {
    commonConfig,
    setCommonConfig,
    fretboards,
    removingIds,
    insertingIds,
    updateConfig,
    insertCopyAt,
    removeFretboard,
    finalizeRemoval,
    moveUp,
    moveDown,
    reorder,
  } = useAppState();

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleConfirmDelete = useCallback(() => {
    if (pendingDeleteId) {
      removeFretboard(pendingDeleteId);
    }
    setPendingDeleteId(null);
  }, [pendingDeleteId, removeFretboard]);

  const handleCancelDelete = useCallback(() => {
    setPendingDeleteId(null);
  }, []);

  return (
    <Layout>
      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled) return;
          const source = event.operation.source;
          if (!source) return;

          // After the optimistic-sorting plugin runs through all the in-drag
          // swaps, `source.index` holds the panel's FINAL position. Using the
          // last `target.index` is wrong when multiple midpoint crossings
          // happened — the target might be an earlier waypoint, not the
          // destination.
          const finalIndex = (source as unknown as { index?: number }).index;
          const initialIndex = (source as unknown as { initialIndex?: number })
            .initialIndex;
          if (
            typeof finalIndex !== 'number' ||
            typeof initialIndex !== 'number' ||
            finalIndex === initialIndex
          ) {
            return;
          }

          // React state hasn't been touched during the drag; the panel's id
          // is still at its pre-drag position in our array.
          const currentIndex = fretboards.findIndex(
            (f) => f.id === String(source.id),
          );
          if (currentIndex < 0) return;
          reorder(currentIndex, finalIndex);
        }}
      >
        <CommonControls
          config={commonConfig}
          onChange={setCommonConfig}
        />

        <div className={styles.panelList}>
          {fretboards.map((fretboard, index) => (
            <FretboardPanel
              key={fretboard.id}
              id={fretboard.id}
              index={index}
              total={fretboards.length}
              config={fretboard.config}
              commonConfig={commonConfig}
              isRemoving={removingIds.has(fretboard.id)}
              isInserting={insertingIds.has(fretboard.id)}
              onRemoveAnimationEnd={() => {
                finalizeRemoval(fretboard.id);
              }}
              onChangeConfig={(next) => {
                updateConfig(fretboard.id, next);
              }}
              onMoveUp={() => {
                moveUp(fretboard.id);
              }}
              onMoveDown={() => {
                moveDown(fretboard.id);
              }}
              onRequestDelete={() => {
                setPendingDeleteId(fretboard.id);
              }}
              onInsertCopyAbove={() => {
                insertCopyAt(index, fretboard.config);
              }}
              onInsertCopyBelow={() => {
                insertCopyAt(index + 1, fretboard.config);
              }}
            />
          ))}
        </div>
      </DragDropProvider>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete fretboard?"
        body="This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Layout>
  );
}
