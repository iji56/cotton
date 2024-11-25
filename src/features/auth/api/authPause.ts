import { supabase } from "@/lib/supabase";
import { usermetaError, usermetaUpdate } from "@/store/actions/usermetaActions";
import { store } from "@/store/configureStore";

export const authPause = async (uid: string, paused: boolean) => {
  try {
    let { data, error } = await supabase
      .from('user_meta')
      .update({
        account_paused: `${paused ? false : true}`
      })
      .eq('id', uid)
      .select()

      if (error) throw new Error((error).message);
      if (data) store.dispatch(usermetaUpdate(data[0]))
  
    } catch (error) {
      store.dispatch(usermetaError((error as Error)))
    }
};