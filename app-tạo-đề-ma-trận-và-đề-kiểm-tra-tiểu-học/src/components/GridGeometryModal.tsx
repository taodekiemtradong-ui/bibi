import React, { useState } from 'react';
import { GridDrawing } from '../types/exam';
import { GridGeometryCanvas } from './GridGeometryCanvas';
import { X, Check, Square, Ruler, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: GridDrawing;
  onSave: (gridData: GridDrawing) => void;
  questionNumber?: number;
}

export const GridGeometryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  questionNumber,
}) => {
  const [gridData, setGridData] = useState<GridDrawing>(
    initialData || {
      rows: 6,
      cols: 12,
      shapeType: 'rectangle',
      instructions: 'Vẽ hình chữ nhật trên lưới ô vuông tiểu học',
    }
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-300 rounded-xl max-w-2xl w-full shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Square className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Công cụ vẽ hình trên lưới ô vuông {questionNumber ? `- Câu ${questionNumber}` : ''}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 space-y-1">
            <div className="font-semibold">Quy chuẩn GDPT 2018 cho môn Toán Tiểu học (Lớp 1 - 5):</div>
            <p className="text-blue-800">
              Sử dụng lưới ô ly chuẩn (mỗi ô tương đương 1 cm²) để học sinh rèn luyện kĩ năng vẽ đoạn thẳng, hình chữ nhật, hình tam giác, xác định góc vuông, song song, tính chu vi và diện tích trực quan.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Lời chỉ dẫn cho học sinh:
            </label>
            <input
              type="text"
              value={gridData.instructions || ''}
              onChange={(e) => setGridData({ ...gridData, instructions: e.target.value })}
              placeholder="Ví dụ: Vẽ hình bình hành ABCD có độ dài đáy 6 ô vuông và chiều cao 3 ô vuông..."
              className="w-full border border-slate-300 rounded-md p-2 bg-white text-slate-800"
            />
          </div>

          <div>
            <GridGeometryCanvas
              data={gridData}
              isEditable={true}
              onChange={(updated) => setGridData(updated)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium text-xs"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              onSave(gridData);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            Lưu vào câu hỏi đề thi
          </button>
        </div>
      </div>
    </div>
  );
};
