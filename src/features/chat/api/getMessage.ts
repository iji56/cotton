import { supabase } from '../../../lib/supabase';

export const getMessage = async (uid: string) => {
  try {
    let { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_room_id', uid);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
