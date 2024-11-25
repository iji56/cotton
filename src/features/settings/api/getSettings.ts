import { supabase } from '@/lib/supabase';
import { store } from '@/store/configureStore';
import { settingsError } from '@/store/actions/settingsActions';
import { SettingsReducerType } from '../types/settingsReducerType';

/**
 * Fix TS error
 * probably has to do with the fact that error is inside the SettingsReducerType type.
 */
export const getSettings = async (uid: string): Promise<SettingsReducerType> => {
  try {
    let { data, error } = await supabase
      .from('user_settings')
      .select(`
        id,
        user_id,
        pref_occasion,
        pref_fit,
        pref_city,
        pref_theme,
        pref_pickup,
        pref_hide_size,
        notif_follow,
        notif_like,
        notif_borrow,
        notif_lend,
        notif_chat,
        email_follow,
        email_like,
        email_borrow,
        email_lend,
        email_chat
      `)
      .eq('user_id', uid);

    if (error) throw new Error((error).message);

    if (data) return data[0] as SettingsReducerType;

  } catch (error) {
    throw new Error((error as Error).message);
  }
};