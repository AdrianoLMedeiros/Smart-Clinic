export function isWeekendISO(dateStr: string): boolean {
  // dateStr esperado: YYYY-MM-DD
  // Forçamos meia-noite local pra evitar “virar o dia” por timezone
  const d = new Date(`${dateStr}T00:00:00`);
  const day = d.getDay(); // 0 dom, 6 sáb
  return day === 0 || day === 6;
}