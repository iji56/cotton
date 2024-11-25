import { supabase } from "@/lib/supabase";

export const unfavouriteList = async (
    uuid: string,
    listingId: string
) => {
    try {
        const payload = {
            p_user_id: uuid,
            p_listing_id: listingId
        }
        console.log("payload : ", payload)
        let { data, error } = await supabase.rpc('unfavourite_listing', payload)

        console.log("error : ", error)
        if (error) throw new Error(error.message);

        console.log("unfavourite resposne  : ", data)
        // return data as ListingItem[];
    } catch (error) {
        console.log("Error unfavouriting listing : ", error)
        throw new Error((error as Error).message);
    }
}