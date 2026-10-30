import React from 'react';
import { GradeType } from '../types/exam';
import { VIETNAMESE_STANDARDS } from '../data/curriculumStandards';
import { Check, AlertTriangle, FileText } from 'lucide-react';

interface Props {
  text: string;
  grade: GradeType;
  genre?: 'truyện' | 'thơ' | 'miêu tả' | 'văn bản thông tin';
}

export const WordCounterBadge: React.FC<Props> = ({ text, grade, genre = 'truyện' }) => {
  // Count words accurately for Vietnamese
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  let limits = { min: 280, max: 330, label: '280 – 330 chữ' };

  if (grade === 4) {
    if (genre === 'thơ') limits = VIETNAMESE_STANDARDS.wordCountLimits.grade4.tho;
    else if (genre === 'miêu tả') limits = VIETNAMESE_STANDARDS.wordCountLimits.grade4.mieu_ta;
    else if (genre === 'văn bản thông tin') limits = VIETNAMESE_STANDARDS.wordCountLimits.grade4.thong_tin;
    else limits = VIETNAMESE_STANDARDS.wordCountLimits.grade4.truyen;
  } else if (grade === 5) {
    if (genre === 'thơ') limits = VIETNAMESE_STANDARDS.wordCountLimits.grade5.tho;
    else if (genre === 'miêu tả') limits = VIETNAMESE_STANDARDS.wordCountLimits.grade5.mieu_ta;
    else if (genre === 'văn bản thông tin') limits = VIETNAMESE_STANDARDS.wordCountLimits.grade5.thong_tin;
    else limits = VIETNAMESE_STANDARDS.wordCountLimits.grade5.truyen;
  }

  const isValid = words >= limits.min && words <= limits.max;

  return (
    <div className="inline-flex items-center gap-2 text-xs py-1 px-2.5 rounded-md bg-white border border-slate-200 shadow-2xs">
      <FileText className="w-3.5 h-3.5 text-slate-500" />
      <span className="text-slate-600">Độ dài văn bản:</span>
      <span className="font-mono font-bold text-slate-800">{words} chữ</span>
      <span className="text-slate-400">/ Chuẩn GDPT 2018: {limits.min}-{limits.max} chữ</span>
      {isValid ? (
        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
          <Check className="w-3.5 h-3.5 text-emerald-600" /> Đạt chuẩn
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          {words < limits.min ? `Thiếu ${limits.min - words} chữ` : `Thừa ${words - limits.max} chữ`}
        </span>
      )}
    </div>
  );
};
