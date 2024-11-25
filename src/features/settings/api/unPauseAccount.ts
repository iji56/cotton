import { supabase } from "@/lib/supabase"

export const unPauseAccount = async (uid: string) => {
    const { data, error } = await supabase.rpc('unpause_user_account', {
        user_id: uid,
    });

    if (error) {
        console.log("Error unPausing account : ", error);
        throw new Error(error.message);
    };

    return data;
}