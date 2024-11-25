import { supabase } from "@/lib/supabase"

export const getAccountPausedStatus = async (uid: string) => {
    const { data, error } = await supabase.rpc('get_user_pause_status', {
        p_user_id: uid
    });

    if (error) {
        console.log("Error getting account paused status: ", error);
        throw new Error(error.message);
    };

    return data;
}