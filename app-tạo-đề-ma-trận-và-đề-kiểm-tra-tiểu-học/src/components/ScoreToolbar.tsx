import React from 'react';
import { MatrixSummary, QuestionItem } from '../types/exam';
import { AlertCircle, CheckCircle2, Sliders, RefreshCw, Scale } from 'lucide-react';

interface Props {
  summary: MatrixSummary;
  questions: QuestionItem[];
  onAutoBalance: () => void;
  onResetStandard: () => void;
  isQuickEditMode: boolean;
  onToggleQuickEdit: () => void;
}

export const ScoreToolbar: React.FC<Props> = ({
  summary,
  questions,
  onAutoBalance,
  onResetStandard,
  isQuickEditMode,
  onToggleQuickEdit,
}) => {
  // Calculate dynamic totals from actual questions
  const currentTotal = Number(questions.reduce((acc, q) => acc + (q.points || 0), 0).toFixed(2));
  const currentTN = Number(questions.filter((q) => q.type === 'TN').reduce((acc, q) => acc + (q.points || 0), 0).toFixed(2));
  const currentTL = Number(questions.filter((q) => q.type === 'TL').reduce((acc, q) => acc + (q.points || 0), 0).toFixed(2));

  const currentL1 = Number(questions.filter((q) => q.level === 1).reduce((acc, q) => acc + (q.points || 0), 0).toFixed(2));
  const currentL2 = Number(questions.filter((q) => q.level === 2).reduce((acc, q) => acc + (q.points || 0), 0).toFixed(2));
  const currentL3 = Number(questions.filter((q) => q.level === 3).reduce((acc, q) => acc + (q.points || 0), 0).toFixed(2));

  const isTotalValid = Math.abs(currentTotal - 10.0) < 0.05 || Math.abs(currentTotal - 7.0) < 0.05; // 10.0đ (Toán/LS&ĐL/Khoa học) hoặc 7.0đ (Đọc hiểu TV)
  const tnPercent = currentTotal > 0 ? Math.round((currentTN / currentTotal) * 100) : 0;
  const tlPercent = currentTotal > 0 ? Math.round((currentTL / currentTotal) * 100) : 0;

  return (
    <div className="bg-white border-y border-slate-200 px-4 py-2.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Score Metrics */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">Tổng điểm đề:</span>
            <span
              className={`font-mono font-bold text-sm px-2 py-0.5 rounded ${
                isTotalValid
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-900 border border-amber-300 animate-pulse'
              }`}
            >
              {currentTotal.toFixed(1)} / 10.0 điểm
            </span>
            {isTotalValid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <span className="flex items-center gap-1 text-amber-700 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                (Lệch {(10.0 - currentTotal).toFixed(1)}đ)
              </span>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-600 border-l border-slate-200 pl-3">
            <span>Trắc nghiệm: <b className="text-slate-800">{currentTN.toFixed(1)}đ</b> ({tnPercent}%)</span>
            <span className="text-slate-300">|</span>
            <span>Tự luận: <b className="text-slate-800">{currentTL.toFixed(1)}đ</b> ({tlPercent}%)</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-slate-500 border-l border-slate-200 pl-3">
            <span>Mức 1: <b className="text-blue-700">{currentL1.toFixed(1)}đ</b></span>
            <span>·</span>
            <span>Mức 2: <b className="text-indigo-700">{currentL2.toFixed(1)}đ</b></span>
            <span>·</span>
            <span>Mức 3: <b className="text-purple-700">{currentL3.toFixed(1)}đ</b></span>
          </div>
        </div>

        {/* Right: Score Editing Actions */}
        <div className="flex items-center gap-2">
          {!isTotalValid && (
            <button
              onClick={onAutoBalance}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-900 bg-amber-100 hover:bg-amber-200 rounded border border-amber-300 transition-colors"
              title="Tự động chia đều phần chênh lệch để đưa tổng điểm về đúng 10.0"
            >
              <Scale className="w-3.5 h-3.5 text-amber-800" />
              Cân đối về 10.0đ
            </button>
          )}

          <button
            onClick={onResetStandard}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
            title="Khôi phục phân bổ chuẩn: 6.0đ TN (60%) - 4.0đ TL (40%) và tỉ lệ 50-30-20"
          >
            <RefreshCw className="w-3 h-3 text-slate-500" />
            Chuẩn 60-40%
          </button>

          <button
            onClick={onToggleQuickEdit}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors ${
              isQuickEditMode
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            {isQuickEditMode ? 'Đang sửa điểm...' : 'Chỗ sửa điểm'}
          </button>
        </div>
      </div>
    </div>
  );
};
