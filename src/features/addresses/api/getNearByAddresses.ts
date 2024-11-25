import axios from 'axios';
import { GOOGLE_MAP_API_KEY } from '@env'
import { Location } from 'react-native-get-location';

export const getNearByAddresses = async (location: Location) => {
    try {
        const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
        const response = await axios.get(`${url}?location=${location.latitude}%2C${location.longitude}&radius=1500&type=restaurant&key=${GOOGLE_MAP_API_KEY}`);

        return response.data
    } catch (error) {
        console.log("Error getting nearby addresses : ", error);
    }
}

