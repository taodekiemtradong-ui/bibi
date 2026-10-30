import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared server-side Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: Generate complete exam package (Matrix, Specifications, Questions, Rubric)
app.post('/api/generate-exam', async (req, res) => {
  try {
    const { subject, grade, semester, examType, schoolName, governingBody, bookSeries, customNotes } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `Bạn là Chuyên gia ra đề kiểm tra tiểu học hàng đầu Việt Nam, am hiểu sâu sắc Chương trình Giáo dục phổ thông 2018 (GDPT 2018) và Thông tư 27/2020/TT-BGDĐT về đánh giá học sinh tiểu học.
Nhiệm vụ: Tạo bộ hồ sơ kiểm tra định kì chuẩn xác, bao gồm:
1. Ma trận đề kiểm tra (Phân bổ theo Mạch kiến thức, Mức 1-2-3 (50%-30%-20%), Trắc nghiệm 60% (6 điểm) và Tự luận 40% (4 điểm))
2. Bản đặc tả ma trận đề (Yêu cầu cần đạt, mức độ, hình thức, điểm số)
3. Đề kiểm tra chính thức (các câu hỏi bám sát chuẩn kiến thức kĩ năng, văn phong trong sáng, sư phạm)
4. Hướng dẫn chấm và biểu điểm chi tiết (đáp án trắc nghiệm, các bước tự luận, điểm số có thể tùy biến).

Quy định cấu trúc theo từng môn và khối lớp của GDPT 2018:
- MÔN TOÁN:
  + Mức 1: 50% (5 điểm), Mức 2: 30% (3 điểm), Mức 3: 20% (2 điểm).
  + Trắc nghiệm: 60% (6 điểm) - thường 6 câu mỗi câu 1.0đ hoặc 8 câu (gồm câu 0.5đ và 1.0đ); Tự luận: 40% (4 điểm) - gồm 3-4 câu.
  + Phân bổ mạch kiến thức:
    * Lớp 1: Số và phép tính (80%), Hình học và đo lường (20%). Vẽ hình / đếm hình trên lưới ô vuông.
    * Lớp 2, 3: Kì I: Số và PT (70%), Hình học và đo lường (30%); Kì II: Số và PT (70%), HH & ĐL (20%), Thống kê & xác suất (10%).
    * Lớp 4: GKI: Số và PT (70%), HH&ĐL (30%); CKI: Số và PT (50%), HH&ĐL (50%); GKII: Số và PT (70%), HH&ĐL (30%); CN: Số và PT (70%), HH&ĐL (20%), TK&XS (10%).
    * Lớp 5: GKI: Số và PT (80%), HH&ĐL (20%); CKI: Số và PT (60%), HH&ĐL (40%); GKII: Số và PT (50%), HH&ĐL (50%); CN: Số và PT (50%), HH&ĐL (40%), TK&XS (10%).
    * Có bài tập vẽ hình hoặc làm việc trên lưới ô vuông (Lớp 1-5).
- MÔN TIẾNG VIỆT (Đặc biệt Lớp 4, 5):
  + Đọc thành tiếng: 3 điểm.
  + Đọc hiểu: 7 điểm (Văn bản ngoài SGK).
    * Đọc hiểu văn bản: 4 điểm (4 câu trắc nghiệm = 2 điểm; 2 câu tự luận = 2 điểm).
    * Kiến thức tiếng Việt: 3 điểm (4 câu trắc nghiệm = 2 điểm; 1 câu tự luận = 1 điểm).
    * Tổng 11 câu hỏi = 7 điểm. Tỉ lệ mức 1-2-3 khoảng 40%-20%-10% (4đ mức 1, 2đ mức 2, 1đ mức 3).
    * Độ dài văn bản đọc ngoài SGK:
      Lớp 4: Truyện 280-330 từ, miêu tả 200-250 từ, thơ 100-120 từ, văn bản thông tin 150-180 từ.
      Lớp 5: Truyện 300-350 từ, miêu tả 200-250 từ, thơ 110-130 từ, văn bản thông tin 230 từ.
  + Viết đoạn văn / bài văn: 10 điểm (Có tiêu chí chấm nội dung, hình thức trình bày, dùng từ đặt câu).
- MÔN LỊCH SỬ & ĐỊA LÝ / KHOA HỌC (Lớp 4, 5):
  + Mức 1: 50% (5đ), Mức 2: 30% (3đ), Mức 3: 20% (2đ).
  + Trắc nghiệm 60% (6đ), Tự luận 40% (4đ).

Trả về định dạng JSON thuần túy theo schema yêu cầu.`;

    const prompt = `Hãy tạo toàn bộ hồ sơ kiểm tra cho:
- Môn: ${subject}
- Lớp: ${grade}
- Kì kiểm tra: ${semester} (${examType})
- Trường: ${schoolName || 'TRƯỜNG PTDTBT TH CHÍ CÀ'}
- Đơn vị chủ quản: ${governingBody || 'UBND XÃ XÍN MẦN'}
- Năm học: 2026 - 2027
- Bộ sách (nếu có): ${bookSeries || 'Kết nối tri thức với cuộc sống'}
- Ghi chú thêm của giáo viên: ${customNotes || 'Không có'}

Yêu cầu xuất ra JSON cấu trúc chính xác sau:
{
  "header": {
    "governingBody": "${governingBody || 'UBND XÃ XÍN MẦN'}",
    "schoolName": "${schoolName || 'TRƯỜNG PTDTBT TH CHÍ CÀ'}",
    "examTitle": "ĐỀ KIỂM TRA ĐỊNH KÌ ${examType.toUpperCase()}",
    "academicYear": "2026 - 2027",
    "subject": "${subject}",
    "duration": "${subject === 'Toán' ? 40 : subject === 'Tiếng Việt' ? 70 : 40} phút"
  },
  "matrix": [
    {
      "topic": "Tên mạch kiến thức",
      "level1TN": { "questions": 0, "points": 0 },
      "level1TL": { "questions": 0, "points": 0 },
      "level2TN": { "questions": 0, "points": 0 },
      "level2TL": { "questions": 0, "points": 0 },
      "level3TN": { "questions": 0, "points": 0 },
      "level3TL": { "questions": 0, "points": 0 },
      "totalQuestions": 0,
      "totalPoints": 0,
      "percentage": 0
    }
  ],
  "matrixSummary": {
    "level1Points": 5.0,
    "level2Points": 3.0,
    "level3Points": 2.0,
    "tnPoints": 6.0,
    "tlPoints": 4.0,
    "totalPoints": 10.0
  },
  "specifications": [
    {
      "id": 1,
      "topic": "Tên mạch kiến thức",
      "objective": "Yêu cầu cần đạt chi tiết",
      "level": "Mức 1" | "Mức 2" | "Mức 3",
      "type": "TN" | "TL",
      "questionNumber": "Câu 1",
      "points": 1.0
    }
  ],
  "readingPassage": {
    "title": "Tiêu đề bài đọc (nếu là môn Tiếng Việt)",
    "author": "Tác giả",
    "content": "Nội dung bài đọc ngoài SGK đúng số chữ theo quy định",
    "wordCount": 315
  },
  "questions": [
    {
      "id": 1,
      "number": 1,
      "type": "TN" | "TL",
      "level": 1,
      "topic": "Số và phép tính",
      "content": "Nội dung câu hỏi",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "points": 1.0,
      "gridRequirement": false,
      "gridDetails": {
        "rows": 4,
        "cols": 6,
        "instructions": "Vẽ hình chữ nhật có chiều dài 4 ô, chiều rộng 2 ô trên lưới ô vuông bên dưới"
      }
    }
  ],
  "vietnameseWriting": {
    "prompt": "Đề bài tập làm văn / viết đoạn văn (nếu là Tiếng Việt)",
    "points": 10.0,
    "guidelines": "Hướng dẫn chấm phần viết"
  },
  "oralReading": {
    "points": 3.0,
    "instructions": "Đọc thành tiếng bài văn và trả lời 1 câu hỏi do giáo viên chỉ định"
  },
  "scoringGuide": [
    {
      "questionNumber": 1,
      "type": "TN" | "TL",
      "answer": "A",
      "explanation": "Chi tiết đáp án hoặc các bước giải",
      "points": 1.0,
      "steps": [
        { "step": "Ý 1", "points": 0.5 },
        { "step": "Ý 2", "points": 0.5 }
      ]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating exam:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Không thể tạo đề kiểm tra bằng AI.',
    });
  }
});

// API: Generate standalone reading passage with exact word count for Vietnamese
app.post('/api/generate-reading', async (req, res) => {
  try {
    const { grade, genre, theme } = req.body;
    const ai = getGeminiClient();

    const targetWords = grade === 4 ? (genre === 'tho' ? 110 : genre === 'thong_tin' ? 165 : 300) : (genre === 'tho' ? 120 : genre === 'thong_tin' ? 230 : 325);

    const prompt = `Tạo một bài đọc hiểu ngoài sách giáo khoa môn Tiếng Việt lớp ${grade} dành cho đề kiểm tra định kì GDPT 2018.
- Thể loại: ${genre || 'truyện'} (Độ dài mục tiêu: khoảng ${targetWords} chữ)
- Chủ đề: ${theme || 'Tình cảm gia đình, quê hương, bảo vệ môi trường, bạn bè, lòng nhân ái'}
- Đếm chính xác số từ của bài và trả về JSON:
{
  "title": "Tiêu đề bài viết",
  "author": "Tên tác giả",
  "content": "Toàn văn bài đọc",
  "wordCount": ${targetWords},
  "genre": "${genre || 'truyện'}"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating reading:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// API: Refine or replace a single question while preserving matrix balance
app.post('/api/refine-question', async (req, res) => {
  try {
    const { currentQuestion, requestInstruction, subject, grade } = req.body;
    const ai = getGeminiClient();

    const prompt = `Bạn là giáo viên tiểu học. Hãy sửa đổi hoặc tạo mới một câu hỏi tương đương cho môn ${subject} Lớp ${grade}:
Câu hỏi hiện tại:
${JSON.stringify(currentQuestion, null, 2)}

Yêu cầu chỉnh sửa của giáo viên: "${requestInstruction || 'Tạo câu hỏi mới tương đương về mức độ nhận thức và điểm số nhưng thay đổi ngữ cảnh hoặc số liệu'}"

Đảm bảo giữ nguyên:
- type: "${currentQuestion.type}"
- level: ${currentQuestion.level}
- points: ${currentQuestion.points}
- topic: "${currentQuestion.topic}"

Trả về JSON câu hỏi và đáp án:
{
  "question": {
    "id": ${currentQuestion.id},
    "number": ${currentQuestion.number},
    "type": "${currentQuestion.type}",
    "level": ${currentQuestion.level},
    "topic": "${currentQuestion.topic}",
    "content": "Nội dung mới",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "points": ${currentQuestion.points},
    "gridRequirement": ${Boolean(currentQuestion.gridRequirement)},
    "gridDetails": ${JSON.stringify(currentQuestion.gridDetails || null)}
  },
  "rubric": {
    "questionNumber": ${currentQuestion.number},
    "type": "${currentQuestion.type}",
    "answer": "Đáp án",
    "explanation": "Hướng dẫn chấm chi tiết",
    "points": ${currentQuestion.points}
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error refining question:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
