export const STORAGE_KEYS = {
  TOKEN: "tokenCLEANING",
} as const;

export const TIME_OPTIONS = (() => {
  // это все время с шагом в пять минут
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      options.push({
        label: timeString,
        value: timeString,
      });
    }
  }
  return options;
})();
