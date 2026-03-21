export const FRETBOARD_THEME_FONT_FAMILY =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

export const FRETBOARD_THEME_NOTE_COLORS = {
  BLACK: '#000000',
  WHITE: '#ffffff',
  TRANSPARENT: 'transparent',
  '1-STRONG': '#d81e5b',
  '1-LIGHT': '#f18805',
  '1-LIGHTER': '#ffc666',
  '2-STRONG': '#2f4b7c',
  '2-LIGHT': '#18a999',
  '2-LIGHTER': '#4bc9b3',
  '3-STRONG': '#5a1a8a',
  '3-LIGHT': '#c94fc4',
  '3-LIGHTER': '#e48fe0',
  '4-STRONG': '#1b5e20',
  '4-LIGHT': '#43a047',
  '4-LIGHTER': '#81c784',
};

export type FretboardNoteColor = keyof typeof FRETBOARD_THEME_NOTE_COLORS;
