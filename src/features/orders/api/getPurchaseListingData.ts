import { supabase } from "@/lib/supabase"

export const getPurchaseListingData = async (uid: string) => {
    console.log("purchase palyload  :", uid)
    const { data, error } = await supabase.rpc('fetch_listing_purchase_data', {
        p_listing_purchase_id: uid
    });

    if (error) {
        console.log("error while gettig user purchase listing detail: ", error)
        throw new Error(error.message)
    }
    return data;
}