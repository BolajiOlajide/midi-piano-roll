// Constants for the piano roll
export const START_OCTAVE = 2; // C2
export const END_OCTAVE = 4;  // C4
export const OCTAVE_KEYS = 12;
export const NOTE_HEIGHT = 30;
export const MEASURE_WIDTH = 160;
export const MEASURES = 4;

export type GridSubdivision = 16 | 8 | 4 | 2 | 1;

// Update SUBDIVISIONS to be dynamic
export const GRID_OPTIONS = [
  { value: "16", label: "1/16" },
  { value: "8", label: "1/8" },
  { value: "4", label: "1/4" },
  { value: "2", label: "1/2" },
  { value: "1", label: "1" },
] as const;

// Calculate total keys from C2 to C4 (25 keys)
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

