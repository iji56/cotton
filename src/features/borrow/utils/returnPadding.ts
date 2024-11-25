import { formatCalDate } from "./formatCalDate";
import { validateCalDate } from "./validateCalDate"

//TODO: maybe break this out if it needs to be used elsewhere but it probably doesn't, Matt's call!
function getDateAfterDays(startDate:string, days:number) {
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(startDateObj.getTime() + days * 24 * 60 * 60 * 1000);
  const formattedEndDate = `${endDateObj.getFullYear()}-${(endDateObj.getMonth() + 1).toString().padStart(2, '0')}-${endDateObj.getDate().toString().padStart(2, '0')}`;
  return formattedEndDate;
}

export const addReturnPadding = (selectedDates: string[], pickup: boolean) => {
	//Get the number of pickup days either 2 or 7 and get the valid range with padding added.
	let arrayLength = selectedDates.length + (pickup ? 2 : 7);
	let startDate = selectedDates[0];
	let endDate = getDateAfterDays(startDate, arrayLength);

	//Create the empty holding array and get the number values of the start and end dates.
	let paddedDates = [];
	let startDateNumber = parseInt(startDate.split('-').join(''));
	let endDateNumber = parseInt(endDate.split('-').join(''));
	let currentVal = startDateNumber;

	//While the current Value is less than or equal to the end date add ONLY valid dates in the correct format to the array.
	while (currentVal <= endDateNumber) {
				let formattedCurrent = formatCalDate(currentVal);
				let validFormattedCurrent = validateCalDate(formattedCurrent)
				if (validFormattedCurrent) {
					paddedDates.push(formattedCurrent);
				}
			currentVal ++
	}
  
  return paddedDates;
};