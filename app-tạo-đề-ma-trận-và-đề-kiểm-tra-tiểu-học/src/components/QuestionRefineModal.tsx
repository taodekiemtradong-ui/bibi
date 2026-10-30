import React, { useState } from 'react';
import { QuestionItem, ScoringItem } from '../types/exam';
import { Sparkles, Loader2, X, Check } from 'lucide-react';

interface Props {
  question: QuestionItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedQuestion: QuestionItem, updatedRubric?: ScoringItem) => void;
  subject: string;
  grade: number;
}

export const QuestionRefineModal: React.FC<Props> = ({
  question,
  isOpen,
  onClose,
  onSuccess,
  subject,
  grade,
}) => {
  const [instruction, setInstruction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !question) return null;

  const handleRefine = async (customPrompt?: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/refine-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentQuestion: question,
          requestInstruction: customPrompt || instruction || 'Tạo câu hỏi mới tương đương về mức độ nhận thức và điểm số',
          subject,
          grade,
        }),
      });

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.error || 'Lỗi khi tinh chỉnh câu hỏi');
      }

      const { question: newQ, rubric: newRubric } = resData.data;
      onSuccess(newQ, newRubric);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Không thể tạo câu hỏi mới');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-300 rounded-xl max-w-lg w-full shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Đổi mới hoặc Tinh chỉnh Câu {question.number}
            </h3>
          </div>
          <button onClick={onClose} disabled={isLoading} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3.5 text-xs">
          {error && <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded">{error}</div>}

          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <div className="font-semibold text-slate-600 mb-1">Câu hỏi hiện tại ({question.points} điểm - Mức {question.level}):</div>
            <div className="text-slate-800 font-medium">{question.content}</div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Chọn phương án đổi mới nhanh:
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleRefine('Giữ nguyên cấu trúc, đổi số liệu và ngữ cảnh thực tế mới')}
                disabled={isLoading}
                className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded border border-purple-200 text-xs transition-colors"
              >
                🔄 Đổi số liệu mới
              </button>
              <button
                type="button"
                onClick={() => handleRefine('Gắn câu hỏi với tình huống vùng cao Xín Mần hoặc đời sống thực tế')}
                disabled={isLoading}
                className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded border border-purple-200 text-xs transition-colors"
              >
                🌲 Thực tế hóa vùng cao
              </button>
              <button
                type="button"
                onClick={() => handleRefine('Đổi sang dạng toán có hình vẽ minh họa hoặc đố vui')}
                disabled={isLoading}
                className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded border border-purple-200 text-xs transition-colors"
              >
                🧩 Dạng đố vui / Trực quan
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Hoặc nhập yêu cầu riêng của thầy/cô:
            </label>
            <textarea
              rows={2}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Ví dụ: Đổi câu này thành câu hỏi trắc nghiệm 4 lựa chọn về phân số..."
              className="w-full border border-slate-300 rounded-md p-2 bg-white text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium text-xs"
          >
            Hủy
          </button>
          <button
            onClick={() => handleRefine()}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium text-xs shadow-xs transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            Tạo câu hỏi mới
          </button>
        </div>
      </div>
    </div>
  );
};
