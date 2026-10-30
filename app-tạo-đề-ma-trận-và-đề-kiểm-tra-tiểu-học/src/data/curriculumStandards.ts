import { GradeType, SemesterType, SubjectType } from '../types/exam';

export interface CurriculumRule {
  grade: GradeType;
  subject: SubjectType;
  totalPeriods: number;
  ratios: {
    level1: number; // e.g. 50%
    level2: number; // e.g. 30%
    level3: number; // e.g. 20%
    multipleChoice: number; // 60%
    essay: number; // 40%
  };
  semesterTopics: {
    [key in SemesterType]?: Array<{
      name: string;
      targetPercent: number;
      actualPeriods?: string;
      notes?: string;
    }>;
  };
  specialRequirements?: string[];
}

export const CURRICULUM_STANDARDS: Record<string, CurriculumRule> = {
  'Toán-1': {
    grade: 1,
    subject: 'Toán',
    totalPeriods: 105,
    ratios: { level1: 50, level2: 30, level3: 20, multipleChoice: 60, essay: 40 },
    semesterTopics: {
      'Giữa Học kì I': [
        { name: 'Số và phép tính', targetPercent: 80, notes: 'Các số trong phạm vi 10; phép cộng trong phạm vi 10' },
        { name: 'Hình học và đo lường', targetPercent: 20, actualPeriods: '11/54 tiết (~20.37%)', notes: 'Hình vuông, hình tròn, hình tam giác, hình chữ nhật' },
      ],
      'Cuối Học kì I': [
        { name: 'Số và phép tính', targetPercent: 80, actualPeriods: 'Số: 18t/52 = 3.5đ; 21/52 = 4.5đ' },
        { name: 'Hình học và đo lường', targetPercent: 20, actualPeriods: '11/54 tiết (~20.37%) = 2.0đ' },
      ],
      'Giữa Học kì II': [
        { name: 'Số và phép tính', targetPercent: 80, notes: 'Các số trong phạm vi 100; phép cộng, phép trừ' },
        { name: 'Hình học và đo lường', targetPercent: 20, notes: 'Đo độ dài (cm), xem giờ đúng' },
      ],
      'Cuối Năm học': [
        { name: 'Số và phép tính', targetPercent: 80, actualPeriods: '76/105 tiết (~72.39%)' },
        { name: 'Hình học và đo lường', targetPercent: 20, actualPeriods: '29/105 tiết (~27.61%)' },
      ],
    },
    specialRequirements: [
      'Vẽ hình trên lưới ô vuông (Lớp 1-5)',
      'Tập huấn: Số = 18t/52 = 3.5đ; 21/52 = 4.5đ; HH và đo lường: 11/52 = 2.0đ',
    ],
  },
  'Toán-2': {
    grade: 2,
    subject: 'Toán',
    totalPeriods: 175,
    ratios: { level1: 50, level2: 30, level3: 20, multipleChoice: 60, essay: 40 },
    semesterTopics: {
      'Giữa Học kì I': [
        { name: 'Số và phép tính', targetPercent: 70 },
        { name: 'Hình học và đo lường', targetPercent: 30 },
      ],
      'Cuối Học kì I': [
        { name: 'Số và phép tính', targetPercent: 70, actualPeriods: '62/90 tiết (~68.9%)' },
        { name: 'Hình học và đo lường', targetPercent: 30, actualPeriods: '28/90 tiết (~31.1%)' },
      ],
      'Giữa Học kì II': [
        { name: 'Số và phép tính', targetPercent: 70 },
        { name: 'Hình học và đo lường', targetPercent: 20 },
        { name: 'Yếu tố thống kê và xác suất', targetPercent: 10 },
      ],
      'Cuối Năm học': [
        { name: 'Số và phép tính', targetPercent: 70 },
        { name: 'Hình học và đo lường', targetPercent: 20, actualPeriods: '45/175 tiết (~25.7%)' },
        { name: 'Yếu tố thống kê và xác suất', targetPercent: 10 },
      ],
    },
    specialRequirements: ['Vẽ đoạn thẳng, đường gấp khúc trên lưới ô vuông', 'Trắc nghiệm 60% (6đ) - Tự luận 40% (4đ)'],
  },
  'Toán-3': {
    grade: 3,
    subject: 'Toán',
    totalPeriods: 175,
    ratios: { level1: 50, level2: 30, level3: 20, multipleChoice: 60, essay: 40 },
    semesterTopics: {
      'Giữa Học kì I': [
        { name: 'Số và phép tính', targetPercent: 70 },
        { name: 'Hình học và đo lường', targetPercent: 30 },
      ],
      'Cuối Học kì I': [
        { name: 'Số và phép tính', targetPercent: 70, actualPeriods: '67/90 tiết (~74.45%)' },
        { name: 'Hình học và đo lường', targetPercent: 30, actualPeriods: '23/90 tiết (~25.55%)' },
      ],
      'Giữa Học kì II': [
        { name: 'Số và phép tính', targetPercent: 70 },
        { name: 'Hình học và đo lường', targetPercent: 20 },
        { name: 'Yếu tố thống kê và xác suất', targetPercent: 10 },
      ],
      'Cuối Năm học': [
        { name: 'Số và phép tính', targetPercent: 70 },
        { name: 'Hình học và đo lường', targetPercent: 20, actualPeriods: '45/175 tiết (~25.7%)' },
        { name: 'Yếu tố thống kê và xác suất', targetPercent: 10 },
      ],
    },
    specialRequirements: ['Vẽ góc vuông, hình tròn, tính chu vi diện tích trên lưới ô vuông'],
  },
  'Toán-4': {
    grade: 4,
    subject: 'Toán',
    totalPeriods: 175,
    ratios: { level1: 50, level2: 30, level3: 20, multipleChoice: 60, essay: 40 },
    semesterTopics: {
      'Giữa Học kì I': [
        { name: 'Số và phép tính', targetPercent: 70, actualPeriods: '29/45 tiết' },
        { name: 'Hình học và đo lường', targetPercent: 30, actualPeriods: '16/45 tiết (~35.55%)' },
      ],
      'Cuối Học kì I': [
        { name: 'Số và phép tính', targetPercent: 50, actualPeriods: '46/90 tiết' },
        { name: 'Hình học và đo lường', targetPercent: 50, actualPeriods: '44/90 tiết (~48.88%)' },
      ],
      'Giữa Học kì II': [
        { name: 'Số và phép tính', targetPercent: 70, actualPeriods: '91/135 tiết' },
        { name: 'Hình học và đo lường', targetPercent: 30, actualPeriods: '44/135 tiết (~32.59%)' },
      ],
      'Cuối Năm học': [
        { name: 'Số và phép tính', targetPercent: 70, actualPeriods: '118/175 tiết' },
        { name: 'Hình học và đo lường', targetPercent: 20, actualPeriods: '47/175 tiết (~26.85%)' },
        { name: 'Yếu tố thống kê và xác suất', targetPercent: 10, actualPeriods: '10/175 tiết' },
      ],
    },
    specialRequirements: ['Vẽ hai đường thẳng vuông góc, song song, hình bình hành, hình thoi trên lưới ô vuông'],
  },
  'Toán-5': {
    grade: 5,
    subject: 'Toán',
    totalPeriods: 175,
    ratios: { level1: 50, level2: 30, level3: 20, multipleChoice: 60, essay: 40 },
    semesterTopics: {
      'Giữa Học kì I': [
        { name: 'Số và phép tính', targetPercent: 80, actualPeriods: '37/45 tiết' },
        { name: 'Hình học và đo lường', targetPercent: 20, actualPeriods: '8/45 tiết (~17.77%)' },
      ],
      'Cuối Học kì I': [
        { name: 'Số và phép tính', targetPercent: 60, actualPeriods: '56/90 tiết' },
        { name: 'Hình học và đo lường', targetPercent: 40, actualPeriods: '34/90 tiết (~37.77%)' },
      ],
      'Giữa Học kì II': [
        { name: 'Số và phép tính', targetPercent: 50, actualPeriods: '60/135 tiết' },
        { name: 'Hình học và đo lường', targetPercent: 50, actualPeriods: '75/135 tiết (~55.55%)' },
      ],
      'Cuối Năm học': [
        { name: 'Số và phép tính', targetPercent: 50, actualPeriods: '82/175 tiết' },
        { name: 'Hình học và đo lường', targetPercent: 40, actualPeriods: '83/175 tiết (~47.42%)' },
        { name: 'Yếu tố thống kê và xác suất', targetPercent: 10, actualPeriods: '10/175 tiết' },
      ],
    },
    specialRequirements: ['Vẽ hình tam giác, hình thang, hình tròn, hình hộp chữ nhật trên lưới ô vuông'],
  },
};

export const VIETNAMESE_STANDARDS = {
  generalRules: {
    oralReadingPoints: 3.0,
    readingComprehensionPoints: 7.0,
    writingPoints: 10.0,
    readingQuestionsTotal: 11,
    readingSubdivisions: {
      textComprehension: {
        points: 4.0,
        multipleChoice: { count: 4, points: 2.0 },
        essay: { count: 2, points: 2.0 },
      },
      languageKnowledge: {
        points: 3.0,
        multipleChoice: { count: 4, points: 2.0 },
        essay: { count: 1, points: 1.0 },
      },
    },
    levelRatios: {
      level1: 'Khoảng 40% (4 điểm)',
      level2: 'Khoảng 20% (2 điểm)',
      level3: 'Khoảng 10% (1 điểm)',
    },
  },
  wordCountLimits: {
    grade4: {
      truyen: { min: 280, max: 330, label: 'Truyện, kịch bản (280 – 330 chữ)' },
      mieu_ta: { min: 200, max: 250, label: 'Bài miêu tả (200 – 250 chữ)' },
      tho: { min: 100, max: 120, label: 'Thơ (100 – 120 chữ)' },
      thong_tin: { min: 150, max: 180, label: 'Văn bản thông tin (150 – 180 chữ)' },
    },
    grade5: {
      truyen: { min: 300, max: 350, label: 'Truyện và kịch bản (300 – 350 chữ)' },
      mieu_ta: { min: 200, max: 250, label: 'Bài miêu tả (200 – 250 chữ)' },
      tho: { min: 110, max: 130, label: 'Thơ (110 – 130 chữ)' },
      thong_tin: { min: 220, max: 240, label: 'Văn bản thông tin (khoảng 230 chữ)' },
    },
  },
};

export const OTHER_SUBJECTS_STANDARDS = {
  'Lịch sử & Địa lí': {
    grades: [4, 5],
    ratios: { level1: 50, level2: 30, level3: 20, multipleChoice: 60, essay: 40 },
    totalPoints: 10.0,
    mcPoints: 6.0,
    essayPoints: 4.0,
  },
  'Khoa học': {
    grades: [4, 5],
    ratios: { level1: 50, level2: 30, level3: 20, multipleChoice: 60, essay: 40 },
    totalPoints: 10.0,
    mcPoints: 6.0,
    essayPoints: 4.0,
  },
};
