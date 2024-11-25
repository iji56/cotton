export function getCurrentDateFormatted() {
	const now = new Date();
	const formattedDate = now.toISOString().replace('T', ' ').replace(/\..+/, '') + '+00';
	return formattedDate;
}