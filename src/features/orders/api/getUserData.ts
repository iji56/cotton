import { supabase } from "@/lib/supabase"

export const getUserData = async (uid: string) => {

    console.log("payload : ", uid)
    const { data, error } = await supabase.rpc('get_user_data', {
        p_user_id: uid
    });

    if (error) {
        console.log("error while gettig user detail : ", error)
        throw new Error(error.message)
    }

    return data;
}