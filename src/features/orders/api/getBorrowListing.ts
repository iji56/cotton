import { supabase } from "@/lib/supabase"

export const getBorrowListing = async (uid: string) => {

    const { data, error } = await supabase.rpc('get_listings_borrow_by_status', {
        p_lender_id: uid
    });

    if (error) {
        console.log("error while gettig user Borrow listing : ", error)
        throw new Error(error.message)
    }
    
    return data;
}