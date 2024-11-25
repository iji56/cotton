import { supabase } from '@/lib/supabase';

export const fetchBlockedUsers = async (userId: string) => {

    try {

        const payload = {
            p_blocker_id: userId,
        }
        console.log("fetchBlockedUsers user payload  : ", payload)

        const { data, error } = await supabase.rpc('fetch_blocked_users', payload);
        if (error) {
            console.log("Error fetching blocked users: ", error);
            throw new Error(error.message)
        }
        console.log("fetchBlockedUsers response  : ", data)
        return data
    } catch (error: any) {
        throw new Error(error.message);
    }
};
