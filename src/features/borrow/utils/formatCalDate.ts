export const formatCalDate = (inputDate: number) : string => {
  // Convert the number to a string
  const dateString = inputDate.toString();

  // Validate input length
  if (dateString.length !== 8) {
    throw new Error('Input must be in YYYYMMDD format');
  }

  // Extract year, month, and day components
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);

  // Format and return the date as 'YYYY-MM-DD'
  return `${year}-${month}-${day}`;
}