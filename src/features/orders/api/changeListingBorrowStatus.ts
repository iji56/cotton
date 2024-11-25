import { supabase } from "@/lib/supabase"
import { keywords } from "../utils/keywords";
type ShipmentResponse = {
    label_id: string,
    shipment_id: string,
    shipment_status: string;
    tracking_pin: string;
}

export const changeListingBorrowStatus = async (uid: string, borrowerId: string, shipmentDetail: ShipmentResponse[]) => {

    const payload = {
        p_listing_borrow_id: uid,
        p_new_status: keywords.status.inProgress,
        p_borrower_id: borrowerId,
        p_shipments: shipmentDetail
    }
    console.log("payload  : ", payload);

    const { data, error } = await supabase.rpc('accept_borrower_shipping_request_by_lender', payload);

    if (error) {
        console.log("error updating listing borrow status : ", error)
        throw new Error(error.message)
    }
    console.log("borrow listing status : ", data)
    return data;
}