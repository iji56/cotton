export const formatDateSB = (dateString: string): number => {
  const regex = /^(\d{4})-(\d{2})-(\d{2})T/;
  const match = dateString.match(regex);
  if (match) {
    // Concatenate the matched groups (year, month, day) without dashes
    const formattedDate = match[1] + match[2] + match[3];
    return parseInt(formattedDate, 10); // Convert the formatted string to an integer
  } else {
    throw new Error("Invalid date format");
  }
}

export const parseNumericDateSB = (numericDate: number): Date => {
  const numericDateString = numericDate.toString();
  
  if (numericDateString.length === 8) {
    const year = parseInt(numericDateString.substring(0, 4), 10);
    const month = parseInt(numericDateString.substring(4, 6), 10) - 1; // Subtract 1 since months are zero-based in JavaScript Date
    const day = parseInt(numericDateString.substring(6, 8), 10);

    return new Date(year, month, day);
  } else {
    throw new Error("Invalid numeric date format");
  }
};