import { convertDateStringToNumber } from "./convertDateStringToNumber";

/**
 * When a user selects an end date, before we can fill the range between
 * start and end, we must check if there are collisions with disabledDates
 * 
 * 0. start/end are converted from str to int for easy iteration
 * 1. checks if start or end is larger, start at smaller value
 * 2. if start is within disabledDates keys, collision. Otherwise, ++
 * 
 * Note: when iterating a numeric date, we may come across a date that does not
 * exist. i.e. Jan 32
 * 
 * @param start          start date
 * @param end            end date
 * @param disabledDates  disabled dates to compare 
 * @returns 
 */
export const checkDateCollisions = (
  start: number,
  end: number,
  disabledDates: Record<string, any>
): boolean  => {
  
  // Ensure start is always less than or equal to end
  if (start > end) {
    [start, end] = [end, start]; // Swap values if start is greater than end
  }

  for (let currentDate = start; currentDate <= end; currentDate++) {
    // is currentDate an actual date?
    // if so, do below
    // else, return
    const currentDateStr = currentDate.toString();
    // Convert YYYYMMDD back to YYYY-MM-DD for key comparison
    const dateString = `${currentDateStr.slice(0, 4)}-${currentDateStr.slice(4, 6)}-${currentDateStr.slice(6, 8)}`;

    if (dateString in disabledDates) {
      return true;
    }

    // Increment currentDate to the next day
    // Note: Directly incrementing the numeric date might not always work due to month/year boundaries
    let tempDate = new Date(parseInt(currentDateStr.slice(0, 4)), parseInt(currentDateStr.slice(4, 6)) - 1, parseInt(currentDateStr.slice(6, 8)));
    tempDate.setDate(tempDate.getDate() + 1);
    currentDate = convertDateStringToNumber(tempDate.toISOString().split('T')[0]);
  }

  return false; // No collisions found
}