import { supabase } from '@/lib/supabase';

export const resetPasswordRequest = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'com.rax.androd://cotton/reset-password',
  });

  if (error) {
    console.log('Error requesting reset password : ', error, data);
    throw new Error(error.message);
  }

  return data;
};
