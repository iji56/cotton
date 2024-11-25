import { supabase } from "@/lib/supabase"

export const getListingUpdateAddressStatus = async (uid: string) => {

    const { data, error } = await supabase.rpc('get_listings_purchased_update_status', {
        p_listings_purchased_id: uid,
    });

    if (error) {
        console.log("error getting listing update address status : ", error)
        throw new Error(error.message)
    }

    return data;
}