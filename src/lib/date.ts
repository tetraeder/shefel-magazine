const HEBREW_MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
];

export function getHebrewMonth(month: number): string {
  return HEBREW_MONTHS[month - 1] || '';
}

export function formatIssueDate(month: number, year: number): string {
  return `${getHebrewMonth(month)} ${year}`;
}
