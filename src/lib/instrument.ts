// @todo if someone ever needs microtonal instruments, support them!

import type { TupleOf } from 'type-fest';
import type { Note } from './music';

export type Instrument<TNumStrings extends number> = {
  strings: TNumStrings;
  tunings: Record<string, Tuning<TNumStrings>>;
};

export type Tuning<TNumStrings extends number> = TupleOf<TNumStrings, Note>;
