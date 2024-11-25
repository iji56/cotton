import { supabase } from "@/lib/supabase";

export const getTotalPayouts = async (uid: string) => {

    const { error, data } = await supabase.rpc('calculate_total_payouts', {
        p_current_date: new Date().toISOString(),
        p_user_id: uid
    });

    if (error) {
        console.log("Error getting total payouts:  ", error);
    }

    return data
}