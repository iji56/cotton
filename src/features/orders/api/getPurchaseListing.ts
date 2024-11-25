import { supabase } from "@/lib/supabase"

export const getPurchaseListing = async (uid: string) => {
    console.log("purchase palyload  :", uid)
    const { data, error } = await supabase.rpc('get_listingspurchasedv1', {
        p_user_id: uid
    });

    if (error) {
        console.log("error while gettig user purchase listing : ", error)
        throw new Error(error.message)
    }
    return data;
}