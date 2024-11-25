export const getCountryCode = async (country: string) => {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${country.trim()}`);
        const countryDetail = await response.json();
        return countryDetail[0]?.cca2

    } catch (error) {
        console.log("Error getting country code : ", error)
    }
}