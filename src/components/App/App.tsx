import { DragDropProvider } from '@dnd-kit/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CommonControls } from '../CommonControls/CommonControls.tsx';
import { ConfirmDialog } from '../ConfirmDialog.tsx';
import { FretboardPanel } from '../FretboardPanel/FretboardPanel.tsx';
import { TrashIcon } from '../FretboardPanel/icons.tsx';
import { Layout } from '../Layout.tsx';
import styles from './App.module.scss';
import { useAppState } from './app-state.ts';
import type { PanelImgData } from './panel-img-data.ts';

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

  // Track each panel's SVG viewBox width so we can print all fretboards at
  // the same scale — the widest dictates 100% page width, others shrink
  // proportionally.
  const [panelWidths, setPanelWidths] = useState<Map<string, number>>(
    () => new Map(),
  );
  const reportPanelWidth = useCallback((id: string, width: number) => {
    setPanelWidths((prev) => {
      if (prev.get(id) === width) return prev;
      const next = new Map(prev);
      next.set(id, width);
      return next;
    });
  }, []);
  const maxFretboardWidth = useMemo(() => {
    let max = 0;
    for (const [id, w] of panelWidths) {
      if (!removingIds.has(id) && w > max) max = w;
    }
    return max;
  }, [panelWidths, removingIds]);

  // Track each panel's export-ready img data for share-all.
  const [panelImgData, setPanelImgData] = useState<
    Map<string, PanelImgData | null>
  >(() => new Map());
  const reportPanelImgData = useCallback(
    (id: string, data: PanelImgData | null) => {
      setPanelImgData((prev) => {
        const existing = prev.get(id) ?? null;
        // Compare by value — the caller constructs a new object each time, so
        // identity comparison would always trigger a state update → re-render
        // → infinite loop.
        if (
          existing === data ||
          (existing !== null &&
            data !== null &&
            existing.svgUrl === data.svgUrl &&
            existing.filenameBase === data.filenameBase &&
            existing.width === data.width &&
            existing.height === data.height)
        ) {
          return prev;
        }
        const next = new Map(prev);
        next.set(id, data);
        return next;
      });
    },
    [],
  );
  const allPanelImgData = useMemo(() => {
    const result: PanelImgData[] = [];
    for (const fb of fretboards) {
      if (removingIds.has(fb.id)) continue;
      const data = panelImgData.get(fb.id);
      if (data) result.push(data);
    }
    return result;
  }, [fretboards, removingIds, panelImgData]);

  // Solo/all print: useEffect calls window.print() after React commits so
  // the panelPrintHidden class is on the DOM when the browser captures.
  // pendingPrintRef stays true through the print call so the beforeprint
  // listener (which clears stale solo state on native Ctrl+P) doesn't
  // undo us mid-capture on Chrome Android.
  const [soloPrintId, setSoloPrintId] = useState<string | null>(null);
  const [, forceRender] = useState(0);
  const pendingPrintRef = useRef(false);

  useEffect(() => {
    if (!pendingPrintRef.current) return;
    window.print();
    pendingPrintRef.current = false;
  });

  useEffect(() => {
    const handleBeforePrint = () => {
      if (pendingPrintRef.current) return;
      setSoloPrintId(null);
    };
    window.addEventListener('beforeprint', handleBeforePrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
    };
  }, []);

  const handlePrintSolo = useCallback((id: string) => {
    pendingPrintRef.current = true;
    setSoloPrintId(id);
  }, []);

  const handlePrintAll = useCallback(() => {
    pendingPrintRef.current = true;
    setSoloPrintId(null);
    // Force a re-render even when soloPrintId is already null so the
    // useEffect fires and calls window.print().
    forceRender((n) => n + 1);
  }, []);

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
          onPrintAll={handlePrintAll}
          allPanelImgData={allPanelImgData}
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
              maxFretboardWidth={maxFretboardWidth}
              onFretboardWidthChange={(width) => {
                reportPanelWidth(fretboard.id, width);
              }}
              onImgDataChange={(data) => {
                reportPanelImgData(fretboard.id, data);
              }}
              onPrintSolo={() => {
                handlePrintSolo(fretboard.id);
              }}
              isPrintHidden={
                soloPrintId !== null && soloPrintId !== fretboard.id
              }
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
        confirmLabel={
          <>
            <TrashIcon /> Delete
          </>
        }
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Layout>
  );
}
