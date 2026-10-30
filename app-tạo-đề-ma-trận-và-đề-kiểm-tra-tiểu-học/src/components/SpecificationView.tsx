import React from 'react';
import { ExamPackage, SpecificationItem } from '../types/exam';
import { PointEditor } from './PointEditor';
import { FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  exam: ExamPackage;
  onUpdateSpec: (specs: SpecificationItem[]) => void;
  onUpdateQuestionPoints?: (qNum: number, points: number) => void;
}

export const SpecificationView: React.FC<Props> = ({ exam, onUpdateSpec, onUpdateQuestionPoints }) => {
  const { specifications, header, grade, subject } = exam;

  const handlePointChange = (id: number, questionNumberStr: string, newPoints: number) => {
    const updated = specifications.map((s) => (s.id === id ? { ...s, points: newPoints } : s));
    onUpdateSpec(updated);

    const qNum = parseInt(questionNumberStr.replace(/\D/g, ''), 10);
    if (!isNaN(qNum) && onUpdateQuestionPoints) {
      onUpdateQuestionPoints(qNum, newPoints);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            Bản đặc tả ma trận đề kiểm tra định kì
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Môn: {subject} - Lớp {grade} · Khung năng lực và yêu cầu cần đạt theo Chương trình GDPT 2018
          </p>
        </div>
        <div className="text-xs text-slate-500">
          Tổng số: <b className="text-slate-800">{specifications.length}</b> tiêu chí đặc tả
        </div>
      </div>

      <div className="border border-slate-300 rounded-lg overflow-x-auto bg-white shadow-xs">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-semibold text-center">
              <th className="p-2 border-r border-slate-300 w-12">TT</th>
              <th className="p-2 border-r border-slate-300 text-left w-48">Mạch kiến thức / Kĩ năng</th>
              <th className="p-2 border-r border-slate-300 text-left">Yêu cầu cần đạt chuẩn GDPT 2018</th>
              <th className="p-2 border-r border-slate-300 w-24">Mức độ</th>
              <th className="p-2 border-r border-slate-300 w-20">Hình thức</th>
              <th className="p-2 border-r border-slate-300 w-28">Câu số & Điểm</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {specifications.map((spec, index) => (
              <tr key={spec.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-2.5 text-center border-r border-slate-200 font-medium text-slate-500">
                  {index + 1}
                </td>
                <td className="p-2.5 border-r border-slate-200 font-medium text-slate-800">
                  {spec.topic}
                </td>
                <td className="p-2.5 border-r border-slate-200 text-slate-700 leading-relaxed">
                  {spec.objective}
                </td>
                <td className="p-2.5 text-center border-r border-slate-200">
                  <span
                    className={`font-semibold text-[11px] px-2 py-0.5 rounded ${
                      spec.level === 'Mức 1'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : spec.level === 'Mức 2'
                        ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                        : 'bg-purple-50 text-purple-800 border border-purple-200'
                    }`}
                  >
                    {spec.level}
                  </span>
                </td>
                <td className="p-2.5 text-center border-r border-slate-200 font-medium">
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded ${
                      spec.type === 'TN'
                        ? 'bg-amber-50 text-amber-900 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    }`}
                  >
                    {spec.type === 'TN' ? 'Trắc nghiệm' : 'Tự luận'}
                  </span>
                </td>
                <td className="p-2.5 text-center border-r border-slate-200">
                  <div className="font-semibold text-slate-800 mb-1">{spec.questionNumber}</div>
                  <PointEditor
                    points={spec.points}
                    onPointsChange={(pts) => handlePointChange(spec.id, spec.questionNumber, pts)}
                    size="sm"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
