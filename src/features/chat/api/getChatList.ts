import { supabase } from "../../../lib/supabase";
import { ChatMainData } from "../types/chatMain";

/**
 * TODO: get user profile images
 *
 * Query rundown
 * 1. Chatroom metadata (id, user_a, user_b)
 * 2. User metadata (id, username)
 * 3. Message snippet (id, user_id, message_body, created_at)
 * 
 * .or will check either user_a or user_b column for user
 * .order sorts messages sent from newest to oldest
 * .limit grabs the single most newest message
 * 
 * @param uid
 * @return ChatMainData[] | error
 */
export const getChatList = async (uid: null | string): Promise<ChatMainData[]> => {

  try {
    let { data, error } = await supabase
      .from('chat_rooms')
      .select(`
        id,
        user_a,
        user_b,
        usermeta_a:user_meta!user_a(
          id, 
          user_name,
          images!id(url_path, profile)
        ),
        usermeta_b:user_meta!user_b(
          id, 
          user_name,
          images!id(url_path, profile)
        ),
        newest_message:chat_messages!id(id, user_id, message_body, created_at)
      `)
      .or(`user_a.eq.${uid},user_b.eq.${uid}`)
      .order('created_at', { foreignTable: 'chat_messages', ascending: false })
      .limit(1, {foreignTable: 'chat_messages'})

    if (error) throw new Error((error).message);

    return data as ChatMainData[];

  } catch(error) {
    throw new Error((error as Error).message);
  }
}