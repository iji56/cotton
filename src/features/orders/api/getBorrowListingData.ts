import { supabase } from "@/lib/supabase"

export const getBorrowListingData = async (uid: string) => {
    console.log("borrower palyload  :", uid)
    const { data, error } = await supabase.rpc('fetch_listing_borrow_data', {
        p_listing_borrow_id: uid
    });

    if (error) {
        console.log("error while gettig user borrow listing detail: ", error)
        throw new Error(error.message)
    }
    return data;
}