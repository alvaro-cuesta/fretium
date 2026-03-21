export const FRETBOARD_THEME_FONT_FAMILY =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

type FretboardNoteColor = {
  background: string;
  text: string;
};

export const FRETBOARD_THEME_NOTE_RADIUS = 10;
export const FRETBOARD_THEME_NOTE_FONT_SIZE = 9.5;
export const FRETBOARD_THEME_NOTE_FONT_WEIGHT = 700;
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

export const FRETBOARD_THEME_LABEL_FONT_SIZE = 10;
export const FRETBOARD_THEME_LABEL_FONT_WEIGHT = 700;
export const FRETBOARD_THEME_LABEL_COLOR = 'rgba(192, 192, 192, 1)';

export const FRETBOARD_THEME_STRING_COLOR = '#6f7f8f';

export const FRETBOARD_THEME_MARKER_RADIUS = 4.5;
export const FRETBOARD_THEME_MARKER_COLOR = 'rgba(192, 192, 192, 1)';
