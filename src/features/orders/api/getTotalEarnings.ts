import { supabase } from "@/lib/supabase"

export const getTotalEarnings = async (uid: string) => {
    const { data, error } = await supabase.rpc('get_total_earnings_by_user', {
        p_user_id: uid
    });

    if (error) {
        console.log("Error gettign total earnings  :", error)
        throw new Error(error.message);
    }

    return data;
}