import { supabase } from "@/lib/supabase"

export const readNotification = async (id: string) => {
    const payload = {
        p_id: typeof id === 'string' ? parseInt(id) : id
    };

    console.log("payload : ", payload)
    const { data, error } = await supabase.rpc('mark_notification_as_read', payload);

    if (error) {
        console.log("Error updating message read status : ", error);
        throw new Error(error.message);
    }
    return data;
}