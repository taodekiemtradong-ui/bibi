import React, { useState } from 'react';
import { ExamPackage, QuestionItem, SchoolHeader } from '../types/exam';
import { PointEditor } from './PointEditor';
import { GridGeometryCanvas } from './GridGeometryCanvas';
import { WordCounterBadge } from './WordCounterBadge';
import { Edit2, Sparkles, Plus, Trash2, Printer, Check, Copy } from 'lucide-react';

interface Props {
  exam: ExamPackage;
  onUpdateHeader: (header: SchoolHeader) => void;
  onUpdateQuestions: (questions: QuestionItem[]) => void;
  onRefineQuestionWithAI?: (question: QuestionItem) => void;
  onOpenGridEditor?: (question: QuestionItem) => void;
}

export const ExamPaperView: React.FC<Props> = ({
  exam,
  onUpdateHeader,
  onUpdateQuestions,
  onRefineQuestionWithAI,
  onOpenGridEditor,
}) => {
  const { header, questions, readingPassage, vietnameseWriting, oralReading, grade, subject } = exam;
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [headerForm, setHeaderForm] = useState<SchoolHeader>(header);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleHeaderSave = () => {
    onUpdateHeader(headerForm);
    setIsEditingHeader(false);
  };

  const handlePointChange = (qId: number, newPoints: number) => {
    const updated = questions.map((q) => (q.id === qId ? { ...q, points: newPoints } : q));
    onUpdateQuestions(updated);
  };

  const handleContentChange = (qId: number, newContent: string) => {
    const updated = questions.map((q) => (q.id === qId ? { ...q, content: newContent } : q));
    onUpdateQuestions(updated);
  };

  const handleOptionChange = (qId: number, optIndex: number, newOpt: string) => {
    const updated = questions.map((q) => {
      if (q.id !== qId || !q.options) return q;
      const newOpts = [...q.options];
      newOpts[optIndex] = newOpt;
      return { ...q, options: newOpts };
    });
    onUpdateQuestions(updated);
  };

  const tnQuestions = questions.filter((q) => q.type === 'TN');
  const tlQuestions = questions.filter((q) => q.type === 'TL');

  const copyToClipboard = () => {
    const textContent = `${header.governingBody}\n${header.schoolName}\n${header.examTitle}\nNĂM HỌC ${header.academicYear}\nMÔN: ${header.subject} - LỚP ${grade}\n\n` +
      questions.map(q => `Câu ${q.number} (${q.points}đ): ${q.content}\n${q.options ? q.options.join('\n') : ''}\n`).join('\n');
    navigator.clipboard.writeText(textContent);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar for Exam Paper */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 no-print">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditingHeader(!isEditingHeader)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-500" />
            {isEditingHeader ? 'Đóng sửa tiêu đề' : 'Sửa tên trường / Tiêu đề đề thi'}
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            In đề thi (Khổ A4)
          </button>
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            {copiedNotification ? 'Đã sao chép!' : 'Sao chép nội dung'}
          </button>
        </div>
        <div className="text-xs text-slate-500 italic">
          * Nhấp vào ô điểm để sửa điểm trực tiếp trên từng câu hỏi
        </div>
      </div>

      {/* Header Edit Panel */}
      {isEditingHeader && (
        <div className="p-4 bg-slate-50 border border-slate-300 rounded-lg text-xs space-y-3 no-print">
          <div className="font-semibold text-slate-800 text-sm">Chỉnh sửa thông tin đơn vị và tiêu đề đề thi:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Đơn vị chủ quản:</label>
              <input
                type="text"
                value={headerForm.governingBody}
                onChange={(e) => setHeaderForm({ ...headerForm, governingBody: e.target.value })}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Tên trường học:</label>
              <input
                type="text"
                value={headerForm.schoolName}
                onChange={(e) => setHeaderForm({ ...headerForm, schoolName: e.target.value })}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Tên kì kiểm tra:</label>
              <input
                type="text"
                value={headerForm.examTitle}
                onChange={(e) => setHeaderForm({ ...headerForm, examTitle: e.target.value })}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Năm học:</label>
              <input
                type="text"
                value={headerForm.academicYear}
                onChange={(e) => setHeaderForm({ ...headerForm, academicYear: e.target.value })}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Thời gian làm bài:</label>
              <input
                type="text"
                value={headerForm.duration}
                onChange={(e) => setHeaderForm({ ...headerForm, duration: e.target.value })}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-800"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsEditingHeader(false)}
              className="px-3 py-1 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100"
            >
              Hủy
            </button>
            <button
              onClick={handleHeaderSave}
              className="px-4 py-1 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      )}

      {/* Printable Sheet (Standard A4 styling) */}
      <div className="bg-white border border-slate-300 rounded-lg p-6 sm:p-10 shadow-xs text-slate-900 font-serif print-sheet">
        {/* Header Section */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-300">
          <div className="text-center font-sans">
            <div className="text-xs uppercase tracking-wider text-slate-700">{header.governingBody}</div>
            <div className="text-sm font-bold uppercase tracking-wide text-slate-900 mt-0.5">{header.schoolName}</div>
            <div className="text-xs text-slate-400 mt-1">------------------------</div>
          </div>
          <div className="text-center font-sans">
            <div className="text-sm font-bold uppercase tracking-wide text-slate-900">{header.examTitle}</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">NĂM HỌC {header.academicYear}</div>
            <div className="text-xs font-bold uppercase text-blue-900 mt-0.5">
              MÔN: {subject.toUpperCase()} - LỚP {grade}
            </div>
            <div className="text-xs italic text-slate-600 mt-0.5">(Thời gian: {header.duration})</div>
          </div>
        </div>

        {/* Student Info & Score Matrix Box */}
        <div className="my-4 border border-slate-400 font-sans text-xs grid grid-cols-12 divide-x divide-slate-400">
          <div className="col-span-3 p-3 flex flex-col justify-between h-24">
            <div className="font-bold text-slate-900">Điểm số:</div>
            <div className="italic text-slate-600">Bằng số: ....................</div>
            <div className="italic text-slate-600">Bằng chữ: ..................</div>
          </div>
          <div className="col-span-5 p-3 flex flex-col justify-between h-24">
            <div className="font-bold text-slate-900">Lời nhận xét của thầy cô giáo:</div>
            <div className="text-slate-400 text-[11px] leading-relaxed">
              ....................................................................................<br />
              ....................................................................................
            </div>
          </div>
          <div className="col-span-4 p-3 flex flex-col justify-between h-24">
            <div className="space-y-1.5">
              <div><b className="text-slate-800">Họ và tên:</b> ....................................</div>
              <div><b className="text-slate-800">Lớp:</b> ................ <b className="text-slate-800 ml-2">Trường:</b> ................</div>
              <div className="text-[11px] text-slate-500 italic">Giám khảo: .......................................</div>
            </div>
          </div>
        </div>

        {/* Môn Tiếng Việt: Đọc thành tiếng */}
        {oralReading && (
          <div className="mb-6 p-3 bg-amber-50/50 border border-amber-200 rounded text-xs font-sans">
            <div className="font-bold text-amber-950 uppercase tracking-wide mb-1">
              A. KIỂM TRA ĐỌC THÀNH TIẾNG ({oralReading.points.toFixed(1)} ĐIỂM)
            </div>
            <div className="text-slate-700 italic leading-relaxed">
              {oralReading.instructions}
            </div>
          </div>
        )}

        {/* Môn Tiếng Việt: Bài đọc hiểu ngoài SGK */}
        {readingPassage && (
          <div className="mb-6 p-4 bg-slate-50 border border-slate-300 rounded text-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200 font-sans">
              <span className="font-bold uppercase text-xs tracking-wider text-blue-900">
                B. ĐỌC HIỂU VÀ KIẾN THỨC TIẾNG VIỆT (7.0 ĐIỂM)
              </span>
              <WordCounterBadge text={readingPassage.content} grade={grade} genre={readingPassage.genre} />
            </div>

            <div className="text-center mb-3">
              <h4 className="font-bold text-base tracking-wide uppercase">{readingPassage.title}</h4>
              <p className="text-xs text-slate-500 italic mt-0.5">Tác giả: {readingPassage.author}</p>
            </div>

            <div className="text-sm leading-relaxed text-justify space-y-2 indent-6">
              {readingPassage.content.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}

        {/* Questions Section */}
        <div className="space-y-5 text-sm leading-relaxed">
          {/* Section title for general subjects */}
          {!readingPassage && (
            <div className="font-sans font-bold text-xs uppercase tracking-wider text-slate-700 pb-1 border-b border-slate-300">
              NỘI DUNG ĐỀ KIỂM TRA
            </div>
          )}

          {/* Render Questions */}
          {questions.map((q) => (
            <div key={q.id} className="group relative pb-3 border-b border-dashed border-slate-200 last:border-none">
              {/* Question Header & Point Editor */}
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="flex-1">
                  <span className="font-bold font-sans text-slate-900">
                    Câu {q.number}.
                  </span>{' '}
                  <span className="font-sans text-xs text-slate-500 mr-2">
                    [{q.type === 'TN' ? 'Trắc nghiệm' : 'Tự luận'} - Mức {q.level}]
                  </span>
                  <span className="text-slate-900 select-text whitespace-pre-line">{q.content}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0 font-sans">
                  <PointEditor
                    points={q.points}
                    onPointsChange={(pts) => handlePointChange(q.id, pts)}
                  />

                  {onRefineQuestionWithAI && (
                    <button
                      onClick={() => onRefineQuestionWithAI(q)}
                      className="no-print p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded"
                      title="Dùng AI đổi câu hỏi tương đương hoặc tinh chỉnh đề"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Multiple Choice Options */}
              {q.options && q.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pl-4 mt-2 font-sans text-xs">
                  {q.options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className="p-1.5 rounded bg-slate-50/70 border border-slate-200 hover:bg-blue-50/50 hover:border-blue-200 transition-colors"
                    >
                      <span className="text-slate-800">{opt}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Grid Geometry Canvas Requirement for Math */}
              {q.gridRequirement && (
                <div className="mt-2">
                  <GridGeometryCanvas
                    data={q.gridDetails}
                    isEditable={true}
                    onChange={(updatedGrid) => {
                      const updated = questions.map((item) =>
                        item.id === q.id ? { ...item, gridDetails: updatedGrid } : item
                      );
                      onUpdateQuestions(updated);
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Vietnamese Writing Section */}
        {vietnameseWriting && (
          <div className="mt-8 pt-4 border-t-2 border-slate-300 font-sans">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold uppercase text-xs tracking-wider text-blue-900">
                C. KIỂM TRA VIẾT ({vietnameseWriting.points.toFixed(1)} ĐIỂM)
              </span>
              <span className="text-xs text-slate-500 italic">Đánh giá kĩ năng viết đoạn văn / bài văn</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 font-serif leading-relaxed mb-3">
              {vietnameseWriting.prompt}
            </div>

            {/* Simulated Elementary Lined Paper for Student Writing */}
            <div className="border border-indigo-200 bg-sky-50/20 p-4 rounded-md space-y-4">
              <div className="text-[11px] text-indigo-800 italic font-sans flex items-center justify-between">
                <span>[Khung làm bài viết ô ly tiểu học chuẩn Bộ Giáo dục và Đào tạo]</span>
                <span>(Học sinh trình bày bài viết vào khung bên dưới)</span>
              </div>
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border-b border-indigo-200 border-dashed h-5" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer info on printed test */}
        <div className="mt-8 pt-4 border-t border-slate-300 text-center font-sans text-xs text-slate-500 italic flex items-center justify-between">
          <span>* Cán bộ coi thi không giải thích gì thêm</span>
          <span>HẾT</span>
          <span>UBND Xã Xín Mần - Năm học 2026-2027</span>
        </div>
      </div>
    </div>
  );
};
