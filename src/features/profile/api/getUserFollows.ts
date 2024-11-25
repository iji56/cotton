import { supabase } from "@/lib/supabase";
import { UserFollowRow } from "../types/userFollows";

export const getUserFollows = async (user_id: null | string): Promise<UserFollowRow[]> => {
  try {
    let { data, error } = await supabase
      .from('user_follows')
      .select('*')
      .eq('follow_id', user_id)

    if (error) throw new Error((error).message);

    return data as UserFollowRow[];
    
  } catch (error) {
    throw new Error((error as Error).message);
    console.log(error);
  }
}