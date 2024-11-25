import moment from "moment";

export const formatDate = (dateString: string) => {
    try {
        console.log("dateString : ", dateString)
        const [year, month, day] = dateString.split('-').map(Number);
        console.log(year, month, day)
        const date = new Date(year, month - 1, day);

        // Ensure valid date object
        if (isNaN(date.getTime())) {
            return formatDateString(dateString)
            // return "Invalid date";
        }

        // Month names with leading zeros for consistency
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Get month name, day, and year
        const monthIndex = date.getMonth();
        const monthName = monthNames[monthIndex];
        const days = date.getDate();

        // Get ordinal suffix (st, nd, rd, th) considering edge cases
        let suffix = "th";
        if (days === 1 || days === 21 || days === 31) {
            suffix = "st";
        } else if (days === 2 || days === 22) {
            suffix = "nd";
        } else if (days === 3 || days === 23) {
            suffix = "rd";
        }
        console.log(`${monthName} ${days}${suffix}, ${date.getFullYear()}`)
        // Format the date string
        return `${monthName} ${days}${suffix}, ${date.getFullYear()}`;
    } catch (error) {
        console.log("Error : ", error)
        return formatDateString(dateString)
    }
}

const formatDateString = (dateString: string) => {
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

export const formatDateTimeZone = (date: string) => moment(date, 'YYYY-MM-DD')
    .set({
        hour: new Date().getHours(),
        minute: new Date().getMinutes(),
        second: new Date().getSeconds(),
    })
    .format('YYYY-MM-DD HH:mm:ssZ');

export const getDatesBetween = (startDate: string, endDate: string) => {
    let dates = [];
    let currentDate = moment(startDate);
    const lastDate = moment(endDate);

    // Loop until we reach the end date
    while (currentDate.isSameOrBefore(lastDate)) {
        dates.push(currentDate.format('YYYY-MM-DD'));
        currentDate.add(1, 'day');
    }

    return dates;
}