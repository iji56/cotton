import { supabase } from "@/lib/supabase"

export const getLenderListingAvailablePayout = async (uid: string) => {
    const payload = {
        input_date: new Date().toISOString(),
        u_id: uid
    }
    console.log("payload : ", payload)
    const { data, error } = await supabase.rpc('fetch_available_payout_listings', payload);

    if (error) {
        console.log("Error getting available payouts : ", error)
        throw new Error(error.message);
    }
    return data;
}