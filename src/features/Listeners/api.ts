import { supabase } from "@/lib/supabase"

export const fetchAllNotifications = async (uid: string) => {
    const { data, error } = await supabase.rpc('fetch_unread_notifications', {
        p_user_id: uid
    });

    if (error) {
        console.log("Error getting notifications : ", error.message);
    }

    return data
}