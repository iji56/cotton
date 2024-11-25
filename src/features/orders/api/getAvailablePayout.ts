import { supabase } from "@/lib/supabase"

export const getAvailablePayout = async (uid: string) => {
    const { data, error } = await supabase.rpc('get_total_paidamounts_by_user', {
        p_user_id: uid
    });

    if (error) {
        console.log("Error gettign available payout amount  :", error)
        throw new Error(error.message);
    }

    return data;
}