export const validateCalDate = (dateString: string) => {
	const dateParts = dateString.split('-');
	const year = parseInt(dateParts[0]);
	const month = parseInt(dateParts[1]);
	const day = parseInt(dateParts[2]);

	// Check if the constructed date is valid based on the number of days in the month
	if (
			!isNaN(new Date(year, month - 1, day).getTime()) && // Validate if the date is a valid date
			day >= 1 && // Ensure the day is greater than or equal to 1
			day <= new Date(year, month, 0).getDate() // Ensure the day is within the valid range for the month
	) {
			return dateString
	} else {
			return false;
	}
};