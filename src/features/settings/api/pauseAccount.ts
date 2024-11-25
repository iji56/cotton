import { supabase } from "@/lib/supabase"

export const pauseAccount = async (uid: string, startDate: string, endDate: string) => {
    const { data, error } = await supabase.rpc('pause_user_account', {
        user_id: uid,
        start_date: startDate,
        end_date: endDate,
    });

    if (error) {
        console.log("Error pausing account : ", error);
        throw new Error(error.message);
    };

    return data;
}