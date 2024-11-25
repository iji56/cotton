import { supabase } from "@/lib/supabase"

export const getPendingPayouts = async (uid: string) => {
    const { data, error } = await supabase.rpc('get_lender_listings_pending_payout', {
        p_lender_id: uid
    });

    if (error) {
        console.log("Error gettign pending payouts  :", error)
        throw new Error(error.message);
    }

    return data;
}