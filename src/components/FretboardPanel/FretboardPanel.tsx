import { PointerSensor } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import cx from 'classnames';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { objectKeys } from '../../../lib/object.ts';
import { INSTRUMENTS } from '../../config/instruments.ts';
import { PATTERNS_GROUPED } from '../../config/patterns/patterns.ts';
import { calculateFretRange } from '../../lib/fret-range.ts';
import { type NoteDisplayMode } from '../../lib/fretboard.ts';
import { NOTES, type Note } from '../../lib/music.ts';
import {
  coercePatternPath,
  getPatternConfigEntryPatternAtPath,
  getPatternFullDisplayNameAtPath,
} from '../../lib/pattern-config.ts';
import { renderPattern } from '../../lib/pattern-engine.ts';
import {
  END_FRET_OPTIONS,
  fretRangeReducer,
  parseEndFretOptionValue,
  parseStartFretOptionValue,
  START_FRET_OPTIONS,
} from '../App/fret-range.ts';
import type { FretboardConfig } from '../App/fretboard-config.ts';
import {
  INSTRUMENT_TUNING_BY_VALUE,
  INSTRUMENT_TUNING_GROUPS,
  type InstrumentTuningOption,
} from '../App/instrument-tuning.ts';
import {
  getPatternSelectDescriptors,
  type GroupedPatternPath,
} from '../App/pattern.ts';
import { getFretboardMetrics } from '../Fretboard/theme.ts';
import { FretboardImg, type ImgChangeEvent } from '../FretboardImg.tsx';
import { SaveMenu } from '../SaveMenu.tsx';
import { Scrollable } from '../Scrollable.tsx';
import styles from './FretboardPanel.module.scss';
import { InsertBar } from './InsertBar.tsx';

type FretboardPanelProps = {
  id: string;
  index: number;
  total: number;
  config: FretboardConfig;
  /** True while the panel is mid-fade-out — about to unmount. */
  isRemoving: boolean;
  /** True for the first frame after mount so the entering animation can play. */
  isInserting: boolean;
  /** Called when the remove transition finishes so the parent can drop us. */
  onRemoveAnimationEnd: () => void;
  onChangeConfig: (next: FretboardConfig) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRequestDelete: () => void;
  onInsertCopyAbove: () => void;
  onInsertCopyBelow: () => void;
};

export function FretboardPanel({
  id,
  index,
  total,
  config,
  isRemoving,
  isInserting,
  onRemoveAnimationEnd,
  onChangeConfig,
  onMoveUp,
  onMoveDown,
  onRequestDelete,
  onInsertCopyAbove,
  onInsertCopyBelow,
}: FretboardPanelProps) {
  const isSolo = total <= 1;

  // We want BOTH the above and below bars to activate drag on this panel, but
  // `useSortable` only exposes a single `handleRef`. Instead of wrestling with
  // multi-handle plumbing, we leave the drag source as the whole <article>
  // (the default when no `handle` is set) and gate activation at the sensor:
  // `preventActivation` blocks pointerdowns that aren't inside a bar. Bars
  // get a `data-drag-bar` attribute for that check.
  const sensors = useMemo(
    () => [
      PointerSensor.configure({
        preventActivation: (event) => {
          const target = event.target;
          if (!(target instanceof Element)) return true;
          return target.closest('[data-drag-bar="true"]') === null;
        },
      }),
    ],
    [],
  );

  const { ref: sortableRef, isDragging } = useSortable({
    id,
    index,
    // `idle: true` animates index changes that happen outside a drag — e.g.
    // when the user clicks the up/down arrows — instead of snapping instantly.
    transition: { idle: true },
    // When there's only one panel there's nothing to reorder, so disable the
    // whole sortable registration. The bars are still shown for insert-copy
    // but don't activate drag.
    disabled: isSolo,
    sensors,
  });

  // We need direct access to the panel element to listen for transitionend on
  // the remove animation, but `useSortable` already takes the article's ref.
  // Combine them: store the element ourselves AND forward to dnd-kit.
  const panelRef = useRef<HTMLElement | null>(null);
  const setPanelRef = useCallback(
    (el: HTMLElement | null) => {
      panelRef.current = el;
      sortableRef(el);
    },
    [sortableRef],
  );

  // While the panel is fading out, finalize the removal as soon as the opacity
  // transition ends (or is canceled — e.g. interrupted by another animation).
  // CSS owns the timing; we just observe.
  useEffect(() => {
    if (!isRemoving) return;
    const el = panelRef.current;
    if (!el) return;

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      onRemoveAnimationEnd();
    };
    const handle = (event: TransitionEvent) => {
      // The transition declaration animates both opacity and transform — only
      // count one of them, and ignore bubbled transitions from descendants.
      if (event.target !== el) return;
      if (event.propertyName !== 'opacity') return;
      finish();
    };

    el.addEventListener('transitionend', handle);
    el.addEventListener('transitioncancel', handle);
    return () => {
      el.removeEventListener('transitionend', handle);
      el.removeEventListener('transitioncancel', handle);
    };
  }, [isRemoving, onRemoveAnimationEnd]);

  // The above and below bars belong to the same panel, so hovering either one
  // should light up both — and both stay lit while the panel is being dragged.
  const [isBarHovered, setIsBarHovered] = useState(false);
  const isBarActive = isBarHovered || isDragging;

  const [fretboardImg, setFretboardImg] = useState<ImgChangeEvent | null>(null);
  const firstPatternSelectRef = useRef<HTMLSelectElement | null>(null);

  const resolvedInstrumentTuning = INSTRUMENT_TUNING_BY_VALUE.get(
    config.instrumentTuning,
  );

  if (!resolvedInstrumentTuning) {
    throw new Error('Expected at least one instrument tuning to be available.');
  }

  const patternSelects = useMemo(
    () => getPatternSelectDescriptors(config.pattern),
    [config.pattern],
  );

  const renderPatternResult = useMemo(
    () =>
      renderPattern(
        resolvedInstrumentTuning.tuning,
        // Resolve the pattern entry from the path stored in config
        // (we already know the path is validated)
        getPatternEntry(config.pattern),
        config.rootNote,
      ),
    [resolvedInstrumentTuning.tuning, config.pattern, config.rootNote],
  );

  const fretRange = useMemo(
    () => calculateFretRange(config.fretRange, renderPatternResult),
    [config.fretRange, renderPatternResult],
  );

  const fretboardMetrics = useMemo(
    () =>
      getFretboardMetrics({
        startFret: fretRange.start,
        endFret: fretRange.end,
        tuning: resolvedInstrumentTuning.tuning,
        showStringLabels: config.showStringLabels,
        showFretLabels: config.showFretLabels,
      }),
    [
      fretRange.start,
      fretRange.end,
      resolvedInstrumentTuning.tuning,
      config.showStringLabels,
      config.showFretLabels,
    ],
  );

  const patch = (next: Partial<FretboardConfig>) => {
    onChangeConfig({ ...config, ...next });
  };

  return (
    <article
      ref={setPanelRef}
      aria-label={`Fretboard ${index + 1}`}
      className={cx(styles.panel, {
        [styles.panelRemoving]: isRemoving,
        [styles.panelInserting]: isInserting,
      })}
      aria-hidden={isRemoving}
    >
      <InsertBar
        direction="above"
        showControls={!isSolo}
        isActive={isBarActive}
        isDragging={isDragging}
        onHoverChange={setIsBarHovered}
        onInsertCopy={onInsertCopyAbove}
        onMove={onMoveUp}
        onRequestDelete={onRequestDelete}
      />

      <div className={styles.panelContent}>
        <section className={styles.controlsSection}>
          <form className={styles.controlsForm}>
            <label className={cx(styles.fieldGroup, styles.instrumentField)}>
              <span className={styles.fieldLabel}>Instrument</span>
              <select
                className={styles.selectorInput}
                value={resolvedInstrumentTuning.value}
                onChange={(e) => {
                  patch({
                    instrumentTuning: e.target.value as InstrumentTuningOption,
                  });
                }}
                autoComplete="off"
              >
                {INSTRUMENT_TUNING_GROUPS.map((group) => (
                  <optgroup
                    key={group.instrumentName}
                    label={group.instrumentName}
                  >
                    {objectKeys(INSTRUMENTS[group.instrumentName].tunings).map(
                      (tuningName) => {
                        const value = `${group.instrumentName}::${tuningName}`;
                        const label = `${group.instrumentName} ${tuningName}`;
                        return (
                          <option
                            key={value}
                            value={value}
                          >
                            {label}
                          </option>
                        );
                      },
                    )}
                  </optgroup>
                ))}
              </select>
            </label>

            <div className={cx(styles.rangeFields, styles.fretRangeFields)}>
              <label className={styles.fieldGroup}>
                <span className={styles.fieldLabel}>Start fret</span>
                <select
                  className={styles.selectorInput}
                  value={config.fretRange.start}
                  onChange={(e) => {
                    patch({
                      fretRange: fretRangeReducer(config.fretRange, {
                        type: 'SET_START',
                        start: parseStartFretOptionValue(e.target.value),
                      }),
                    });
                  }}
                  autoComplete="off"
                >
                  {START_FRET_OPTIONS.map(({ label, value }) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.fieldGroup}>
                <span className={styles.fieldLabel}>End fret</span>
                <select
                  className={styles.selectorInput}
                  value={config.fretRange.end}
                  onChange={(e) => {
                    patch({
                      fretRange: fretRangeReducer(config.fretRange, {
                        type: 'SET_END',
                        end: parseEndFretOptionValue(e.target.value),
                      }),
                    });
                  }}
                  autoComplete="off"
                >
                  {END_FRET_OPTIONS.map(({ label, value }) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className={cx(styles.fieldGroup, styles.noteLabelsField)}>
              <span className={styles.fieldLabel}>Note labels</span>
              <select
                className={styles.selectorInput}
                value={config.noteDisplayMode}
                onChange={(e) => {
                  patch({
                    noteDisplayMode: e.target.value as NoteDisplayMode,
                  });
                }}
                autoComplete="off"
              >
                <option value="note">Note</option>
                <option value="interval">Intervals</option>
                <option value="degree">Degrees</option>
                <option value="none">None</option>
              </select>
            </label>

            <div className={cx(styles.fieldGroup, styles.patternField)}>
              <fieldset className={styles.patternFieldset}>
                <legend className={styles.patternLegend}>
                  <span
                    className={cx(styles.fieldLabel, styles.legendButton)}
                    onClick={() => {
                      firstPatternSelectRef.current?.focus();
                    }}
                  >
                    Pattern
                  </span>
                </legend>

                <div
                  className={cx(styles.rangeFields, styles.patternSelectsRow)}
                >
                  {patternSelects.map((patternSelect, depth) => (
                    <select
                      key={
                        depth === 0
                          ? 'pattern-root'
                          : `pattern-${config.pattern.slice(0, depth).join('/')}`
                      }
                      ref={depth === 0 ? firstPatternSelectRef : undefined}
                      className={styles.selectorInput}
                      value={patternSelect.value}
                      onChange={(e) => {
                        const nextSegment = e.target.value;
                        // coercePatternPath truncates / extends as needed when
                        // the new top-level option has a different depth than
                        // the previous one (e.g. switching from arpeggios to
                        // heptatonic resets the deeper segments).
                        const nextPath = coercePatternPath(PATTERNS_GROUPED, [
                          ...config.pattern.slice(0, depth),
                          nextSegment,
                          ...config.pattern.slice(depth + 1),
                        ]);
                        patch({ pattern: nextPath });
                      }}
                      autoComplete="off"
                      aria-label={patternSelect.ariaLabel}
                    >
                      {patternSelect.options.options.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.displayName}
                        </option>
                      ))}
                      {patternSelect.options.groups.map((group) => (
                        <optgroup
                          key={`group-${group.id}`}
                          label={group.displayName}
                        >
                          {group.options.map((option) => (
                            <option
                              key={`${group.id}-${option.value}`}
                              value={option.value}
                            >
                              {option.displayName}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  ))}
                </div>
              </fieldset>
            </div>

            <label className={cx(styles.fieldGroup, styles.rootNoteField)}>
              <span className={styles.fieldLabel}>Root note</span>
              <select
                className={styles.selectorInput}
                value={config.rootNote}
                onChange={(e) => {
                  patch({ rootNote: e.target.value as Note });
                }}
                autoComplete="off"
              >
                {NOTES.map((rootNote) => (
                  <option
                    key={rootNote}
                    value={rootNote}
                  >
                    {rootNote}
                  </option>
                ))}
              </select>
            </label>

            <div className={styles.checkboxRow}>
              <label className={styles.checkboxField}>
                <input
                  className={styles.checkboxInput}
                  type="checkbox"
                  checked={config.showBackgroundNeck}
                  onChange={(e) => {
                    patch({ showBackgroundNeck: e.target.checked });
                  }}
                  autoComplete="off"
                />
                <span className={styles.checkboxLabel}>Background</span>
              </label>

              <label className={styles.checkboxField}>
                <input
                  className={styles.checkboxInput}
                  type="checkbox"
                  checked={config.showStrings}
                  onChange={(e) => {
                    patch({ showStrings: e.target.checked });
                  }}
                  autoComplete="off"
                />
                <span className={styles.checkboxLabel}>Strings</span>
              </label>

              <label className={styles.checkboxField}>
                <input
                  className={styles.checkboxInput}
                  type="checkbox"
                  checked={config.showFretLines}
                  onChange={(e) => {
                    patch({ showFretLines: e.target.checked });
                  }}
                  autoComplete="off"
                />
                <span className={styles.checkboxLabel}>Fret lines</span>
              </label>

              <label className={styles.checkboxField}>
                <input
                  className={styles.checkboxInput}
                  type="checkbox"
                  checked={config.showFretMarkers}
                  onChange={(e) => {
                    patch({ showFretMarkers: e.target.checked });
                  }}
                  autoComplete="off"
                />
                <span className={styles.checkboxLabel}>Fret markers</span>
              </label>

              <label className={styles.checkboxField}>
                <input
                  className={styles.checkboxInput}
                  type="checkbox"
                  checked={config.showFretLabels}
                  onChange={(e) => {
                    patch({ showFretLabels: e.target.checked });
                  }}
                  autoComplete="off"
                />
                <span className={styles.checkboxLabel}>Fret labels</span>
              </label>

              <label className={styles.checkboxField}>
                <input
                  className={styles.checkboxInput}
                  type="checkbox"
                  checked={config.showStringLabels}
                  onChange={(e) => {
                    patch({ showStringLabels: e.target.checked });
                  }}
                  autoComplete="off"
                />
                <span className={styles.checkboxLabel}>String labels</span>
              </label>

              <label className={styles.checkboxField}>
                <input
                  className={styles.checkboxInput}
                  type="checkbox"
                  checked={config.showDropShadows}
                  onChange={(e) => {
                    patch({ showDropShadows: e.target.checked });
                  }}
                  autoComplete="off"
                />
                <span className={styles.checkboxLabel}>Drop shadows</span>
              </label>
            </div>
          </form>
        </section>

        <section className={styles.fretboardSection}>
          <Scrollable>
            <FretboardImg
              className={styles.fretboardImg}
              onImgChange={(nextFretboardImg) => {
                setFretboardImg(nextFretboardImg);
              }}
              pattern={getPatternEntry(config.pattern)}
              patternName={
                getPatternFullDisplayNameAtPath(
                  PATTERNS_GROUPED,
                  config.pattern,
                ) ?? getPatternEntry(config.pattern).displayName
              }
              instrumentName={resolvedInstrumentTuning.instrumentName}
              tuningName={resolvedInstrumentTuning.tuningName}
              tuning={resolvedInstrumentTuning.tuning}
              startFret={fretRange.start}
              endFret={fretRange.end}
              showBackgroundNeck={config.showBackgroundNeck}
              showStrings={config.showStrings}
              showFretLines={config.showFretLines}
              showFretMarkers={config.showFretMarkers}
              showFretLabels={config.showFretLabels}
              showStringLabels={config.showStringLabels}
              showDropShadows={config.showDropShadows}
              noteDisplayMode={config.noteDisplayMode}
              rootNote={config.rootNote}
            />
          </Scrollable>

          {fretboardImg && (
            <SaveMenu
              svgUrl={fretboardImg.url}
              filenameBase={fretboardImg.filenameBase}
              width={fretboardMetrics.total.width}
              height={fretboardMetrics.total.height}
            />
          )}
        </section>
      </div>

      <InsertBar
        direction="below"
        showControls={!isSolo}
        isActive={isBarActive}
        isDragging={isDragging}
        onHoverChange={setIsBarHovered}
        onInsertCopy={onInsertCopyBelow}
        onMove={onMoveDown}
        onRequestDelete={onRequestDelete}
      />
    </article>
  );
}

// Pattern paths flowing into the panel are already validated, so missing
// entries here mean a logic bug — surface it loudly rather than rendering
// against stale or invalid config.
function getPatternEntry(path: GroupedPatternPath) {
  const entry = getPatternConfigEntryPatternAtPath(PATTERNS_GROUPED, path);
  if (!entry) {
    throw new Error(`Invalid pattern path: ${path.join(' / ')}`);
  }
  return entry;
}
