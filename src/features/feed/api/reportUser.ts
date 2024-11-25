import { supabase } from '@/lib/supabase';

export const reportUser = async (reporterId: string, uid: string, ownerId: string, reason?: string, detail?: string) => {

    try {

        const payload = {
            p_reporter_id: reporterId,
            p_reported_item_id: uid,
            p_item_owner_id: ownerId,
            p_reason: reason,
            p_details: detail
        }
        console.log("report user payload  : ", payload)

        const { data, error } = await supabase.rpc('report_user', payload);
        if (error) {
            console.log("Error reporting user: ", error);
            throw new Error(error.message)
        }
        console.log("report user response  : ", data)
        return data
    } catch (error: any) {
        throw new Error(error.message);
    }
};
