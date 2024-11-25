import { supabase } from '@/lib/supabase';
import { errorToast } from '@/lib/toastConfig';

/**
 * Supabase auth functions
 *
 * Refs
 * - store  > auth
 * - screen > LoginMain
 *
 * Notes
 * - supabaseAuth() folds in both user signin and user signup
 *   as both functions' parameters and returns are the same
 * - sessionData formats supabaseAuth's return into store.user,
 *   referencing redux action type 'supabaseUser'
 */
type supabaseUser = {
  userEmail: string;
  userPassword: string;
  actionType: 'signin' | 'signup';
};

const pickSessionData = (data: any) => {
  return {
    uid: data.user?.id,
    email: data.user?.email,
    access_token: data.session?.access_token,
    refresh_token: data.session?.refresh_token,
    expires_at: data.session?.expires_at,
    expires_in: data.session?.expires_in,
  };
};

export const authSignIn = async ({
  userEmail,
  userPassword,
  actionType,
}: supabaseUser) => {
  try {
    let data = null;
    let error = null;

    if (actionType === 'signup') {
      ({ data, error } = await supabase.auth.signUp({
        email: userEmail,
        password: userPassword,
      }));
    } else if (actionType === 'signin') {
      ({ data, error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: userPassword,
      }));
    } else {
      throw new Error('Invalid action type');
    }

    if (error) {
      const errorMessage = error.message;
      errorToast(errorMessage);
      throw new Error(errorMessage);
    }

    let sessionData = pickSessionData(data);
    return sessionData;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};