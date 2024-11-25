import { STRIP_EDGE_FUNCTIONS_BASE_URL, SUPABASE_ANON_KEY } from "@env";

export interface Event {
    eventDescription: string | null;
    eventDateTime: string | null;
    location: string | null;
}

export interface DeliveryOptionsResponse {
    data: {
        code: string | null;
        deliveryOptions: string[];
        description: string | null;
        destination: string;
        events: Event[]; // Adjust the type based on the actual structure of events
        expectedDeliveryDate: string; // Use Date type if you're going to convert it later
        reasonForDelay: string | null;
        service: string;
        trackingNumber: string;
        updatedDeliveryDate: string | null;
    };
    success: boolean;
}

export const getShippingDetail = async (trackingNumber = 123456789012): Promise<DeliveryOptionsResponse | undefined> => {
    try {
        const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/track-shipment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
                "trackingNumber": 123456789012
            }),
        });
        const data = await response.json();
        console.log("get shipping detail response : ", data);

        return data
    } catch (error) {
        console.log("Error getting shippping details  : ", error)
        return undefined;
    }
}