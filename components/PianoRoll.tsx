'use client'

import React, { useState, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import { 
  TOTAL_KEYS, 
  NOTE_HEIGHT, 
  MEASURE_WIDTH, 
  MEASURES,
  isBlackKey, 
  getNoteNameFromIndex,
  BPM,
  TOTAL_TIME,
  type Note,
  type NoteColor,
  type GridSubdivision
} from '../utils/pianoRollUtils';
import { PlayButton } from './PlayButton';

interface PianoRollProps {
  subdivisions: GridSubdivision;
}

export default function PianoRoll({ subdivisions }: PianoRollProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const synthRef = useRef<Tone.PolySynth | null>(null);

  const totalWidth = MEASURE_WIDTH * MEASURES;
  const totalHeight = TOTAL_KEYS * NOTE_HEIGHT;
  const gridSize = MEASURE_WIDTH / subdivisions;

  useEffect(() => {
    synthRef.current = new Tone.PolySynth().toDestination();
    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
      }
    };
  }, []);

  const snapToGrid = (x: number) => {
    return Math.round(x / gridSize) * gridSize;
  };

  const startNotePlacement = (event: React.MouseEvent<SVGRectElement>) => {
    if (!svgRef.current) return;
    
    const svgRect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - svgRect.left;
    const y = event.clientY - svgRect.top;
    
    const key = TOTAL_KEYS - 1 - Math.floor(y / NOTE_HEIGHT);
    const start = snapToGrid(x);
    
    const newNote: Note = {
      id: `note-${Date.now()}`,
      key,
      start,
      duration: gridSize,
      color: Math.random() > 0.5 ? 'green' : 'pink'
    };
    
    setCurrentNote(newNote);
    setIsDragging(true);
  };

  const updateNoteDuration = (event: React.MouseEvent<SVGElement>) => {
    if (!isDragging || !currentNote || !svgRef.current) return;
    
    const svgRect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - svgRect.left;
    const width = Math.max(gridSize, snapToGrid(x - currentNote.start));
    
    setCurrentNote({
      ...currentNote,
      duration: width
    });
  };

  const finishNotePlacement = () => {
    if (currentNote) {
      setNotes([...notes, currentNote]);
      setCurrentNote(null);
    }
    setIsDragging(false);
  };

  const removeNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleMouseMove = (event: React.MouseEvent<SVGElement>) => {
    if (!svgRef.current) return;
    
    const svgRect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - svgRect.left;
    const y = event.clientY - svgRect.top;
    
    setHoverPosition({ x: snapToGrid(x), y: Math.floor(y / NOTE_HEIGHT) * NOTE_HEIGHT });
    
    if (isDragging) {
      updateNoteDuration(event);
    }
  };

  const togglePlayback = async () => {
    if (isPlaying) {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      setIsPlaying(false);
    } else {
      await Tone.start();
      Tone.Transport.bpm.value = BPM;

      const now = Tone.now();
      notes.forEach((note) => {
        const pitch = getNoteNameFromIndex(note.key);
        const startTime = now + (note.start / MEASURE_WIDTH) * TOTAL_TIME;
        const duration = (note.duration / MEASURE_WIDTH) * TOTAL_TIME;
        synthRef.current?.triggerAttackRelease(pitch, duration, startTime);
      });

      Tone.Transport.start();
      setIsPlaying(true);

      setTimeout(() => {
        setIsPlaying(false);
        Tone.Transport.stop();
      }, TOTAL_TIME * 1000);
    }
  };

  return (
    <div className="piano-roll select-none" style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#1E1E1E' }}>
      <div className="flex justify-between items-center p-2 bg-gray-800">
        <h2 className="text-white text-lg font-semibold">Piano Roll</h2>
        <PlayButton isPlaying={isPlaying} onClick={togglePlayback} />
      </div>
      <div style={{ display: 'flex' }}>
        <div className="piano-keys" style={{ width: '60px' }}>
          {[...Array(TOTAL_KEYS)].map((_, index) => {
            const isBlack = isBlackKey(index);
            return (
              <div
                key={index}
                style={{
                  height: `${NOTE_HEIGHT}px`,
                  backgroundColor: isBlack ? '#1a1a1a' : '#ffffff',
                  borderBottom: '1px solid #333',
                  borderRight: '1px solid #333',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '8px',
                  color: isBlack ? '#fff' : '#000',
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}
              >
                {getNoteNameFromIndex(TOTAL_KEYS - 1 - index)}
              </div>
            );
          })}
        </div>
        <svg 
          ref={svgRef}
          width={totalWidth} 
          height={totalHeight} 
          style={{ backgroundColor: '#2A2A2A' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverPosition(null)}
          onMouseUp={finishNotePlacement}
        >
          <Grid totalWidth={totalWidth} totalHeight={totalHeight} subdivisions={subdivisions} />
          <g>
            {notes.map(note => (
              <Note
                key={note.id}
                note={note}
                totalKeys={TOTAL_KEYS}
                onRemove={() => removeNote(note.id)}
              />
            ))}
            {currentNote && (
              <Note
                note={currentNote}
                totalKeys={TOTAL_KEYS}
                onRemove={() => removeNote(currentNote.id)}
                isPreview
              />
            )}
          </g>
          {hoverPosition && (
            <g>
              <rect
                x={hoverPosition.x}
                y={hoverPosition.y}
                width={gridSize}
                height={NOTE_HEIGHT}
                fill="rgba(255, 255, 255, 0.1)"
                pointerEvents="none"
              />
              <line
                x1={hoverPosition.x}
                y1={0}
                x2={hoverPosition.x}
                y2={totalHeight}
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth={1}
                pointerEvents="none"
              />
              <line
                x1={0}
                y1={hoverPosition.y}
                x2={totalWidth}
                y2={hoverPosition.y}
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth={1}
                pointerEvents="none"
              />
            </g>
          )}
          <rect
            width={totalWidth}
            height={totalHeight}
            fill="transparent"
            onMouseDown={startNotePlacement}
          />
        </svg>
      </div>
    </div>
  );
}

interface GridProps {
  totalWidth: number;
  totalHeight: number;
  subdivisions: GridSubdivision;
}

function Grid({ totalWidth, totalHeight, subdivisions }: GridProps) {
  const gridSize = MEASURE_WIDTH / subdivisions;
  
  return (
    <g>
      {/* Vertical grid lines */}
      {[...Array(MEASURES * subdivisions + 1)].map((_, index) => (
        <line
          key={`vertical-${index}`}
          x1={index * gridSize}
          y1={0}
          x2={index * gridSize}
          y2={totalHeight}
          stroke={index % subdivisions === 0 ? '#444' : '#333'}
          strokeWidth={index % subdivisions === 0 ? 1 : 0.5}
        />
      ))}
      {/* Horizontal grid lines */}
      {[...Array(TOTAL_KEYS + 1)].map((_, index) => (
        <line
          key={`horizontal-${index}`}
          x1={0}
          y1={index * NOTE_HEIGHT}
          x2={totalWidth}
          y2={index * NOTE_HEIGHT}
          stroke="#333"
          strokeWidth={0.5}
        />
      ))}
    </g>
  );
}

interface NoteProps {
  note: Note;
  totalKeys: number;
  onRemove: () => void;
  isPreview?: boolean;
}

function Note({ note, totalKeys, onRemove, isPreview = false }: NoteProps) {
  const noteColors = {
    green: { fill: '#90EE90', stroke: '#006400' },
    pink: { fill: '#FFB6C1', stroke: '#FF69B4' }
  };

  const handleClick = (e: React.MouseEvent) => {
    console.log('Note clicked', note, isPreview);
    e.stopPropagation();
    if (!isPreview) {
      onRemove();
    }
  };

  return (
    <g>
      <rect
        x={note.start}
        y={(totalKeys - 1 - note.key) * NOTE_HEIGHT}
        width={note.duration}
        height={NOTE_HEIGHT - 1}
        fill={noteColors[note.color].fill}
        stroke={noteColors[note.color].stroke}
        strokeWidth={1}
        opacity={isPreview ? 0.6 : 1}
        rx={2}
        ry={2}
        onClick={handleClick}
        style={{ cursor: isPreview ? 'default' : 'pointer' }}
        role="button"
        aria-label={`Delete note ${getNoteNameFromIndex(note.key)}`}
        tabIndex={isPreview ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick(e as unknown as React.MouseEvent);
          }
        }}
      />
    </g>
  );
}
