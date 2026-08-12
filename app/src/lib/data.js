import { parseCSV, rowsToObjects } from './csv.js';

export const GRADE_ORDER = ['Excellence', 'Merit', 'Achieved', 'Not Achieved'];

const GRADEABLE_TEXT = new Set([
  'Achieved with Excellence',
  'Achieved with Merit',
  'Achieved',
  'Not Achieved',
]);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseNZDate(value) {
  if (!value) return null;
  const parts = value.split('/');
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  if (!day || !month || !year) return null;
  return new Date(Date.UTC(year, month - 1, day));
}

function toGradeBand(resultText) {
  const text = (resultText || '').trim();
  if (GRADEABLE_TEXT.has(text)) {
    if (text === 'Achieved with Excellence') return 'Excellence';
    if (text === 'Achieved with Merit') return 'Merit';
    return text; // 'Achieved' or 'Not Achieved'
  }
  const n = Number(text);
  if (text !== '' && !Number.isNaN(n)) {
    if (n < 50) return 'Not Achieved';
    if (n < 65) return 'Achieved';
    if (n < 80) return 'Merit';
    return 'Excellence';
  }
  return null;
}

function mondayOf(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = (d.getUTCDay() + 6) % 7; // Mon=0 .. Sun=6
  d.setUTCDate(d.getUTCDate() - dayNum);
  return d;
}

function formatDate(d) {
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

function weekKey(monday) {
  return monday.toISOString().slice(0, 10);
}

function weekLabel(monday) {
  const sunday = new Date(monday);
  sunday.setUTCDate(sunday.getUTCDate() + 6);
  const sameMonth = monday.getUTCMonth() === sunday.getUTCMonth();
  const start = sameMonth ? `${monday.getUTCDate()}` : formatDate(monday);
  return `${start}–${formatDate(sunday)}, ${sunday.getUTCFullYear()}`;
}

function splitName(lastFirst) {
  const [last, rest] = lastFirst.split(',').map((s) => s.trim());
  return { last: last || lastFirst, first: rest || '' };
}

export async function loadResults(url = '/data/results.csv') {
  const res = await fetch(url);
  const text = await res.text();
  const rows = rowsToObjects(parseCSV(text));

  const studentMap = new Map();
  const subjectSet = new Set();
  const weekMap = new Map();
  const records = [];

  for (const row of rows) {
    const grade = toGradeBand(row.zc_Result_Markbook);
    if (!grade) continue;
    const dateStr = row.Module_Publish_Date;
    const date = parseNZDate(dateStr);
    if (!date) continue;

    const studentId = row.zi_IDNumber || row.zc_Stu_Name_Last_First_Preferred;
    const { last, first } = splitName(row.zc_Stu_Name_Last_First_Preferred);

    if (!studentMap.has(studentId)) {
      studentMap.set(studentId, {
        id: studentId,
        name: row.zc_Stu_Name_Last_First_Preferred,
        last,
        first,
      });
    }

    const monday = mondayOf(date);
    const wKey = weekKey(monday);
    if (!weekMap.has(wKey)) {
      weekMap.set(wKey, { key: wKey, monday, label: weekLabel(monday) });
    }

    subjectSet.add(row.NZQA_Course);

    records.push({
      studentId,
      studentName: row.zc_Stu_Name_Last_First_Preferred,
      grade,
      week: wKey,
      subject: row.NZQA_Course,
      title: row.zc_Module_Title,
      teacher: row.zc_Teacher_Markbook_Name,
      date,
      dateLabel: dateStr,
      resultText: row.zc_Result_Markbook,
      comment: row.zc_Comment,
    });
  }

  const students = [...studentMap.values()].sort((a, b) =>
    a.last === b.last ? a.first.localeCompare(b.first) : a.last.localeCompare(b.last)
  );

  const weeks = [...weekMap.values()].sort((a, b) => a.monday - b.monday);

  const subjects = [...subjectSet].sort();

  return { students, weeks, subjects, records };
}

export function buildCellIndex(records) {
  // index[week][studentId][grade] = { count, records: [...] }
  const index = new Map();
  for (const r of records) {
    if (!index.has(r.week)) index.set(r.week, new Map());
    const byStudent = index.get(r.week);
    if (!byStudent.has(r.studentId)) byStudent.set(r.studentId, new Map());
    const byGrade = byStudent.get(r.studentId);
    if (!byGrade.has(r.grade)) byGrade.set(r.grade, { count: 0, records: [] });
    const cell = byGrade.get(r.grade);
    cell.count += 1;
    cell.records.push(r);
  }
  return index;
}

export function getCell(index, week, studentId, grade) {
  return index.get(week)?.get(studentId)?.get(grade) ?? { count: 0, records: [] };
}
