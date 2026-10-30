import React, { useState } from 'react';
import { BookSeriesType, ExamPackage, GradeType, SemesterType, SubjectType } from '../types/exam';
import { Sparkles, Loader2, X, Check, HelpCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newExam: ExamPackage) => void;
  currentSchoolName: string;
  currentGoverningBody: string;
}

export const AIGeneratorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  currentSchoolName,
  currentGoverningBody,
}) => {
  const [subject, setSubject] = useState<SubjectType>('Toán');
  const [grade, setGrade] = useState<GradeType>(4);
  const [semester, setSemester] = useState<SemesterType>('Giữa Học kì I');
  const [bookSeries, setBookSeries] = useState<BookSeriesType>('Kết nối tri thức với cuộc sống');
  const [schoolName, setSchoolName] = useState(currentSchoolName || 'TRƯỜNG PTDTBT TH CHÍ CÀ');
  const [governingBody, setGoverningBody] = useState(currentGoverningBody || 'UBND XÃ XÍN MẦN');
  const [customNotes, setCustomNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          grade,
          semester,
          examType: semester,
          schoolName,
          governingBody,
          bookSeries,
          customNotes,
        }),
      });

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.error || 'Lỗi khi tạo đề bằng AI');
      }

      const generated = resData.data;

      // Construct a standardized ExamPackage
      const newPackage: ExamPackage = {
        id: `ai-exam-${Date.now()}`,
        header: generated.header || {
          governingBody,
          schoolName,
          examTitle: `ĐỀ KIỂM TRA ĐỊNH KÌ ${semester.toUpperCase()}`,
          academicYear: '2026 - 2027',
          subject,
          duration: subject === 'Toán' ? '40 phút' : subject === 'Tiếng Việt' ? '70 phút' : '40 phút',
        },
        grade,
        subject,
        semester,
        bookSeries,
        matrix: generated.matrix || [],
        matrixSummary: generated.matrixSummary || {
          level1Points: 5.0,
          level2Points: 3.0,
          level3Points: 2.0,
          tnPoints: 6.0,
          tlPoints: 4.0,
          totalPoints: 10.0,
        },
        specifications: generated.specifications || [],
        questions: (generated.questions || []).map((q: any, i: number) => ({
          ...q,
          id: q.id || i + 1,
          number: q.number || i + 1,
        })),
        scoringGuide: generated.scoringGuide || [],
        readingPassage: generated.readingPassage,
        oralReading: generated.oralReading,
        vietnameseWriting: generated.vietnameseWriting,
        notes: customNotes || `Tạo bởi Chuyên gia AI theo chuẩn GDPT 2018 (${semester})`,
      };

      onSuccess(newPackage);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Không thể tạo đề, vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-300 rounded-xl max-w-xl w-full shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Tạo Đề Kiểm Tra & Ma Trận Mới Bằng AI
              </h3>
              <p className="text-xs text-slate-500">
                Tự động xây dựng Ma trận (50-30-20%), Bản đặc tả, Đề thi chuẩn và Hướng dẫn chấm
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-600 p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Môn kiểm tra:</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectType)}
                className="w-full border border-slate-300 rounded-md px-2.5 py-1.5 bg-white text-slate-800"
              >
                <option value="Toán">Toán</option>
                <option value="Tiếng Việt">Tiếng Việt</option>
                <option value="Lịch sử & Địa lí">Lịch sử & Địa lí</option>
                <option value="Khoa học">Khoa học</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Khối lớp:</label>
              <select
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value) as GradeType)}
                className="w-full border border-slate-300 rounded-md px-2.5 py-1.5 bg-white text-slate-800"
              >
                <option value={1}>Lớp 1</option>
                <option value={2}>Lớp 2</option>
                <option value={3}>Lớp 3</option>
                <option value={4}>Lớp 4</option>
                <option value={5}>Lớp 5</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kì kiểm tra:</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value as SemesterType)}
                className="w-full border border-slate-300 rounded-md px-2.5 py-1.5 bg-white text-slate-800"
              >
                <option value="Giữa Học kì I">Giữa Học kì I</option>
                <option value="Cuối Học kì I">Cuối Học kì I</option>
                <option value="Giữa Học kì II">Giữa Học kì II</option>
                <option value="Cuối Năm học">Cuối Năm học</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bộ sách:</label>
              <select
                value={bookSeries}
                onChange={(e) => setBookSeries(e.target.value as BookSeriesType)}
                className="w-full border border-slate-300 rounded-md px-2.5 py-1.5 bg-white text-slate-800"
              >
                <option value="Kết nối tri thức với cuộc sống">Kết nối tri thức với cuộc sống</option>
                <option value="Cánh diều">Cánh diều</option>
                <option value="Chân trời sáng tạo">Chân trời sáng tạo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Đơn vị chủ quản:</label>
              <input
                type="text"
                value={governingBody}
                onChange={(e) => setGoverningBody(e.target.value)}
                className="w-full border border-slate-300 rounded-md px-2.5 py-1.5 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tên trường:</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full border border-slate-300 rounded-md px-2.5 py-1.5 bg-white text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Yêu cầu cụ thể hoặc trọng tâm bài học (tùy chọn):
            </label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Ví dụ: Tập trung vào bảng nhân 6, 7; câu hỏi thực tế về Xín Mần - Hà Giang; bài toán vẽ hình trên lưới ô vuông..."
              className="w-full border border-slate-300 rounded-md px-2.5 py-1.5 bg-white text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Standards Summary Notice */}
          <div className="bg-sky-50 border border-sky-200 rounded-md p-2.5 text-[11px] text-sky-900 leading-relaxed">
            <span className="font-bold">✓ Tự động áp dụng chuẩn:</span> Tỉ lệ mức 50% - 30% - 20%; 60% Trắc nghiệm (6đ) - 40% Tự luận (4đ); Thang điểm 10.0; Đối với Tiếng Việt: Đọc thành tiếng 3đ, Đọc hiểu 7đ (11 câu), Viết 10đ và độ dài bài đọc chuẩn số từ.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-3.5 py-1.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium text-xs"
          >
            Đóng
          </button>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs shadow-xs transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang tạo hồ sơ đề...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Khởi tạo ngay
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
