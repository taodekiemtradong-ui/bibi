import React, { useState } from 'react';
import { ExamPackage, ScoringItem, ScoringStep } from '../types/exam';
import { PointEditor } from './PointEditor';
import { Check, Edit2, Plus, Trash2, Printer } from 'lucide-react';

interface Props {
  exam: ExamPackage;
  onUpdateScoringGuide: (guide: ScoringItem[]) => void;
  onUpdateQuestionPoints?: (qNum: number, points: number) => void;
}

export const ScoringGuideView: React.FC<Props> = ({
  exam,
  onUpdateScoringGuide,
  onUpdateQuestionPoints,
}) => {
  const { scoringGuide, header, subject, grade, vietnameseWriting } = exam;

  const handlePointChange = (qNum: number, newPoints: number) => {
    const updated = scoringGuide.map((item) =>
      item.questionNumber === qNum ? { ...item, points: newPoints } : item
    );
    onUpdateScoringGuide(updated);
    if (onUpdateQuestionPoints) {
      onUpdateQuestionPoints(qNum, newPoints);
    }
  };

  const handleStepPointChange = (qNum: number, stepIdx: number, newPoints: number) => {
    const updated = scoringGuide.map((item) => {
      if (item.questionNumber !== qNum || !item.steps) return item;
      const newSteps = [...item.steps];
      newSteps[stepIdx] = { ...newSteps[stepIdx], points: newPoints };
      return { ...item, steps: newSteps };
    });
    onUpdateScoringGuide(updated);
  };

  const handleAddStep = (qNum: number) => {
    const updated = scoringGuide.map((item) => {
      if (item.questionNumber !== qNum) return item;
      const currentSteps = item.steps || [];
      return {
        ...item,
        steps: [...currentSteps, { step: 'Ý bổ sung cần đạt', points: 0.25 }],
      };
    });
    onUpdateScoringGuide(updated);
  };

  const handleDeleteStep = (qNum: number, stepIdx: number) => {
    const updated = scoringGuide.map((item) => {
      if (item.questionNumber !== qNum || !item.steps) return item;
      const newSteps = item.steps.filter((_, i) => i !== stepIdx);
      return { ...item, steps: newSteps };
    });
    onUpdateScoringGuide(updated);
  };

  const tnItems = scoringGuide.filter((i) => i.type === 'TN');
  const tlItems = scoringGuide.filter((i) => i.type === 'TL');

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            Hướng dẫn chấm và biểu điểm chi tiết
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Môn: {subject} - Lớp {grade} · Có chỗ sửa điểm trực tiếp từng câu và từng bước giải
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors no-print"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          In đáp án & Biểu điểm
        </button>
      </div>

      {/* Quick Multiple Choice Table */}
      {tnItems.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="font-bold text-xs uppercase tracking-wider text-blue-900 mb-2">
            1. Bảng đáp án trắc nghiệm khách quan
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 font-semibold text-slate-700">
                  <th className="p-2 border border-slate-300 w-24">Câu</th>
                  {tnItems.map((item) => (
                    <th key={item.questionNumber} className="p-2 border border-slate-300">
                      Câu {item.questionNumber}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="font-bold text-blue-800 text-sm bg-blue-50/30">
                  <td className="p-2 border border-slate-300 text-slate-600 font-medium text-xs">Đáp án</td>
                  {tnItems.map((item) => (
                    <td key={item.questionNumber} className="p-2 border border-slate-300">
                      {item.answer}
                    </td>
                  ))}
                </tr>
                <tr className="text-slate-600 bg-white">
                  <td className="p-2 border border-slate-300 font-medium text-xs">Điểm số</td>
                  {tnItems.map((item) => (
                    <td key={item.questionNumber} className="p-1.5 border border-slate-300">
                      <PointEditor
                        points={item.points}
                        onPointsChange={(pts) => handlePointChange(item.questionNumber, pts)}
                        size="sm"
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Essay Detailed Rubric Table */}
      {tlItems.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="font-bold text-xs uppercase tracking-wider text-blue-900 mb-3">
            2. Biểu điểm và hướng dẫn chấm phần tự luận (Có chỗ sửa điểm từng bước)
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-semibold text-center">
                  <th className="p-2.5 border border-slate-300 w-16">Câu</th>
                  <th className="p-2.5 border border-slate-300 text-left">Nội dung yêu cầu cần đạt / Lời giải chi tiết</th>
                  <th className="p-2.5 border border-slate-300 w-28">Điểm thành phần</th>
                  <th className="p-2.5 border border-slate-300 w-28">Tổng điểm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {tlItems.map((item) => (
                  <tr key={item.questionNumber} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 border border-slate-300 text-center font-bold text-slate-800 align-top">
                      Câu {item.questionNumber}
                    </td>
                    <td className="p-3 border border-slate-300 text-slate-800 align-top leading-relaxed">
                      <div className="font-medium text-slate-900 mb-1.5 whitespace-pre-line">
                        {item.explanation}
                      </div>

                      {/* Sub-steps */}
                      {item.steps && item.steps.length > 0 && (
                        <div className="mt-2 pl-3 border-l-2 border-blue-200 space-y-1.5 bg-slate-50 p-2 rounded">
                          <div className="text-[11px] font-semibold text-blue-900 mb-1">
                            Phân bổ điểm chi tiết từng ý:
                          </div>
                          {item.steps.map((st, sIdx) => (
                            <div key={sIdx} className="flex items-center justify-between text-[11px] text-slate-700 gap-2">
                              <span>• {st.step}</span>
                              <div className="flex items-center gap-1 shrink-0 font-sans">
                                <PointEditor
                                  points={st.points}
                                  onPointsChange={(pts) => handleStepPointChange(item.questionNumber, sIdx, pts)}
                                  size="sm"
                                />
                                <button
                                  onClick={() => handleDeleteStep(item.questionNumber, sIdx)}
                                  className="text-slate-400 hover:text-red-500 p-0.5"
                                  title="Xóa ý này"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => handleAddStep(item.questionNumber)}
                        className="mt-2 text-[11px] text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 no-print"
                      >
                        <Plus className="w-3 h-3" /> Thêm bước chấm điểm con
                      </button>
                    </td>
                    <td className="p-3 border border-slate-300 text-center align-top text-slate-500 font-mono">
                      {item.steps && item.steps.length > 0
                        ? item.steps.map((s) => `${s.points}đ`).join(' + ')
                        : `${item.points}đ`}
                    </td>
                    <td className="p-3 border border-slate-300 text-center align-top">
                      <PointEditor
                        points={item.points}
                        onPointsChange={(pts) => handlePointChange(item.questionNumber, pts)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vietnamese Writing Rubric */}
      {vietnameseWriting && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="font-bold text-xs uppercase tracking-wider text-blue-900 mb-2">
            3. Hướng dẫn chấm bài kiểm tra Viết ({vietnameseWriting.points.toFixed(1)} điểm)
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 whitespace-pre-line leading-relaxed font-mono">
            {vietnameseWriting.guidelines}
          </div>
        </div>
      )}
    </div>
  );
};
