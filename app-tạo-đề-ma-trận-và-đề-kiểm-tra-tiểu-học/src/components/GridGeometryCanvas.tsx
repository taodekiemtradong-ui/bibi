import React, { useState } from 'react';
import { GridDrawing } from '../types/exam';
import { Square, Triangle, Move, Trash2, CheckCircle, RotateCcw } from 'lucide-react';

interface Props {
  data?: GridDrawing;
  isEditable?: boolean;
  onChange?: (updated: GridDrawing) => void;
  title?: string;
}

export const GridGeometryCanvas: React.FC<Props> = ({
  data = { rows: 6, cols: 12, shapeType: 'rectangle' },
  isEditable = false,
  onChange,
  title,
}) => {
  const [rows, setRows] = useState(data.rows || 6);
  const [cols, setCols] = useState(data.cols || 12);
  const [shape, setShape] = useState<string>(data.shapeType || 'rectangle');
  const [instructions, setInstructions] = useState(data.instructions || '');

  // Pre-configured preset polygons on grid
  const getShapeCoordinates = (type: string, r: number, c: number) => {
    switch (type) {
      case 'rectangle':
        return [
          { x: 2, y: 1, label: 'A' },
          { x: Math.min(8, c - 2), y: 1, label: 'B' },
          { x: Math.min(8, c - 2), y: Math.min(4, r - 1), label: 'C' },
          { x: 2, y: Math.min(4, r - 1), label: 'D' },
        ];
      case 'square':
        return [
          { x: 2, y: 1, label: 'M' },
          { x: 5, y: 1, label: 'N' },
          { x: 5, y: 4, label: 'P' },
          { x: 2, y: 4, label: 'Q' },
        ];
      case 'triangle':
        return [
          { x: 4, y: 1, label: 'A' },
          { x: Math.min(8, c - 2), y: Math.min(4, r - 1), label: 'B' },
          { x: 1, y: Math.min(4, r - 1), label: 'C' },
        ];
      case 'parallelogram':
        return [
          { x: 3, y: 1, label: 'M' },
          { x: Math.min(8, c - 2), y: 1, label: 'N' },
          { x: Math.min(7, c - 3), y: Math.min(4, r - 1), label: 'P' },
          { x: 2, y: Math.min(4, r - 1), label: 'Q' },
        ];
      case 'line':
        return [
          { x: 2, y: 2, label: 'A' },
          { x: Math.min(8, c - 2), y: 2, label: 'B' },
        ];
      default:
        return [];
    }
  };

  const points = data.points && data.points.length > 0 ? data.points : getShapeCoordinates(shape, rows, cols);

  const cellSize = 28; // px per grid cell
  const width = cols * cellSize;
  const height = rows * cellSize;

  const handleUpdate = (newShape: string) => {
    setShape(newShape);
    const newPoints = getShapeCoordinates(newShape, rows, cols);
    if (onChange) {
      onChange({
        rows,
        cols,
        shapeType: newShape as any,
        points: newPoints,
        instructions,
      });
    }
  };

  const handleRowsColsChange = (newR: number, newC: number) => {
    setRows(newR);
    setCols(newC);
    const newPoints = getShapeCoordinates(shape, newR, newC);
    if (onChange) {
      onChange({
        rows: newR,
        cols: newC,
        shapeType: shape as any,
        points: newPoints,
        instructions,
      });
    }
  };

  return (
    <div className="my-2 border border-blue-200 bg-sky-50/40 rounded-lg p-3">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-blue-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase text-blue-900 tracking-wider flex items-center gap-1">
            <Square className="w-3.5 h-3.5 text-blue-600" />
            Lưới ô vuông tiểu học (1 ô = 1 cm)
          </span>
          {instructions && (
            <span className="text-xs text-slate-600 italic">· {instructions}</span>
          )}
        </div>

        {isEditable && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Kích thước:</span>
            <select
              value={`${rows}x${cols}`}
              onChange={(e) => {
                const [r, c] = e.target.value.split('x').map(Number);
                handleRowsColsChange(r, c);
              }}
              className="border border-slate-300 rounded px-1.5 py-0.5 bg-white text-xs text-slate-700"
            >
              <option value="5x10">5 hàng x 10 cột</option>
              <option value="6x12">6 hàng x 12 cột</option>
              <option value="6x16">6 hàng x 16 cột</option>
              <option value="4x8">4 hàng x 8 cột (Lớp 1-2)</option>
            </select>

            <span className="text-slate-500 ml-1">Hình mẫu:</span>
            <select
              value={shape}
              onChange={(e) => handleUpdate(e.target.value)}
              className="border border-slate-300 rounded px-1.5 py-0.5 bg-white text-xs text-slate-700"
            >
              <option value="rectangle">Hình chữ nhật</option>
              <option value="square">Hình vuông</option>
              <option value="triangle">Hình tam giác</option>
              <option value="parallelogram">Hình bình hành</option>
              <option value="line">Đoạn thẳng AB</option>
              <option value="empty">Khung trống (để HS vẽ)</option>
            </select>
          </div>
        )}
      </div>

      {/* SVG Grid */}
      <div className="overflow-x-auto bg-white p-2 rounded border border-slate-200 flex justify-center">
        <svg
          width={width}
          height={height}
          className="select-none font-sans"
          style={{ minWidth: width }}
        >
          <defs>
            <pattern id={`grid-pattern-${rows}-${cols}`} width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
              <path
                d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
                fill="none"
                stroke="#c7d2fe"
                strokeWidth="1"
              />
              <path
                d={`M ${cellSize / 2} 0 L 0 0 0 ${cellSize / 2}`}
                fill="none"
                stroke="#e0e7ff"
                strokeWidth="0.5"
                strokeDasharray="2,2"
              />
            </pattern>
          </defs>

          {/* Grid background */}
          <rect width={width} height={height} fill={`url(#grid-pattern-${rows}-${cols})`} stroke="#818cf8" strokeWidth="1.5" />

          {/* Polygon / Shape rendering */}
          {shape !== 'empty' && points.length > 1 && (
            <>
              {shape === 'line' ? (
                <line
                  x1={points[0].x * cellSize}
                  y1={points[0].y * cellSize}
                  x2={points[1].x * cellSize}
                  y2={points[1].y * cellSize}
                  stroke="#2563eb"
                  strokeWidth="2.5"
                />
              ) : (
                <polygon
                  points={points.map((p) => `${p.x * cellSize},${p.y * cellSize}`).join(' ')}
                  fill="#93c5fd33"
                  stroke="#1d4ed8"
                  strokeWidth="2"
                />
              )}

              {/* Points & Labels */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle
                    cx={p.x * cellSize}
                    cy={p.y * cellSize}
                    r="4"
                    fill="#1e40af"
                  />
                  {p.label && (
                    <text
                      x={p.x * cellSize + 7}
                      y={p.y * cellSize - 5}
                      fontSize="12"
                      fontWeight="bold"
                      fill="#1e3a8a"
                    >
                      {p.label}
                    </text>
                  )}
                </g>
              ))}
            </>
          )}
        </svg>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 px-1">
        <span>* Mỗi ô vuông nhỏ tương đương 1 cm² trên giấy thi chuẩn Bộ GD&ĐT</span>
        {shape !== 'empty' && (
          <span className="text-blue-700 font-medium">
            {shape === 'rectangle' && 'Hình chữ nhật: Dài 6 ô (6cm), Rộng 3 ô (3cm)'}
            {shape === 'square' && 'Hình vuông: Cạnh 3 ô (3cm)'}
            {shape === 'triangle' && 'Hình tam giác: Đáy 7 ô, chiều cao 3 ô'}
            {shape === 'parallelogram' && 'Hình bình hành: Đáy 5 ô'}
            {shape === 'line' && 'Đoạn thẳng: Độ dài 6 ô (6cm)'}
          </span>
        )}
      </div>
    </div>
  );
};
