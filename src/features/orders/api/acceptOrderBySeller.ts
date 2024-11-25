import { supabase } from "@/lib/supabase"
import { keywords } from "../utils/keywords";

type ShipmentResponse = {
    label_id: string,
    shipment_id: string,
    shipment_status: string;
    tracking_pin: string;
}


export const acceptOrderBySeller = async (uid: string, userId: string, shipmentDetails: ShipmentResponse[]) => {
    const payload = {
        p_listing_purchase_id: uid,
        p_new_status: keywords.status.inProgress, //'awaiting confirmation',
        p_purchaser_id: userId,
        p_shipment: shipmentDetails
    }
    console.log("payload : ", payload)
    const { data, error } = await supabase.rpc('accept_shipping_purchase_request_by_seller_or_buyer', payload);

    if (error) {
        console.log("Error accepting order by seller : ", error);
        throw new Error(error.message);
    }
    console.log("accept order response by seller : ", data)
    return data
}