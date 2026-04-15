export const getFullPhotoUrl = (path: string): string => {
  // для получения полного пути для фотки, с бэка приходит не полный путь
  const baseUrl = "https://api.in-cleaning.ru";
  return `${baseUrl}${path}`;
};
