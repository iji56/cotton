import { supabase } from "@/lib/supabase"

export const deleteListing = async (uid: string) => {

    const { data, error } = await supabase.rpc('delete_listing', {
        p_listings_id: uid,
    });

    if (error) {
        console.log("error deleting listing : ", error)
        throw new Error(error.message)
    }

    console.log("deleted listing response : ", data)
    return data;
}