export const getHijriDateString = (date: Date): string => {
  return new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export const generateCalendarGrid = (currentDate: Date) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const startDayIndex = firstDayOfMonth.getDay();

  const adjustedStart = startDayIndex === 0 ? 6 : startDayIndex - 1;

  const weeks: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = [];

  // Add empty slots for previous month's padding
  for (let i = 0; i < adjustedStart; i++) {
    currentWeek.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    currentWeek.push(dateObj);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
};
