import { supabase } from "@/lib/supabase"

export const deleteAccount = async (uid: string) => {
    const { data, error } = await supabase.rpc('delete_user_account', {
        user_id: uid,
    });

    if (error) {
        console.log("Error deleting account : ", error);
        throw new Error(error.message);
    };

    return data;
}