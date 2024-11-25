import { supabase } from "@/lib/supabase"

export const checkListingBorrowStatus = async (uid: string) => {
    const payload = {
        p_listing_id: uid,
    }
    console.log("check_listing_borrow_status payload : ", payload)
    const { data, error } = await supabase.rpc('check_listing_borrow_status', payload);

    if (error) {
        console.log("Error checking listing borrow status : ", error)
        throw new Error(error.message)
    }

    return data;
}