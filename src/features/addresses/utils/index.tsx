import { GOOGLE_MAP_API_KEY } from '@env'
// Fallback function to get postal code from coordinates using multiple geocoding services
export const getPostalCodeFromCoordinates = async (lat: number, lng: number) => {
    const googleApiKey = GOOGLE_MAP_API_KEY;
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleApiKey}`);
    const data = await response.json();

    if (data.results.length > 0) {
        const addressComponents = data.results[0].address_components;
        const postalCodeComponent = addressComponents.find(component => component.types.includes("postal_code"));

        if (postalCodeComponent) {
            return postalCodeComponent.long_name;
        }
        return undefined
    }
    return undefined
}