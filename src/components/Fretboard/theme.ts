import type { Tuning } from '../../lib/instrument';

export const FRETBOARD_THEME_FONT_FAMILY =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

type FretboardNoteColor = {
  background: string;
  text: string;
};

export const FRETBOARD_THEME_NOTE_RADIUS = 10;
export const FRETBOARD_THEME_NOTE_FONT_SIZE = 9.5;
export const FRETBOARD_THEME_NOTE_FONT_WEIGHT = 700;
export const FRETBOARD_THEME_NOTE_SHADOW_BLUR = 2;
export const FRETBOARD_THEME_NOTE_SHADOW_OPACITY = 1;
export const FRETBOARD_THEME_NOTE_COLORS = {
  BLACK: {
    background: '#000000',
    text: '#ffffff',
  },
  WHITE: {
    background: '#ffffff',
    text: '#000000',
  },
  TRANSPARENT: {
    background: 'transparent',
    text: '#000000',
  },
  '1-STRONG': {
    background: '#d81e5b',
    text: '#ffffff',
  },
  '1-LIGHT': {
    background: '#f18805',
    text: '#ffffff',
  },
  '1-LIGHTER': {
    background: '#ffc666',
    text: '#ffffff',
  },
  '2-STRONG': {
    background: '#2f4b7c',
    text: '#ffffff',
  },
  '2-LIGHT': {
    background: '#18a999',
    text: '#ffffff',
  },
  '2-LIGHTER': {
    background: '#4bc9b3',
    text: '#ffffff',
  },
  '3-STRONG': {
    background: '#5a1a8a',
    text: '#ffffff',
  },
  '3-LIGHT': {
    background: '#c94fc4',
    text: '#ffffff',
  },
  '3-LIGHTER': {
    background: '#e48fe0',
    text: '#ffffff',
  },
  '4-STRONG': {
    background: '#1b5e20',
    text: '#ffffff',
  },
  '4-LIGHT': {
    background: '#43a047',
    text: '#ffffff',
  },
  '4-LIGHTER': {
    background: '#81c784',
    text: '#ffffff',
  },
} as const satisfies Record<string, FretboardNoteColor>;

export type FretboardNoteColorName = keyof typeof FRETBOARD_THEME_NOTE_COLORS;

export const FRETBOARD_THEME_NUT_WIDTH = 6;
export const FRETBOARD_THEME_NUT_COLOR = '#5a4535';
export const FRETBOARD_THEME_FRET_WIDTH = 2;
export const FRETBOARD_THEME_FRET_COLOR = '#8a735f';
export const FRETBOARD_THEME_FRET_SHADOW_BLUR = 1.5;
export const FRETBOARD_THEME_FRET_SHADOW_OPACITY = 1;

export const FRETBOARD_THEME_LABEL_FONT_SIZE = 10;
export const FRETBOARD_THEME_LABEL_FONT_WEIGHT = 700;
export const FRETBOARD_THEME_LABEL_COLOR = 'rgb(136, 136, 136)';

export const FRETBOARD_THEME_STRING_COLOR = '#6f7f8f';
export const FRETBOARD_THEME_STRING_SHADOW_BLUR = 1.5;
export const FRETBOARD_THEME_STRING_SHADOW_OPACITY = 1;

export const FRETBOARD_THEME_MARKER_RADIUS = 4.5;
export const FRETBOARD_THEME_MARKER_COLOR = 'rgb(192, 192, 192)';

export const FRETBOARD_THEME_BACKGROUND_COLOR = 'rgba(35, 30, 31, 0.13)';

const FRETBOARD_THEME_STRING_GAUGE_MIN = 1.2;
const FRETBOARD_THEME_STRING_GAUGE_MAX = 3.2;
const FRETBOARD_THEME_STRING_GAUGE_STEP = 0.35;

// @todo Theme-ify these spacing values as well
export const FRETBOARD_THEME_CORNER_RADIUS = 14;
const FRETBOARD_THEME_BOARD_PADDING = 16;
const FRETBOARD_THEME_FRET_SPACING = 64;
const FRETBOARD_THEME_OVERHANG_SPACING = 24;
const FRETBOARD_THEME_SPACING_BETWEEN_STRINGS = 28;
const FRETBOARD_THEME_FRET_LABEL_OFFSET = 12;
const FRETBOARD_THEME_SPACE_TO_STRINGS = 12;
// Strings need to extend a bit further so that their drop shadow clips too
// Without this, you can see a small gap in the shadow near the nut
const FRETBOARD_THEME_STRING_CLIP_OVERHANG = 4;
const FRETBOARD_THEME_STRING_NAME_NO_OPEN_STRINGS_X =
  FRETBOARD_THEME_SPACE_TO_STRINGS;

export function getFretboardMetrics(input: {
  startFret: number;
  endFret: number;
  tuning: Tuning<number>;
  showStringLabels: boolean;
  showFretLabels: boolean;
}) {
  const showOpenStrings = input.startFret === 0;
  const hasNut = input.startFret <= 1;
  const hasLeftOverhang = input.startFret > 1;
  const stringCount = input.tuning.length;

  const [stringLabelX, stringLabelWidth] = showOpenStrings
    ? [getNoteX(0), FRETBOARD_THEME_FRET_SPACING]
    : [
        -FRETBOARD_THEME_STRING_NAME_NO_OPEN_STRINGS_X,
        FRETBOARD_THEME_STRING_NAME_NO_OPEN_STRINGS_X * 2,
      ];

  const firstNeckFret = Math.max(1, input.startFret);

  const fretLabelsHeight = input.showFretLabels
    ? FRETBOARD_THEME_FRET_LABEL_OFFSET * 2
    : 0;

  const padding = {
    top: FRETBOARD_THEME_BOARD_PADDING,
    right: FRETBOARD_THEME_BOARD_PADDING,
    bottom: Math.max(FRETBOARD_THEME_BOARD_PADDING, fretLabelsHeight),
    left: Math.max(
      FRETBOARD_THEME_BOARD_PADDING,
      showOpenStrings ? FRETBOARD_THEME_FRET_SPACING : 0,
      input.showStringLabels ? stringLabelWidth : 0,
    ),
  };

  const neck = {
    width: getFretLineX(input.endFret + 1) + FRETBOARD_THEME_OVERHANG_SPACING,
    height:
      FRETBOARD_THEME_SPACE_TO_STRINGS +
      Math.max(0, (stringCount - 1) * FRETBOARD_THEME_SPACING_BETWEEN_STRINGS) +
      FRETBOARD_THEME_SPACE_TO_STRINGS,
  };

  const total = {
    width: padding.left + neck.width + padding.right,
    height: padding.top + neck.height + padding.bottom,
  };

  function getFretLineX(fret: number) {
    return hasNut
      ? FRETBOARD_THEME_NUT_WIDTH / 2 +
          (fret - 1) * FRETBOARD_THEME_FRET_SPACING
      : FRETBOARD_THEME_OVERHANG_SPACING +
          (fret - firstNeckFret) * FRETBOARD_THEME_FRET_SPACING;
  }

  function getNoteX(fret: number) {
    return fret === 0
      ? getFretLineX(1) - FRETBOARD_THEME_FRET_SPACING / 2
      : getFretLineX(fret) + FRETBOARD_THEME_FRET_SPACING / 2;
  }

  const middle = neck.height * 0.5;
  function getFretboardMarkerX(fret: number) {
    return getNoteX(fret);
  }
  const fretboardMarkerSingleY = middle;
  const fretboardMarkerDoubleTopY =
    middle - FRETBOARD_THEME_SPACING_BETWEEN_STRINGS;
  const fretboardMarkerDoubleBottomY =
    middle + FRETBOARD_THEME_SPACING_BETWEEN_STRINGS;

  const stringXLeft = -FRETBOARD_THEME_STRING_CLIP_OVERHANG;
  const stringXRight = neck.width + FRETBOARD_THEME_STRING_CLIP_OVERHANG;
  function getStringY(stringIndex: number) {
    return (
      FRETBOARD_THEME_SPACE_TO_STRINGS +
      stringIndex * FRETBOARD_THEME_SPACING_BETWEEN_STRINGS
    );
  }
  function getStringGauge(stringIndex: number) {
    const stringNumber = stringIndex + 1;
    return Math.max(
      FRETBOARD_THEME_STRING_GAUGE_MIN,
      FRETBOARD_THEME_STRING_GAUGE_MAX -
        (stringCount - stringNumber) * FRETBOARD_THEME_STRING_GAUGE_STEP,
    );
  }

  const fretLabelY = neck.height + FRETBOARD_THEME_FRET_LABEL_OFFSET;

  return {
    firstNeckFret,
    showOpenStrings,
    hasLeftOverhang,
    padding,
    total,
    neck,
    getFretLineX,
    getNoteX,
    getFretboardMarkerX,
    fretboardMarkerSingleY,
    fretboardMarkerDoubleTopY,
    fretboardMarkerDoubleBottomY,
    stringNameX: stringLabelX,
    stringXLeft,
    stringXRight,
    getStringY,
    getStringGauge,
    fretLabelY,
  };
}
