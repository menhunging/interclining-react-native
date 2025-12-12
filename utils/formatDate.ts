export function formatDate(dateString: number): string {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // месяцы с 0
  const day = String(date.getDate()).padStart(2, "0");

  const formatted = `${year}-${month}-${day}`; // "2025-01-01"

  return formatted;
}
