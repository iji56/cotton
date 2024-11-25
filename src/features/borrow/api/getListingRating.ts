import { supabase } from "@/lib/supabase"

export const getListingRating = async (uid: string) => {
    const { data, error } = await supabase.rpc('get_average_rating_by_listing', {
        p_listing_id: uid,
    });

    if (error) {
        console.log("Error getting listing rating : ", error.message);
        throw new Error(error.message)
    }
    return data
}