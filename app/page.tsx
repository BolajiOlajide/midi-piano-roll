'use client'

import { useState } from 'react'
import PianoRoll from '../components/PianoRoll'
import { GridSelector } from '../components/GridSelector'
import { type GridSubdivision } from '../utils/pianoRollUtils'

export default function Home() {
  const [gridSize, setGridSize] = useState<string>("16")

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-[#1E1E1E]">
      <div className="w-full max-w-[1200px]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Piano Roll</h1>
          <div className="flex items-center gap-2">
            <span className="text-white">Grid Size:</span>
            <GridSelector 
              value={gridSize} 
              onValueChange={(value) => setGridSize(value)} 
            />
          </div>
        </div>
        <div className="border border-gray-700 rounded-lg overflow-hidden">
          <PianoRoll subdivisions={Number(gridSize) as GridSubdivision} />
        </div>
      </div>
    </main>
  );
}

