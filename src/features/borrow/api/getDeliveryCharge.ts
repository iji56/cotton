import { SUPABASE_ANON_KEY, STRIP_EDGE_FUNCTIONS_BASE_URL } from '@env'

export const getDeliveryCharge = async (originPostalCode: string, destinationPostalCode: string) => {
    try {
        console.log("origin : ", originPostalCode, " destination : ", destinationPostalCode)
        const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/cp-price-estimate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
                "origin": {
                    "postalCode": originPostalCode.split(" ").join("").toUpperCase(),
                },
                "destination": {
                    "postalCode": destinationPostalCode.split(" ").join("").toUpperCase(),
                },
                "packageDetails": {
                    "item_weight": 10,
                    "item_length": 30,
                    "item_width": 20,
                    "item_height": 10
                }
            }),
        }
        );
        if (response.ok) {
            const data = await response.json();
            console.log("Data: ", data)
            return data
        } else {
            console.log("Error getting delivery charge: ", await response.json())
            return null
        }

    }
    catch (error) {
        console.log("Error getting delivery charge : ", error)
    }
}