import { supabase } from "@/lib/supabase"

export const getDefaultAddress = async (uuid: string) => {
    const payload = {
        p_user_id: uuid
    }
    console.log("payload  : ", payload);

    const { data, error } = await supabase.rpc('get_default_address_by_user_id', payload);

    if (error) {
        console.log("Error getting user default address : ", error);
        throw new Error(error.message);
    }
    return data
}