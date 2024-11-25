import { supabase } from "@/lib/supabase"

export const deleteAddress = async (uuid: string) => {
    const { data, error } = await supabase.rpc('delete_user_address', { address_id: uuid });

    if (error) {
        console.log("Error deleting user address : ", error);
        throw new Error(error.message);
    }
    console.log("delete address response : ", data)
    return data
}