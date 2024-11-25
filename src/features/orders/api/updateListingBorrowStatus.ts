import { supabase } from "@/lib/supabase"
import { keywords } from "../utils/keywords";

export const updateListingBorrowStatus = async (uid: string, borrowerId: string) => {

    const payload = {
        p_listing_borrow_id: uid,
        p_new_status: keywords.status.inProgress,
        p_borrower_id: borrowerId,
    }
    console.log("payload  : ", payload);

    const { data, error } = await supabase.rpc('accept_borrower_localpickup_request_by_lender', payload);

    if (error) {
        console.log("error updating listing borrow status local : ", error)
        throw new Error(error.message)
    }
    console.log("borrow listing status : ", data)
    return data;
}