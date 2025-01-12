'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GRID_OPTIONS } from "../utils/pianoRollUtils"

interface GridSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function GridSelector({ value, onValueChange }: GridSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Grid Size" />
      </SelectTrigger>
      <SelectContent>
        {GRID_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

