export type SubjectType = 'Toán' | 'Tiếng Việt' | 'Lịch sử & Địa lí' | 'Khoa học';

export type GradeType = 1 | 2 | 3 | 4 | 5;

export type SemesterType = 'Giữa Học kì I' | 'Cuối Học kì I' | 'Giữa Học kì II' | 'Cuối Năm học';

export type BookSeriesType = 'Kết nối tri thức với cuộc sống' | 'Cánh diều' | 'Chân trời sáng tạo';

export interface SchoolHeader {
  governingBody: string;      // e.g. "UBND XÃ XÍN MẦN"
  schoolName: string;         // e.g. "TRƯỜNG PTDTBT TH CHÍ CÀ"
  examTitle: string;          // e.g. "ĐỀ KIỂM TRA ĐỊNH KÌ GIỮA HỌC KÌ I"
  academicYear: string;       // e.g. "2026 - 2027"
  subject: SubjectType;
  duration: string;           // e.g. "40 phút"
}

export interface MatrixLevelEntry {
  questions: number;
  points: number;
}

export interface MatrixRow {
  id: string;
  topic: string;
  periodCount?: number;       // Số tiết thực hiện
  periodRatio?: string;       // Tỉ lệ tiết
  level1TN: MatrixLevelEntry;
  level1TL: MatrixLevelEntry;
  level2TN: MatrixLevelEntry;
  level2TL: MatrixLevelEntry;
  level3TN: MatrixLevelEntry;
  level3TL: MatrixLevelEntry;
  totalQuestions: number;
  totalPoints: number;
  percentage: number;
}

export interface MatrixSummary {
  level1Points: number; // Mục tiêu: 5.0 (50%)
  level2Points: number; // Mục tiêu: 3.0 (30%)
  level3Points: number; // Mục tiêu: 2.0 (20%)
  tnPoints: number;     // Mục tiêu: 6.0 (60%)
  tlPoints: number;     // Mục tiêu: 4.0 (40%)
  totalPoints: number;  // 10.0
}

export interface SpecificationItem {
  id: number;
  topic: string;
  objective: string;          // Yêu cầu cần đạt
  level: 'Mức 1' | 'Mức 2' | 'Mức 3';
  type: 'TN' | 'TL';
  questionNumber: string;     // e.g. "Câu 1"
  points: number;
}

export interface GridDrawing {
  rows: number;
  cols: number;
  shapeType?: 'rectangle' | 'square' | 'triangle' | 'parallelogram' | 'rhombus' | 'line' | 'points' | 'calculation';
  points?: Array<{ x: number; y: number; label?: string }>;
  instructions?: string;
}

export interface QuestionItem {
  id: number;
  number: number;
  type: 'TN' | 'TL';
  level: 1 | 2 | 3;
  topic: string;
  content: string;
  options?: string[];         // Cho trắc nghiệm: ["A. ...", "B. ...", "C. ...", "D. ..."]
  points: number;
  gridRequirement?: boolean;  // Có yêu cầu vẽ/làm bài trên lưới ô vuông không
  gridDetails?: GridDrawing;
  section?: 'reading_comprehension' | 'vietnamese_knowledge' | 'writing' | 'oral';
}

export interface ScoringStep {
  step: string;
  points: number;
}

export interface ScoringItem {
  questionNumber: number;
  type: 'TN' | 'TL';
  answer: string;
  explanation: string;
  points: number;
  steps?: ScoringStep[];
}

export interface ReadingPassage {
  title: string;
  author: string;
  content: string;
  wordCount: number;
  genre?: 'truyện' | 'thơ' | 'miêu tả' | 'văn bản thông tin';
}

export interface ExamPackage {
  id: string;
  header: SchoolHeader;
  grade: GradeType;
  subject: SubjectType;
  semester: SemesterType;
  bookSeries?: BookSeriesType;
  matrix: MatrixRow[];
  matrixSummary: MatrixSummary;
  specifications: SpecificationItem[];
  questions: QuestionItem[];
  scoringGuide: ScoringItem[];
  readingPassage?: ReadingPassage;
  oralReading?: {
    points: number;
    instructions: string;
  };
  vietnameseWriting?: {
    prompt: string;
    points: number;
    guidelines: string;
  };
  notes?: string;
}
