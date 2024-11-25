import { supabase } from "@/lib/supabase"

export const getFuturePayout = async (uid: string) => {
    const { data, error } = await supabase.rpc('get_total_future_payout', {
        p_user_id: uid
    });

    if (error) {
        console.log("Error gettign future payouts  :", error)
        throw new Error(error.message);
    }

    return data;
}