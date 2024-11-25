export const getNextFourDates = (dateString: string, days: number) => {
    const nextFourDates = [];

    for (let i = 0; i < days; i++) {
        // Parse date and avoid timezone differences by handling it manually
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day + i); // Create a date manually

        // Ensure it's in 'YYYY-MM-DD' format
        const yearStr = date.getFullYear();
        const monthStr = String(date.getMonth() + 1).padStart(2, '0');
        const dayStr = String(date.getDate()).padStart(2, '0');

        nextFourDates.push(`${yearStr}-${monthStr}-${dayStr}`);
    }

    return nextFourDates;
};

