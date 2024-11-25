import { supabase } from "@/lib/supabase"

export const checkListingBorrowDates = async (uid: string) => {
    const payload = {
        p_listing_id: uid,
    }
    console.log("fetch_borrow_dates payload : ", payload)
    const { data, error } = await supabase.rpc('fetch_borrow_dates', payload);

    if (error) {
        console.log("Error getting listing borrow dates : ", error)
        throw new Error(error.message)
    }

    return data;
}