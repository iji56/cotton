import { supabase } from "@/lib/supabase";
import { authError, authLogout } from "@/store/actions/authActions";
import { settingsClear } from "@/store/actions/settingsActions";
import { usermetaClear } from "@/store/actions/usermetaActions";
import { store } from "@/store/configureStore";

export const authDelete = async (id: string) => {
  try {
    let { error } = await supabase.auth.admin.deleteUser(id)

    if (error) {
      const errorMessage = (error as Error).message;
      throw new Error(errorMessage);
    }

    store.dispatch(authLogout());
    store.dispatch(usermetaClear());
    store.dispatch(settingsClear());
  } catch (error) {
    store.dispatch(authError(error as Error));
  }
};