import React, { useState } from 'react';
import { Edit2, Check } from 'lucide-react';

interface Props {
  points: number;
  onPointsChange: (newPoints: number) => void;
  label?: string;
  size?: 'sm' | 'md';
}

export const PointEditor: React.FC<Props> = ({
  points,
  onPointsChange,
  label = 'điểm',
  size = 'md',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempVal, setTempVal] = useState(points.toString());

  const handleSave = () => {
    const val = parseFloat(tempVal);
    if (!isNaN(val) && val >= 0) {
      onPointsChange(Number(val.toFixed(2)));
    } else {
      setTempVal(points.toString());
    }
    setIsEditing(false);
  };

  const handleAdjust = (delta: number) => {
    const newVal = Math.max(0, Number((points + delta).toFixed(2)));
    onPointsChange(newVal);
    setTempVal(newVal.toString());
  };

  if (isEditing) {
    return (
      <div className="inline-flex items-center gap-1 bg-white border border-blue-400 rounded shadow-xs px-1.5 py-0.5 z-10">
        <input
          type="number"
          step="0.25"
          min="0"
          max="10"
          value={tempVal}
          onChange={(e) => setTempVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          onBlur={handleSave}
          autoFocus
          className="w-14 text-center font-mono font-bold text-xs border border-slate-300 rounded px-1 py-0.5 text-blue-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
        />
        <span className="text-[11px] text-slate-500">{label}</span>
        <button
          onClick={handleSave}
          className="p-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded"
          title="Xác nhận điểm"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 group">
      <button
        onClick={() => {
          setTempVal(points.toString());
          setIsEditing(true);
        }}
        className={`font-mono font-semibold rounded transition-colors flex items-center gap-1 ${
          size === 'sm'
            ? 'text-xs px-1.5 py-0.5 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 border border-slate-200 hover:border-blue-300'
            : 'text-xs px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200'
        }`}
        title="Nhấn để sửa điểm câu này"
      >
        <span>{points.toFixed(1)} {label}</span>
        <Edit2 className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 text-blue-600" />
      </button>

      {/* Quick +/- buttons on hover */}
      <div className="hidden group-hover:inline-flex items-center gap-0.5 bg-slate-100 border border-slate-200 rounded px-1 py-0.5 text-[10px]">
        <button
          onClick={() => handleAdjust(-0.25)}
          className="px-1 text-slate-600 hover:text-red-600 hover:bg-white rounded font-bold"
          title="Giảm 0.25đ"
        >
          -
        </button>
        <button
          onClick={() => handleAdjust(0.25)}
          className="px-1 text-slate-600 hover:text-emerald-600 hover:bg-white rounded font-bold"
          title="Tăng 0.25đ"
        >
          +
        </button>
      </div>
    </div>
  );
};
