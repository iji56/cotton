import { supabase } from "@/lib/supabase"

export const getUserListing = async (uid: string) => {
    const { data, error } = await supabase.rpc('get_user_listings', {
        p_user_id: uid
    });

    if (error) {
        console.log("error while gettig user listing : ", error)
        throw new Error(error.message)
    }
    return data;
}