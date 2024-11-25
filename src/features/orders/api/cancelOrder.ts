import { supabase } from "@/lib/supabase"
import { keywords } from "../utils/keywords";

export const cancelOrder = async (uid: string, status: 0 | 1, userId: string) => {
    const payload = {
        p_listing_borrow_id: uid,
        p_status: keywords.status.decline,
        p_canceled_by: status,
        p_lender_or_borrower_id: userId,
    }

    console.log("payload  : ", payload)

    const { data, error } = await supabase.rpc('decline_borrow_request_by_lender_or_borrower', payload);

    if (error) {
        console.log("error cancelling order : ", error)
        throw new Error(error.message)
    }

    console.log("cancel order response : ", data)
    return data;
}