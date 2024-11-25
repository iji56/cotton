import { supabase } from "../../../lib/supabase";

export const getChatMeta = async () => {
  try {
    let uid = '2d4e9f03-e4db-45bf-a316-0ec5ecc75824';
    let { data, error } = await supabase
      .from('chat_messages')
      .select(`
        id,
        user_id,
        message_body,
        created_at
      `)
      .eq('chat_room_id', uid)

    if (error) {
      throw new Error((error).message);
    }

  } catch(error) {
    throw new Error((error as Error).message);
  }
}