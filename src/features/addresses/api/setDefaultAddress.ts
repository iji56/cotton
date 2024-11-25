import { supabase } from "@/lib/supabase"

export const saveDefaultAddress = async (uuid: string, addressId: string) => {
    const payload = {
        p_user_id: uuid,
        p_address_id: addressId
    }
    console.log("payload  : ", payload);

    const { data, error } = await supabase.rpc('set_default_address', payload);

    if (error) {
        console.log("Error setting user default address : ", error);
        throw new Error(error.message);
    }
    return data
}