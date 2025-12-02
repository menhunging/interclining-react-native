export function formatDateTime(dateString: string): string {
  // переводим дату вот в такой формат 14.07.25 | 16:30
  const date = new Date(dateString.replace(" ", "T"));

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}.${month}.${year} | ${hours}:${minutes}`;
}
