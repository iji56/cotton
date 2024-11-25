import { supabase } from "@/lib/supabase";

export const favouriteList = async (
    uuid: string,
    listingId: string
) => {
    try {
        let { data, error } = await supabase.rpc('favourite_listing', {
            user_id: uuid,
            listing_id: listingId
        });

        if (error) throw new Error(error.message);

        console.log("favourite resposne  : ", data)
        // return data as ListingItem[];
    } catch (error) {
        throw new Error((error as Error).message);
    }
}