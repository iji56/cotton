import { supabase } from '@/lib/supabase';

export const reportListing = async (reporterId: string, uid: string, ownerId: string, reason?: string, detail?: string) => {

    try {

        const payload = {
            p_reporter_id: reporterId,
            p_reported_item_id: uid,
            p_item_owner_id: ownerId,
            p_reason: reason,
            p_details: detail
        }
        console.log("report listing payload  : ", payload)

        const { data, error } = await supabase.rpc('report_product', payload);
        if (error) {
            console.log("Error  reporting listing: ", error);
            throw new Error(error.message)
        }
        console.log("report listing response  : ", data)
        return data
    } catch (error: any) {
        throw new Error(error.message);
    }
};
