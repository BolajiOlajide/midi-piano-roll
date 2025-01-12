'use client'

import React from 'react';
import { Button } from "@/components/ui/button"
import { Play, Pause } from 'lucide-react';

interface PlayButtonProps {
  isPlaying: boolean;
  onClick: () => void;
}

export function PlayButton({ isPlaying, onClick }: PlayButtonProps) {
  return (
    <Button onClick={onClick} variant="outline" size="icon">
      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
    </Button>
  );
}
