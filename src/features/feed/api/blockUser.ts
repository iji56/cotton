import { supabase } from '@/lib/supabase';

export const blockUser = async (blockerId: string, userId: string) => {

    try {
        const payload = {
            p_blocker_id: userId,
            p_blocked_id: blockerId
        }
        console.log("block user payload  : ", payload)

        const { data, error } = await supabase.rpc('block_user', payload);
        if (error) {
            console.log("Error blocking user: ", error);
            throw new Error(error.message)
        }
        console.log("block user response  : ", data)
        return data
    } catch (error: any) {
        throw new Error(error.message);
    }
};
