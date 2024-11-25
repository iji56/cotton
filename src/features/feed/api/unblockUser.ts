import { supabase } from '@/lib/supabase';

export const unblockUser = async (blockerId: string, userId: string) => {

    try {
        const payload = {
            p_blocker_id: blockerId,
            p_blocked_id: userId
        }
        console.log("unblock user payload  : ", payload)

        const { data, error } = await supabase.rpc('unblock_user', payload);
        if (error) {
            console.log("Error unblocking user: ", error);
            throw new Error(error.message)
        }
        console.log("unblock user response  : ", data)
        return data
    } catch (error: any) {
        throw new Error(error.message);
    }
};
