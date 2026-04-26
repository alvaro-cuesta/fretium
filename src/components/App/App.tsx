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

  // --- Solo print (with debug markers written to DOM directly) ---
  const [soloPrintId, setSoloPrintId] = useState<string | null>(null);
  const pendingPrintRef = useRef(false);
  const debugRef = useRef<HTMLDivElement | null>(null);

  function debugLog(msg: string) {
    console.log(`[solo-print] ${msg}`);
    const el = debugRef.current;
    if (el) el.textContent = (el.textContent || '') + ` → ${msg}`;
  }

  useEffect(() => {
    if (!pendingPrintRef.current) return;
    pendingPrintRef.current = false;
    debugLog('3-useEffect');

    // Also hide via direct DOM as belt-and-suspenders
    if (soloPrintId) {
      document.querySelectorAll('article[data-panel-id]').forEach((el) => {
        if (
          el instanceof HTMLElement &&
          el.dataset['panelId'] !== soloPrintId
        ) {
          el.style.display = 'none';
        }
      });
    }

    debugLog('4-dom-hidden');
    window.print();
    debugLog('5-after-print');

    // Restore direct DOM changes
    document.querySelectorAll('article[data-panel-id]').forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.display = '';
      }
    });
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
    if (debugRef.current) debugRef.current.textContent = `1-solo-${id}`;
    pendingPrintRef.current = true;
    setSoloPrintId(id);
    debugLog('2-setState');
  }, []);

  const handlePrintAll = useCallback(() => {
    if (debugRef.current) debugRef.current.textContent = '';
    pendingPrintRef.current = true;
    setSoloPrintId(null);
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
      {/* DEBUG: written to DOM directly (no React state) to show print capture timing */}
      <div
        ref={debugRef}
        style={{
          padding: 8,
          background: '#ff0',
          color: '#000',
          fontSize: 12,
          fontFamily: 'monospace',
          minHeight: 20,
        }}
      />
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
