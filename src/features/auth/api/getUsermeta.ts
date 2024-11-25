import { supabase } from '@/lib/supabase';
import { UsermetaReducerType } from '../types/usermetaReducerType';

export const getUsermeta = async (uid: string): Promise<UsermetaReducerType> => {

  const payload = {
    p_user_id: uid
  }

  console.log("payload  : ", payload);

  const { data, error } = await supabase.rpc('get_user_meta_with_profile_image', payload)
  console.log("data", data)
  if (error) {
    console.log(error);
    throw Error(error.message)
  }
  return { ...data[0], user_picture: data[0]?.profile_image_url }

};