import axios from 'axios';
import { GOOGLE_MAP_API_KEY } from '@env'

type Location = { latitude: number; longitude: number }

export const getDistanceBetweenTwoPoints = async (userLocation: Location, listingLocation: Location) => {
    try {
        console.log("find distance params : ", userLocation, listingLocation)
        const url = "https://maps.googleapis.com/maps/api/distancematrix/json";
        const response = await axios.get(`${url}?origins=${userLocation.latitude}%2C${userLocation.longitude}&destinations=${listingLocation.latitude}%2C${listingLocation.longitude}&key=${GOOGLE_MAP_API_KEY}`);

        if (response.data) {
            console.log("distance response : ", response.data.rows[0].elements[0])
            // distance in KM between two point
            return response.data.rows[0].elements[0].distance.text as string;
        }
        return null;
    } catch (error) {
        console.log("Error calculating distance : ", error);
        return null
    }
}

