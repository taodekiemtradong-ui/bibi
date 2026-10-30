/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SAMPLE_EXAMS } from './data/sampleExams';
import { ExamPackage, QuestionItem, ScoringItem, SpecificationItem, SchoolHeader, GridDrawing } from './types/exam';
import { MatrixView } from './components/MatrixView';
import { SpecificationView } from './components/SpecificationView';
import { ExamPaperView } from './components/ExamPaperView';
import { ScoringGuideView } from './components/ScoringGuideView';
import { ScoreToolbar } from './components/ScoreToolbar';
import { GridGeometryModal } from './components/GridGeometryModal';
import { AIGeneratorModal } from './components/AIGeneratorModal';
import { QuestionRefineModal } from './components/QuestionRefineModal';
import { exportExamToWord } from './utils/exportWord';
import {
  FileText,
  Table,
  ListCheck,
  CheckSquare,
  Sparkles,
  Download,
  Printer,
  BookOpen,
  School,
  Grid,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export default function App() {
  const [currentExam, setCurrentExam] = useState<ExamPackage>(SAMPLE_EXAMS[0]);
  const [activeTab, setActiveTab] = useState<'matrix' | 'specs' | 'exam' | 'rubric' | 'grid'>('exam');
  const [isQuickEditMode, setIsQuickEditMode] = useState<boolean>(false);

  // Modals
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [refiningQuestion, setRefiningQuestion] = useState<QuestionItem | null>(null);
  const [isGridModalOpen, setIsGridModalOpen] = useState(false);
  const [gridTargetQuestion, setGridTargetQuestion] = useState<QuestionItem | null>(null);

  // Synchronize score changes across all views
  const handleUpdateQuestionPoints = (qNum: number, newPoints: number) => {
    // 1. Update questions
    const updatedQuestions = currentExam.questions.map((q) =>
      q.number === qNum ? { ...q, points: newPoints } : q
    );

    // 2. Update scoring guide
    const updatedScoring = currentExam.scoringGuide.map((s) =>
      s.questionNumber === qNum ? { ...s, points: newPoints } : s
    );

    // 3. Update specifications
    const updatedSpecs = currentExam.specifications.map((s) =>
      s.questionNumber === `Câu ${qNum}` ? { ...s, points: newPoints } : s
    );

    // 4. Update matrix points according to question type and level
    const targetQ = currentExam.questions.find((q) => q.number === qNum);
    let updatedMatrix = currentExam.matrix;
    if (targetQ) {
      const delta = newPoints - targetQ.points;
      updatedMatrix = currentExam.matrix.map((row) => {
        if (row.topic.includes(targetQ.topic) || updatedMatrix.length === 1) {
          const newRow = { ...row };
          if (targetQ.level === 1 && targetQ.type === 'TN') newRow.level1TN.points += delta;
          else if (targetQ.level === 1 && targetQ.type === 'TL') newRow.level1TL.points += delta;
          else if (targetQ.level === 2 && targetQ.type === 'TN') newRow.level2TN.points += delta;
          else if (targetQ.level === 2 && targetQ.type === 'TL') newRow.level2TL.points += delta;
          else if (targetQ.level === 3 && targetQ.type === 'TN') newRow.level3TN.points += delta;
          else if (targetQ.level === 3 && targetQ.type === 'TL') newRow.level3TL.points += delta;

          newRow.totalPoints = Number((newRow.totalPoints + delta).toFixed(2));
          return newRow;
        }
        return row;
      });
    }

    setCurrentExam({
      ...currentExam,
      questions: updatedQuestions,
      scoringGuide: updatedScoring,
      specifications: updatedSpecs,
      matrix: updatedMatrix,
    });
  };

  // Full Questions Update
  const handleUpdateQuestions = (updatedQuestions: QuestionItem[]) => {
    // Keep scoring guide and specs in sync
    const updatedScoring = currentExam.scoringGuide.map((s) => {
      const q = updatedQuestions.find((item) => item.number === s.questionNumber);
      return q ? { ...s, points: q.points } : s;
    });

    const updatedSpecs = currentExam.specifications.map((sp) => {
      const num = parseInt(sp.questionNumber.replace(/\D/g, ''), 10);
      const q = updatedQuestions.find((item) => item.number === num);
      return q ? { ...sp, points: q.points } : sp;
    });

    setCurrentExam({
      ...currentExam,
      questions: updatedQuestions,
      scoringGuide: updatedScoring,
      specifications: updatedSpecs,
    });
  };

  // Auto-Balance points to exactly 10.0 points
  const handleAutoBalance = () => {
    const total = currentExam.questions.reduce((acc, q) => acc + q.points, 0);
    const targetTotal = currentExam.subject === 'Tiếng Việt' && currentExam.readingPassage ? 7.0 : 10.0;
    const diff = Number((targetTotal - total).toFixed(2));

    if (Math.abs(diff) < 0.05) return;

    // Distribute diff onto essay questions or last question
    const essayQs = currentExam.questions.filter((q) => q.type === 'TL');
    const targetIndex = essayQs.length > 0
      ? currentExam.questions.findIndex((q) => q.id === essayQs[essayQs.length - 1].id)
      : currentExam.questions.length - 1;

    if (targetIndex >= 0) {
      const updated = [...currentExam.questions];
      const newPts = Math.max(0.25, Number((updated[targetIndex].points + diff).toFixed(2)));
      updated[targetIndex] = { ...updated[targetIndex], points: newPts };
      handleUpdateQuestions(updated);
    }
  };

  // Reset to standard ratios (60% TN, 40% TL; Mức 1: 5đ, Mức 2: 3đ, Mức 3: 2đ)
  const handleResetStandard = () => {
    const tnCount = currentExam.questions.filter((q) => q.type === 'TN').length;
    const tlCount = currentExam.questions.filter((q) => q.type === 'TL').length;

    const tnTotalTarget = currentExam.subject === 'Tiếng Việt' ? 4.0 : 6.0;
    const tlTotalTarget = currentExam.subject === 'Tiếng Việt' ? 3.0 : 4.0;

    const tnPerQ = Number((tnTotalTarget / (tnCount || 1)).toFixed(2));
    const tlPerQ = Number((tlTotalTarget / (tlCount || 1)).toFixed(2));

    const updated = currentExam.questions.map((q) => ({
      ...q,
      points: q.type === 'TN' ? tnPerQ : tlPerQ,
    }));

    handleUpdateQuestions(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* Top Application Header */}
      <header className="bg-blue-900 text-white border-b border-blue-950 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-800 border border-blue-700 flex items-center justify-center text-blue-200">
              <School className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                APP TẠO ĐỀ MA TRẬN VÀ ĐỀ KIỂM TRA TIỂU HỌC
                <span className="text-[10px] bg-blue-800/80 text-blue-200 px-1.5 py-0.5 rounded border border-blue-700 font-mono">
                  GDPT 2018
                </span>
              </h1>
              <p className="text-xs text-blue-200 mt-0.5">
                {currentExam.header.governingBody} · {currentExam.header.schoolName} · Năm học {currentExam.header.academicYear}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAIGeneratorOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-100" />
              Tạo Đề Mới Bằng AI
            </button>

            <button
              onClick={() => exportExamToWord(currentExam)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-800 hover:bg-blue-700 text-white rounded-lg text-xs font-medium border border-blue-700 transition-colors cursor-pointer"
              title="Xuất trọn bộ hồ sơ (Ma trận, đặc tả, đề thi, hướng dẫn chấm) sang Word .doc"
            >
              <Download className="w-3.5 h-3.5 text-blue-300" />
              Xuất File Word (.doc)
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-800 hover:bg-blue-700 text-white rounded-lg text-xs font-medium border border-blue-700 transition-colors cursor-pointer"
              title="In trực tiếp khổ A4"
            >
              <Printer className="w-3.5 h-3.5 text-blue-300" />
              In A4
            </button>
          </div>
        </div>

        {/* Preset Sample Exam Picker Bar */}
        <div className="bg-blue-950/70 border-t border-blue-800/60 px-4 py-2">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-blue-200 font-medium">Kho đề mẫu chuẩn GDPT 2018:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {SAMPLE_EXAMS.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setCurrentExam(ex)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    currentExam.id === ex.id
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-blue-300 hover:bg-blue-900/80 hover:text-white'
                  }`}
                >
                  {ex.subject} - Lớp {ex.grade} ({ex.semester})
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Dynamic Score Toolbar with "Chỗ sửa điểm" */}
      <ScoreToolbar
        summary={currentExam.matrixSummary}
        questions={currentExam.questions}
        onAutoBalance={handleAutoBalance}
        onResetStandard={handleResetStandard}
        isQuickEditMode={isQuickEditMode}
        onToggleQuickEdit={() => setIsQuickEditMode(!isQuickEditMode)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 py-6 flex-1 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 no-print">
          <button
            onClick={() => setActiveTab('exam')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'exam'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Đề kiểm tra chính thức
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'matrix'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-4 h-4" />
            Ma trận đề (TT 27 / GDPT 2018)
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'specs'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListCheck className="w-4 h-4" />
            Bản đặc tả ma trận đề
          </button>

          <button
            onClick={() => setActiveTab('rubric')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'rubric'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Hướng dẫn chấm & Biểu điểm
          </button>

          <button
            onClick={() => {
              setGridTargetQuestion(null);
              setIsGridModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 rounded ml-auto border border-blue-200 transition-colors cursor-pointer"
          >
            <Grid className="w-3.5 h-3.5 text-blue-600" />
            Vẽ hình ô vuông (Lớp 1-5)
          </button>
        </div>

        {/* Tab 1: Exam Paper View */}
        {activeTab === 'exam' && (
          <ExamPaperView
            exam={currentExam}
            onUpdateHeader={(h) => setCurrentExam({ ...currentExam, header: h })}
            onUpdateQuestions={handleUpdateQuestions}
            onRefineQuestionWithAI={(q) => setRefiningQuestion(q)}
            onOpenGridEditor={(q) => {
              setGridTargetQuestion(q);
              setIsGridModalOpen(true);
            }}
          />
        )}

        {/* Tab 2: Matrix View */}
        {activeTab === 'matrix' && (
          <MatrixView
            exam={currentExam}
            onUpdateMatrix={(updated) => setCurrentExam({ ...currentExam, matrix: updated })}
          />
        )}

        {/* Tab 3: Specification View */}
        {activeTab === 'specs' && (
          <SpecificationView
            exam={currentExam}
            onUpdateSpec={(updated) => setCurrentExam({ ...currentExam, specifications: updated })}
            onUpdateQuestionPoints={handleUpdateQuestionPoints}
          />
        )}

        {/* Tab 4: Scoring Guide View */}
        {activeTab === 'rubric' && (
          <ScoringGuideView
            exam={currentExam}
            onUpdateScoringGuide={(guide) => setCurrentExam({ ...currentExam, scoringGuide: guide })}
            onUpdateQuestionPoints={handleUpdateQuestionPoints}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500 no-print mt-auto">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>Hệ thống tạo đề ma trận & đề kiểm tra tiểu học · Chuẩn Bộ Giáo dục và Đào tạo</span>
          <span>UBND Xã Xín Mần · Trường PTDTBT TH Chí Cà</span>
        </div>
      </footer>

      {/* AI Exam Generator Modal */}
      <AIGeneratorModal
        isOpen={isAIGeneratorOpen}
        onClose={() => setIsAIGeneratorOpen(false)}
        onSuccess={(newExam) => {
          setCurrentExam(newExam);
          setActiveTab('exam');
        }}
        currentSchoolName={currentExam.header.schoolName}
        currentGoverningBody={currentExam.header.governingBody}
      />

      {/* Question Refine / AI replacement Modal */}
      <QuestionRefineModal
        question={refiningQuestion}
        isOpen={Boolean(refiningQuestion)}
        onClose={() => setRefiningQuestion(null)}
        subject={currentExam.subject}
        grade={currentExam.grade}
        onSuccess={(newQ, newRubric) => {
          const updatedQs = currentExam.questions.map((item) =>
            item.number === newQ.number ? newQ : item
          );
          let updatedRubricList = currentExam.scoringGuide;
          if (newRubric) {
            updatedRubricList = currentExam.scoringGuide.map((item) =>
              item.questionNumber === newRubric.questionNumber ? newRubric : item
            );
          }
          setCurrentExam({
            ...currentExam,
            questions: updatedQs,
            scoringGuide: updatedRubricList,
          });
        }}
      />

      {/* Grid Geometry Modal */}
      <GridGeometryModal
        isOpen={isGridModalOpen}
        onClose={() => {
          setIsGridModalOpen(false);
          setGridTargetQuestion(null);
        }}
        initialData={gridTargetQuestion?.gridDetails}
        questionNumber={gridTargetQuestion?.number}
        onSave={(savedGrid) => {
          if (gridTargetQuestion) {
            const updated = currentExam.questions.map((q) =>
              q.id === gridTargetQuestion.id
                ? { ...q, gridRequirement: true, gridDetails: savedGrid }
                : q
            );
            handleUpdateQuestions(updated);
          }
        }}
      />
    </div>
  );
}
