import React, { useState } from 'react';
import { ExamPackage, MatrixRow } from '../types/exam';
import { PointEditor } from './PointEditor';
import { CURRICULUM_STANDARDS } from '../data/curriculumStandards';
import { CheckCircle2, AlertTriangle, Info, Edit3 } from 'lucide-react';

interface Props {
  exam: ExamPackage;
  onUpdateMatrix: (updatedMatrix: MatrixRow[]) => void;
}

export const MatrixView: React.FC<Props> = ({ exam, onUpdateMatrix }) => {
  const { header, matrix, matrixSummary, grade, subject, semester } = exam;
  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  const curriculumKey = `${subject}-${grade}`;
  const rule = CURRICULUM_STANDARDS[curriculumKey];
  const semesterRule = rule?.semesterTopics?.[semester];

  // Recalculate summary totals dynamically
  let totalLevel1Points = 0;
  let totalLevel2Points = 0;
  let totalLevel3Points = 0;
  let totalTNPoints = 0;
  let totalTLPoints = 0;
  let grandTotalPoints = 0;
  let grandTotalQuestions = 0;

  matrix.forEach((row) => {
    const l1Points = (row.level1TN.points || 0) + (row.level1TL.points || 0);
    const l2Points = (row.level2TN.points || 0) + (row.level2TL.points || 0);
    const l3Points = (row.level3TN.points || 0) + (row.level3TL.points || 0);

    totalLevel1Points += l1Points;
    totalLevel2Points += l2Points;
    totalLevel3Points += l3Points;

    totalTNPoints += (row.level1TN.points || 0) + (row.level2TN.points || 0) + (row.level3TN.points || 0);
    totalTLPoints += (row.level1TL.points || 0) + (row.level2TL.points || 0) + (row.level3TL.points || 0);

    grandTotalPoints += row.totalPoints;
    grandTotalQuestions += row.totalQuestions;
  });

  const l1Percent = grandTotalPoints > 0 ? Math.round((totalLevel1Points / grandTotalPoints) * 100) : 0;
  const l2Percent = grandTotalPoints > 0 ? Math.round((totalLevel2Points / grandTotalPoints) * 100) : 0;
  const l3Percent = grandTotalPoints > 0 ? Math.round((totalLevel3Points / grandTotalPoints) * 100) : 0;

  const tnPercent = grandTotalPoints > 0 ? Math.round((totalTNPoints / grandTotalPoints) * 100) : 0;
  const tlPercent = grandTotalPoints > 0 ? Math.round((totalTLPoints / grandTotalPoints) * 100) : 0;

  const handleCellChange = (
    rowId: string,
    field: 'level1TN' | 'level1TL' | 'level2TN' | 'level2TL' | 'level3TN' | 'level3TL',
    subfield: 'questions' | 'points',
    val: number
  ) => {
    const updated = matrix.map((row) => {
      if (row.id !== rowId) return row;
      const newRow = { ...row };
      newRow[field] = {
        ...newRow[field],
        [subfield]: val,
      };

      // Recalculate row totals
      const totalQ =
        newRow.level1TN.questions +
        newRow.level1TL.questions +
        newRow.level2TN.questions +
        newRow.level2TL.questions +
        newRow.level3TN.questions +
        newRow.level3TL.questions;

      const totalP = Number(
        (
          newRow.level1TN.points +
          newRow.level1TL.points +
          newRow.level2TN.points +
          newRow.level2TL.points +
          newRow.level3TN.points +
          newRow.level3TL.points
        ).toFixed(2)
      );

      newRow.totalQuestions = totalQ;
      newRow.totalPoints = totalP;
      newRow.percentage = grandTotalPoints > 0 ? Math.round((totalP / (grandTotalPoints || 10)) * 100) : 0;
      return newRow;
    });

    onUpdateMatrix(updated);
  };

  return (
    <div className="space-y-4">
      {/* Curriculum Benchmark Callout */}
      {rule && (
        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs flex items-start gap-2 text-blue-900">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-blue-950">
              Quy định Chương trình GDPT 2018 đối với môn {subject} - Lớp {grade} ({semester}):
            </div>
            <div className="text-blue-800 flex flex-wrap gap-x-4 gap-y-0.5">
              <span>· Tỉ lệ các mức: <b>50% (Mức 1) - 30% (Mức 2) - 20% (Mức 3)</b></span>
              <span>· Hình thức: <b>Trắc nghiệm 60% (6.0đ) - Tự luận 40% (4.0đ)</b></span>
              <span>· Thời lượng môn học: <b>{rule.totalPeriods} tiết/năm</b></span>
            </div>
            {semesterRule && (
              <div className="text-blue-700 flex flex-wrap gap-x-3 text-[11px] pt-0.5">
                {semesterRule.map((topic, i) => (
                  <span key={i}>
                    • {topic.name}: <b>{topic.targetPercent}%</b> {topic.actualPeriods ? `(${topic.actualPeriods})` : ''}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="border border-slate-300 rounded-lg overflow-x-auto bg-white shadow-xs">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-semibold text-center">
              <th rowSpan={2} className="p-2 border-r border-slate-300 w-10">TT</th>
              <th rowSpan={2} className="p-2 border-r border-slate-300 text-left min-w-[220px]">
                Mạch kiến thức / Chủ đề
              </th>
              <th colSpan={2} className="p-2 border-r border-slate-300 bg-blue-50/80 text-blue-900">
                Mức 1 (Chuẩn 50%)
              </th>
              <th colSpan={2} className="p-2 border-r border-slate-300 bg-indigo-50/80 text-indigo-900">
                Mức 2 (Chuẩn 30%)
              </th>
              <th colSpan={2} className="p-2 border-r border-slate-300 bg-purple-50/80 text-purple-900">
                Mức 3 (Chuẩn 20%)
              </th>
              <th colSpan={2} className="p-2 border-r border-slate-300 bg-slate-200">Tổng cộng</th>
              <th rowSpan={2} className="p-2 w-16">Tỉ lệ %</th>
            </tr>
            <tr className="bg-slate-50 text-slate-600 border-b border-slate-300 text-center font-medium text-[11px]">
              <th className="p-1 border-r border-slate-200 w-14">TNKQ</th>
              <th className="p-1 border-r border-slate-300 w-14">TL</th>
              <th className="p-1 border-r border-slate-200 w-14">TNKQ</th>
              <th className="p-1 border-r border-slate-300 w-14">TL</th>
              <th className="p-1 border-r border-slate-200 w-14">TNKQ</th>
              <th className="p-1 border-r border-slate-300 w-14">TL</th>
              <th className="p-1 border-r border-slate-200 w-14">Số câu</th>
              <th className="p-1 border-r border-slate-300 w-14">Điểm</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {matrix.map((row, idx) => (
              <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-2 text-center border-r border-slate-200 font-medium text-slate-500">
                  {idx + 1}
                </td>
                <td className="p-2 border-r border-slate-200 font-medium text-slate-800">
                  <div>{row.topic}</div>
                  {row.periodRatio && (
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Thời lượng: {row.periodRatio}
                    </div>
                  )}
                </td>

                {/* Level 1 TN */}
                <td className="p-2 text-center border-r border-slate-200 bg-blue-50/20">
                  <div className="font-semibold text-slate-800">{row.level1TN.questions}c</div>
                  <div className="text-[11px] text-blue-700 font-mono">{row.level1TN.points.toFixed(1)}đ</div>
                </td>
                {/* Level 1 TL */}
                <td className="p-2 text-center border-r border-slate-200 bg-blue-50/20">
                  <div className="font-semibold text-slate-800">{row.level1TL.questions}c</div>
                  <div className="text-[11px] text-blue-700 font-mono">{row.level1TL.points.toFixed(1)}đ</div>
                </td>

                {/* Level 2 TN */}
                <td className="p-2 text-center border-r border-slate-200 bg-indigo-50/20">
                  <div className="font-semibold text-slate-800">{row.level2TN.questions}c</div>
                  <div className="text-[11px] text-indigo-700 font-mono">{row.level2TN.points.toFixed(1)}đ</div>
                </td>
                {/* Level 2 TL */}
                <td className="p-2 text-center border-r border-slate-200 bg-indigo-50/20">
                  <div className="font-semibold text-slate-800">{row.level2TL.questions}c</div>
                  <div className="text-[11px] text-indigo-700 font-mono">{row.level2TL.points.toFixed(1)}đ</div>
                </td>

                {/* Level 3 TN */}
                <td className="p-2 text-center border-r border-slate-200 bg-purple-50/20">
                  <div className="font-semibold text-slate-800">{row.level3TN.questions}c</div>
                  <div className="text-[11px] text-purple-700 font-mono">{row.level3TN.points.toFixed(1)}đ</div>
                </td>
                {/* Level 3 TL */}
                <td className="p-2 text-center border-r border-slate-200 bg-purple-50/20">
                  <div className="font-semibold text-slate-800">{row.level3TL.questions}c</div>
                  <div className="text-[11px] text-purple-700 font-mono">{row.level3TL.points.toFixed(1)}đ</div>
                </td>

                {/* Totals */}
                <td className="p-2 text-center border-r border-slate-200 font-bold text-slate-900 bg-slate-50">
                  {row.totalQuestions}
                </td>
                <td className="p-2 text-center border-r border-slate-200 font-bold text-blue-900 bg-slate-50">
                  {row.totalPoints.toFixed(1)}
                </td>
                <td className="p-2 text-center font-bold text-slate-800">
                  {row.percentage}%
                </td>
              </tr>
            ))}

            {/* Total Row according to Levels */}
            <tr className="bg-slate-100 font-semibold text-slate-900 border-t-2 border-slate-300">
              <td colSpan={2} className="p-2 text-center border-r border-slate-300">
                Tổng điểm theo Mức độ nhận thức
              </td>
              <td colSpan={2} className="p-2 text-center border-r border-slate-300 text-blue-900 bg-blue-100/50">
                <div>{totalLevel1Points.toFixed(1)} điểm</div>
                <div className="text-[10px] text-blue-700 font-normal">({l1Percent}% / Chuẩn 50%)</div>
              </td>
              <td colSpan={2} className="p-2 text-center border-r border-slate-300 text-indigo-900 bg-indigo-100/50">
                <div>{totalLevel2Points.toFixed(1)} điểm</div>
                <div className="text-[10px] text-indigo-700 font-normal">({l2Percent}% / Chuẩn 30%)</div>
              </td>
              <td colSpan={2} className="p-2 text-center border-r border-slate-300 text-purple-900 bg-purple-100/50">
                <div>{totalLevel3Points.toFixed(1)} điểm</div>
                <div className="text-[10px] text-purple-700 font-normal">({l3Percent}% / Chuẩn 20%)</div>
              </td>
              <td className="p-2 text-center border-r border-slate-300 font-bold">
                {grandTotalQuestions}
              </td>
              <td className="p-2 text-center border-r border-slate-300 font-bold text-blue-900 text-sm">
                {grandTotalPoints.toFixed(1)}đ
              </td>
              <td className="p-2 text-center font-bold">
                100%
              </td>
            </tr>

            {/* Ratio by Form (Multiple Choice vs Essay) */}
            <tr className="bg-slate-50 text-slate-700 text-[11px] font-medium border-t border-slate-300">
              <td colSpan={2} className="p-2 text-center border-r border-slate-300">
                Tổng hợp theo hình thức
              </td>
              <td colSpan={6} className="p-2 border-r border-slate-300 text-center">
                <div className="flex items-center justify-center gap-6">
                  <span>Trắc nghiệm khách quan: <b>{totalTNPoints.toFixed(1)} điểm</b> ({tnPercent}% / Chuẩn 60%)</span>
                  <span className="text-slate-300">|</span>
                  <span>Tự luận: <b>{totalTLPoints.toFixed(1)} điểm</b> ({tlPercent}% / Chuẩn 40%)</span>
                </div>
              </td>
              <td colSpan={3} className="p-2 text-center font-semibold text-slate-800">
                Thang điểm 10.0
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
