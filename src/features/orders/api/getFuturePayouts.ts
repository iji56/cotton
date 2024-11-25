import { supabase } from "@/lib/supabase";

export const getFuturePayouts = async (uid: string) => {
    const payload = {
        p_current_date: new Date().toISOString(),
        p_user_id: uid
    }
    console.log("payload : ", payload)
    const { error, data } = await supabase.rpc('fetch_future_payout_listings', payload);

    if (error) {
        console.log("Error getting total payouts:  ", error);
    }

    return data
}