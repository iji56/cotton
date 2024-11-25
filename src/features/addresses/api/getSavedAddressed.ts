import { supabase } from "@/lib/supabase"

export const getSavedAddresses = async (uuid: string) => {
    const { data, error } = await supabase.rpc('get_user_addresses', { user_id: uuid });

    if (error) {
        console.log("Error getting saved address : ", error);
        throw new Error(error.message);
    }
    return data
}