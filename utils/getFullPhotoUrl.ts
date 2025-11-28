export const getFullPhotoUrl = (path: string): string => {
  // для получения полного пути для фотки, с бэка приходит не полный путь
  const baseUrl = "https://api-clining.fourodev.ru";
  return `${baseUrl}${path}`;
};
