import { supabase } from '@/lib/supabase';

export const getReceiver = async (chat_room_id: string) => {
  try {
    let { data, error } = await supabase
      .from('chat_rooms')
      .select('user_b')
      .eq('id', chat_room_id);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
