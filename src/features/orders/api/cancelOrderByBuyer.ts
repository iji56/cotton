import { supabase } from "@/lib/supabase"
import { keywords } from "../utils/keywords";

export const cancelOrderByBuyer = async (uid: string, status: 0 | 1, userId: string) => {
    const payload = {
        p_listing_id: uid,
        p_status: keywords.status.decline,
        p_canceled_by: status,
        p_seller_or_buyer_id: userId,
    }

    console.log("cancell request payload: ", payload)

    const { data, error } = await supabase.rpc('decline_purchase_request_by_seller_or_buyer', payload);

    if (error) {
        console.log("Error cancelling order  : ", error);
        throw new Error(error.message);
    }
    console.log("cancel order response : ", data)
    return data
}