import { supabase } from "@/lib/supabase"
import { keywords } from "../utils/keywords";

export const updateListingPurchaseStatus = async (uid: string, userId: string) => {

    const payload = {
        p_listing_purchase_id: uid,
        p_new_status: keywords.status.inProgress,
        p_purchaser_id: userId,
    }
    console.log("payload  : ", payload);

    const { data, error } = await supabase.rpc('accept_localpickup_purchase_request_by_seller_or_buyer', payload);

    if (error) {
        console.log("error updating listing purchase status local pickeup : ", error)
        throw new Error(error.message)
    }
    console.log("purchase listing status : ", data)
    return data;
}