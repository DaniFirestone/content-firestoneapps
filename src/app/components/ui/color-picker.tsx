import { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Pipette } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const PRESET_COLORS = [
  '#3F51B5',
  '#009688',
  '#E9C46A',
  '#F4A261',
  '#E07850',
  '#2A9D8F',
  '#264653',
  '#EF4444',
  '#F59E0B',
  '#10B981',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#6366F1',
  '#14B8A6',
  '#F97316',
  '#84CC16',
  '#06B6D4',
  '#A855F7',
  '#F43F5E',
];

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [showNative, setShowNative] = useState(false);

  return (
    <div className="space-y-3">
      {label && <Label>{label}</Label>}
      
      {/* Hex Input */}
      <div className="flex gap-2">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="font-mono"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowNative(!showNative)}
        >
          <Pipette className="h-4 w-4" />
        </Button>
      </div>

      {/* Native Color Picker */}
      {showNative && (
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full cursor-pointer rounded border"
        />
      )}

      {/* Preset Colors */}
      <div className="grid grid-cols-10 gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className="h-8 w-8 rounded border-2 transition-all hover:scale-110"
            style={{
              backgroundColor: color,
              borderColor: value.toUpperCase() === color.toUpperCase() ? '#000' : 'transparent',
            }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}
