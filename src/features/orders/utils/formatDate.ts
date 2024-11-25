export const formatDate = (dateString: string) => {
    // Parse the date string into a JavaScript Date object
    const date = new Date(dateString);

    // Ensure valid date object
    if (isNaN(date.getTime())) {
        return "Invalid date";
    }

    // Month names with leading zeros for consistency
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Get month name, day, and year
    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];
    const day = date.getDate();

    // Get ordinal suffix (st, nd, rd, th) considering edge cases
    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) {
        suffix = "st";
    } else if (day === 2 || day === 22) {
        suffix = "nd";
    } else if (day === 3 || day === 23) {
        suffix = "rd";
    }

    // Format the date string
    return `${monthName} ${day}${suffix}, ${date.getFullYear()}`;
}