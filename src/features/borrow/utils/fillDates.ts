import { palette } from "@/components/styles/theme";
import { formatCalDate } from "./formatCalDate";
import { validateCalDate } from "./validateCalDate"
import { colors } from "@/global/colors";

/**
   * To fill dates between beg/end, we iterate through the original 
   * array filled with only beg/end, and fill a new array with those
   * dates alongside the filled.
   * 
   * This function is used in two scenarios
   * 1. Fill taken Dates of a listing, or
   * 2. Fill dates between selected start and selected end dates.
   * 
   * Assumption: dates will always be even, and contain at
   * least two values (beg/end pair)
   * Note: users can only borrow 2 days in advanced, so we check against
   * date + 1, and omit from datesFilled. The marked dates on the cal override
   * minDates within the calendar component.
   */
interface DateDetails {
  selected: boolean;
  disableTouchEvent: boolean;
  selectedColor: string;
}

export const fillDates = (dates: number[], pickup: boolean, disabled?: boolean, referenceDate?: number) => {
  dates.sort((a, b) => a - b);
  let datesFilled: Record<string, DateDetails> = {};

  const reference = referenceDate ? referenceDate : parseInt(new Date().toISOString().split('T')[0].replace(/-/g, ''));

  if (dates.length >= 2 && dates.length % 2 === 0) {
    let beg = dates[0];
    let end = dates[1];

    let currentVal = beg;

    while (currentVal <= dates[dates.length - 1]) {
      // console.log(" : ", currentVal, dates,)
      // can't wrap if outside of currentVal ++ because of currentVal = beg
      if (currentVal >= beg && currentVal < end) {
        if (reference && currentVal >= reference) {
          let formattedCurrent = formatCalDate(currentVal);
          let validFormattedCurrent = validateCalDate(formattedCurrent)
          if (validFormattedCurrent) {
            datesFilled[formattedCurrent] = disabled
              ? { selected: false, disableTouchEvent: false, color: colors.background_opacity ,selectedColor: 'black' }
              : { selected: true, startingDay: currentVal === dates[0], color: currentVal === dates[0] ? palette.darkBlue : palette.lightBlue, disableTouchEvent: false, selectedColor: palette.darkBlue }
          }
        }
        currentVal++

      } else if (currentVal === end) {
        if (reference && currentVal >= reference) {
          let formattedCurrent = formatCalDate(currentVal);
          let validFormattedCurrent = validateCalDate(formattedCurrent)
          if (validFormattedCurrent) {
            datesFilled[formattedCurrent] = disabled
              ? { selected: false, disableTouchEvent: false, color: colors.background_opacity ,selectedColor: 'black' }
              : { selected: true, startingDay : dates[0] === dates[1], endingDay: true, color: palette.darkBlue, disableTouchEvent: false, selectedColor: palette.darkBlue }
          }
          beg = dates[dates.indexOf(end) + 1]
          end = dates[dates.indexOf(end) + 2]
        }
        currentVal = beg
        return datesFilled;
      }
    }
  }
  return datesFilled;
};