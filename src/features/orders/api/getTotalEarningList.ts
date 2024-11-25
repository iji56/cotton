import { supabase } from "@/lib/supabase"
import { listingFilters } from "../utils/keywords";

export const getTotalEarningList = async (uid: string, filtertext?: string) => {
    let filter = filtertext === listingFilters[0] ? 'all' :
        filtertext === listingFilters[1] ? 'last_7_days' :
            filtertext === listingFilters[2] ? 'last_month' :
                filtertext === listingFilters[3] ? 'last_3_months' : ''

    const payload = {
        p_user_id: uid,
        p_filter: filter
    };
    console.log("payload  : ", payload)
    const { data, error } = await supabase.rpc('fetch_total_earnings_listings', payload);

    if (error) {
        console.log("getTotalEarningList Error  :", error)
        throw new Error(error.message);
    }
    console.log(data)
    return data;
}