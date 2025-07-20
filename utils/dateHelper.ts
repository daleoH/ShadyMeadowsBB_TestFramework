// Date generation utilities
export function generateBookingDates(maxDaysAhead: number, maxStayLength: number) {
  const daysAhead = Math.floor(Math.random() * maxDaysAhead) + 1;
  const checkInDate = new Date();
  checkInDate.setDate(checkInDate.getDate() + daysAhead);

  const stayLength = Math.floor(Math.random() * maxStayLength) + 1;
  const checkOutDate = new Date(checkInDate);
  checkOutDate.setDate(checkInDate.getDate() + stayLength);
  return { checkInDate, checkOutDate };
}

// Date formatting for YYYY-MM-DD and display
export function formatDateToYYYYMMDD(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatDateRangeToISOString(checkInDate: Date, checkOutDate: Date): string {
  const formattedCheckIn = formatDateToYYYYMMDD(checkInDate);
  const formattedCheckOut = formatDateToYYYYMMDD(checkOutDate);
  return `${formattedCheckIn} - ${formattedCheckOut}`;
}

export function formatDateForDisplay(date: Date): string {
  return date.toDateString();
}