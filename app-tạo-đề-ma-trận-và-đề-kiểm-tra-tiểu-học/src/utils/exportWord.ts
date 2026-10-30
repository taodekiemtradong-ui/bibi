import { ExamPackage } from '../types/exam';

export function exportExamToWord(pkg: ExamPackage) {
  const { header, matrix, specifications, questions, scoringGuide, readingPassage, vietnameseWriting, oralReading } = pkg;

  let content = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>${header.examTitle} - ${header.subject}</title>
<style>
  @page {
    size: A4 portrait;
    margin: 2cm 2cm 2cm 1.5cm;
    mso-page-orientation: portrait;
  }
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 13pt;
    line-height: 1.35;
    color: #000;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 12pt;
  }
  th, td {
    border: 1px solid #000;
    padding: 5pt;
    font-size: 11pt;
    vertical-align: middle;
  }
  th {
    background-color: #f2f2f2;
    font-weight: bold;
    text-align: center;
  }
  .no-border td {
    border: none;
    padding: 2pt 4pt;
  }
  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .bold { font-weight: bold; }
  .italic { font-style: italic; }
  .section-title {
    font-size: 13pt;
    font-weight: bold;
    margin-top: 14pt;
    margin-bottom: 6pt;
    text-transform: uppercase;
  }
  .page-break {
    page-break-before: always;
  }
  .grid-box {
    border: 1px dashed #777;
    background-color: #fafafa;
    padding: 10pt;
    margin: 8pt 0;
    font-size: 10pt;
    font-style: italic;
    color: #444;
  }
</style>
</head>
<body>

<!-- HEADER ĐỀ THI -->
<table class="no-border" style="width: 100%;">
  <tr>
    <td style="width: 50%; text-align: center; vertical-align: top;">
      <span style="font-size: 11pt; text-transform: uppercase;">${header.governingBody}</span><br/>
      <span style="font-size: 11pt; font-weight: bold; text-transform: uppercase;">${header.schoolName}</span><br/>
      <span>------------------------</span>
    </td>
    <td style="width: 50%; text-align: center; vertical-align: top;">
      <span style="font-size: 12pt; font-weight: bold;">${header.examTitle}</span><br/>
      <span style="font-size: 11pt; font-weight: bold;">NĂM HỌC ${header.academicYear}</span><br/>
      <span style="font-size: 11pt; font-weight: bold;">MÔN: ${header.subject.toUpperCase()} - LỚP ${pkg.grade}</span><br/>
      <span style="font-size: 10pt; font-style: italic;">(Thời gian làm bài: ${header.duration})</span>
    </td>
  </tr>
</table>

<table style="width: 100%; margin-top: 10pt;">
  <tr>
    <td style="width: 25%; height: 75pt; vertical-align: top;">
      <span class="bold">Điểm:</span><br/><br/>
      <span class="italic">Bằng số: .........</span><br/>
      <span class="italic">Bằng chữ: .......</span>
    </td>
    <td style="width: 45%; vertical-align: top;">
      <span class="bold">Lời nhận xét của thầy cô giáo:</span><br/>
      ....................................................................................<br/>
      ....................................................................................
    </td>
    <td style="width: 30%; vertical-align: top;">
      <span class="bold">Họ và tên:</span> ....................................<br/>
      <span class="bold">Lớp:</span> ....................<br/>
      <span class="bold">Giám khảo:</span> ................................
    </td>
  </tr>
</table>

<!-- NỘI DUNG ĐỀ THI -->
<div class="section-title text-center">NỘI DUNG ĐỀ KIỂM TRA</div>

${oralReading ? `
<div style="margin-bottom: 10pt;">
  <div class="bold">I. KIỂM TRA ĐỌC THÀNH TIẾNG (${oralReading.points} ĐIỂM)</div>
  <div class="italic">${oralReading.instructions}</div>
</div>
` : ''}

${readingPassage ? `
<div style="margin-bottom: 12pt;">
  <div class="bold">II. ĐỌC HIỂU (${pkg.subject === 'Tiếng Việt' ? '7' : '...'} ĐIỂM)</div>
  <div class="text-center bold" style="font-size: 12pt; margin-top: 4pt;">${readingPassage.title}</div>
  <div class="text-center italic" style="font-size: 10pt; margin-bottom: 6pt;">(Tác giả: ${readingPassage.author} - Độ dài: ${readingPassage.wordCount} chữ)</div>
  <div style="text-align: justify; text-indent: 1.5em; line-height: 1.4; margin-bottom: 8pt; border-left: 2px solid #ccc; padding-left: 8pt;">
    ${readingPassage.content.split('\n').map(p => `<p style="margin: 3pt 0;">${p}</p>`).join('')}
  </div>
</div>
` : ''}

<div>
  ${questions.map(q => `
    <div style="margin-bottom: 8pt; page-break-inside: avoid;">
      <span class="bold">Câu ${q.number}</span> <span class="italic">(${q.points} điểm - [${q.type === 'TN' ? 'Trắc nghiệm' : 'Tự luận'}] - Mức ${q.level}):</span> ${q.content.replace(/\n/g, '<br/>')}
      ${q.options && q.options.length > 0 ? `
        <table class="no-border" style="width: 100%; margin-top: 2pt;">
          <tr>
            ${q.options.map(opt => `<td style="width: ${100 / q.options!.length}%; font-size: 11pt;">${opt}</td>`).join('')}
          </tr>
        </table>
      ` : ''}
      ${q.gridRequirement ? `
        <div class="grid-box">
          [Khung lưới ô vuông tiểu học ${q.gridDetails?.rows || 5} hàng x ${q.gridDetails?.cols || 12} cột để học sinh trình bày bài vẽ hoặc đặt tính]
          ${q.gridDetails?.instructions ? `<br/>* Hướng dẫn: ${q.gridDetails.instructions}` : ''}
        </div>
      ` : ''}
    </div>
  `).join('')}
</div>

${vietnameseWriting ? `
<div style="margin-top: 14pt;">
  <div class="bold">III. KIỂM TRA VIẾT (${vietnameseWriting.points} ĐIỂM)</div>
  <div style="margin-top: 4pt;">${vietnameseWriting.prompt}</div>
  <div class="grid-box" style="height: 120pt;">
    [Khung kẻ ô ly tiểu học để học sinh viết bài văn / đoạn văn]
  </div>
</div>
` : ''}

<!-- TRANG MỚI: MA TRẬN & BẢN ĐẶC TẢ -->
<div class="page-break"></div>

<div class="section-title text-center">MA TRẬN ĐỀ KIỂM TRA ĐỊNH KÌ THEO THÔNG TƯ 27 - GDPT 2018</div>
<div class="text-center italic" style="margin-bottom: 8pt;">Môn: ${header.subject} - Lớp ${pkg.grade} (${header.examTitle})</div>

<table>
  <thead>
    <tr>
      <th rowspan="2">TT</th>
      <th rowspan="2" style="width: 25%;">Chủ đề / Mạch kiến thức</th>
      <th colspan="2">Mức 1 (50%)</th>
      <th colspan="2">Mức 2 (30%)</th>
      <th colspan="2">Mức 3 (20%)</th>
      <th colspan="2">Tổng cộng</th>
      <th rowspan="2">Tỉ lệ %</th>
    </tr>
    <tr>
      <th>TNKQ</th>
      <th>TL</th>
      <th>TNKQ</th>
      <th>TL</th>
      <th>TNKQ</th>
      <th>TL</th>
      <th>Số câu</th>
      <th>Điểm</th>
    </tr>
  </thead>
  <tbody>
    ${matrix.map((row, idx) => `
      <tr>
        <td class="text-center">${idx + 1}</td>
        <td>
          <span class="bold">${row.topic}</span>
          ${row.periodRatio ? `<br/><span class="italic" style="font-size: 9pt;">(${row.periodRatio})</span>` : ''}
        </td>
        <td class="text-center">${row.level1TN.questions > 0 ? `${row.level1TN.questions}c (${row.level1TN.points}đ)` : '-'}</td>
        <td class="text-center">${row.level1TL.questions > 0 ? `${row.level1TL.questions}c (${row.level1TL.points}đ)` : '-'}</td>
        <td class="text-center">${row.level2TN.questions > 0 ? `${row.level2TN.questions}c (${row.level2TN.points}đ)` : '-'}</td>
        <td class="text-center">${row.level2TL.questions > 0 ? `${row.level2TL.questions}c (${row.level2TL.points}đ)` : '-'}</td>
        <td class="text-center">${row.level3TN.questions > 0 ? `${row.level3TN.questions}c (${row.level3TN.points}đ)` : '-'}</td>
        <td class="text-center">${row.level3TL.questions > 0 ? `${row.level3TL.questions}c (${row.level3TL.points}đ)` : '-'}</td>
        <td class="text-center bold">${row.totalQuestions}</td>
        <td class="text-center bold">${row.totalPoints.toFixed(1)}</td>
        <td class="text-center bold">${row.percentage}%</td>
      </tr>
    `).join('')}
    <tr style="background-color: #f9f9f9;">
      <td colspan="2" class="text-center bold">Tổng điểm theo mức</td>
      <td colspan="2" class="text-center bold">${pkg.matrixSummary.level1Points.toFixed(1)}đ (${((pkg.matrixSummary.level1Points / pkg.matrixSummary.totalPoints) * 100).toFixed(0)}%)</td>
      <td colspan="2" class="text-center bold">${pkg.matrixSummary.level2Points.toFixed(1)}đ (${((pkg.matrixSummary.level2Points / pkg.matrixSummary.totalPoints) * 100).toFixed(0)}%)</td>
      <td colspan="2" class="text-center bold">${pkg.matrixSummary.level3Points.toFixed(1)}đ (${((pkg.matrixSummary.level3Points / pkg.matrixSummary.totalPoints) * 100).toFixed(0)}%)</td>
      <td class="text-center bold">${questions.length}</td>
      <td class="text-center bold">${pkg.matrixSummary.totalPoints.toFixed(1)}đ</td>
      <td class="text-center bold">100%</td>
    </tr>
    <tr style="background-color: #f0f0f0;">
      <td colspan="2" class="text-center bold">Tỉ lệ hình thức</td>
      <td colspan="6" class="text-center bold">Trắc nghiệm: ${pkg.matrixSummary.tnPoints.toFixed(1)} điểm (${((pkg.matrixSummary.tnPoints / pkg.matrixSummary.totalPoints) * 100).toFixed(0)}%) — Tự luận: ${pkg.matrixSummary.tlPoints.toFixed(1)} điểm (${((pkg.matrixSummary.tlPoints / pkg.matrixSummary.totalPoints) * 100).toFixed(0)}%)</td>
      <td colspan="3" class="text-center bold">Tổng: ${pkg.matrixSummary.totalPoints.toFixed(1)} điểm</td>
    </tr>
  </tbody>
</table>

<!-- BẢN ĐẶC TẢ MA TRẬN ĐỀ -->
<div class="section-title text-center" style="margin-top: 18pt;">BẢN ĐẶC TẢ MA TRẬN ĐỀ KIỂM TRA ĐỊNH KÌ</div>

<table>
  <thead>
    <tr>
      <th style="width: 5%;">TT</th>
      <th style="width: 25%;">Mạch kiến thức / Kĩ năng</th>
      <th style="width: 45%;">Yêu cầu cần đạt</th>
      <th style="width: 10%;">Mức độ</th>
      <th style="width: 8%;">Hình thức</th>
      <th style="width: 7%;">Câu số / Điểm</th>
    </tr>
  </thead>
  <tbody>
    ${specifications.map((spec, i) => `
      <tr>
        <td class="text-center">${i + 1}</td>
        <td>${spec.topic}</td>
        <td>${spec.objective}</td>
        <td class="text-center">${spec.level}</td>
        <td class="text-center">${spec.type}</td>
        <td class="text-center bold">${spec.questionNumber}<br/><span style="font-size: 9pt;">(${spec.points}đ)</span></td>
      </tr>
    `).join('')}
  </tbody>
</table>

<!-- HƯỚNG DẪN CHẤM VÀ BIỂU ĐIỂM -->
<div class="page-break"></div>

<div class="section-title text-center">HƯỚNG DẪN CHẤM VÀ BIỂU ĐIỂM CHI TIẾT</div>

<table>
  <thead>
    <tr>
      <th style="width: 8%;">Câu số</th>
      <th style="width: 12%;">Hình thức</th>
      <th style="width: 20%;">Đáp án</th>
      <th style="width: 48%;">Hướng dẫn chấm chi tiết</th>
      <th style="width: 12%;">Điểm</th>
    </tr>
  </thead>
  <tbody>
    ${scoringGuide.map(s => `
      <tr>
        <td class="text-center bold">Câu ${s.questionNumber}</td>
        <td class="text-center">${s.type === 'TN' ? 'Trắc nghiệm' : 'Tự luận'}</td>
        <td class="bold">${s.answer}</td>
        <td>
          ${s.explanation}
          ${s.steps && s.steps.length > 0 ? `
            <div style="margin-top: 4pt; font-size: 10pt;">
              ${s.steps.map(step => `<div>- ${step.step}: <span class="bold">${step.points} điểm</span></div>`).join('')}
            </div>
          ` : ''}
        </td>
        <td class="text-center bold">${s.points} điểm</td>
      </tr>
    `).join('')}
  </tbody>
</table>

${vietnameseWriting ? `
<div style="margin-top: 14pt;">
  <div class="bold">HƯỚNG DẪN CHẤM PHẦN VIẾT (${vietnameseWriting.points} ĐIỂM):</div>
  <pre style="white-space: pre-wrap; font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.4; margin-top: 4pt; background-color: #f9f9f9; padding: 6pt; border: 1px solid #ddd;">${vietnameseWriting.guidelines}</pre>
</div>
` : ''}

</body>
</html>
  `;

  const blob = new Blob(['\ufeff' + content], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `De_Kiem_Tra_${pkg.subject}_Lop${pkg.grade}_${pkg.header.academicYear.replace(/\s+/g, '')}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
