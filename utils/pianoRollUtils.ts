export const START_OCTAVE = 1; // C1
export const END_OCTAVE = 3; // C3
export const OCTAVE_KEYS = 12;
export const NOTE_HEIGHT = 30;
export const MEASURE_WIDTH = 160;
export const MEASURES = 4;
export const SUBDIVISIONS = 16;

export type GridSubdivision = 16 | 8 | 4 | 2 | 1;

export const GRID_OPTIONS = [
  { value: "16", label: "1/16" },
  { value: "8", label: "1/8" },
  { value: "4", label: "1/4" },
  { value: "2", label: "1/2" },
  { value: "1", label: "1" },
] as const;

export const TOTAL_KEYS = (END_OCTAVE - START_OCTAVE) * OCTAVE_KEYS + 1;

export const isBlackKey = (index: number) => {
  const octavePosition = index % OCTAVE_KEYS;
  return [1, 3, 6, 8, 10].includes(octavePosition);
};

export function getNoteNameFromIndex(index: number) {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(index / OCTAVE_KEYS) + START_OCTAVE;
  const noteName = noteNames[index % OCTAVE_KEYS];
  return `${noteName}${octave}`;
}

export type NoteColor = 'green' | 'pink';

export interface Note {
  id: string;
  key: number;
  start: number;
  duration: number;
  color: NoteColor;
}

// New constants for Tone.js
export const BPM = 120;
export const SECONDS_PER_MEASURE = 4;
export const TOTAL_TIME = MEASURES * SECONDS_PER_MEASURE;
