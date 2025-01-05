export function getDatesBetween(startDate: Date, endDate: Date): Array<Date> {
  const dates: Array<Date> = [];

  const currentDate = new Date(startDate);

  // eslint-disable-next-line no-unmodified-loop-condition
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export function getDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}
