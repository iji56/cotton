import { UsermetaReducerType } from '@/features/auth/types/usermetaReducerType';
import { supabase } from '@/lib/supabase';

export const getUserDetail = async (
  uid: string,
  id: string,
): Promise<UsermetaReducerType> => {
  const payload = {
    p_user_id: uid,
    p_blocker_id: id,
  };

  console.log('payload  : ', payload);

  const { data, error } = await supabase.rpc(
    'get_user_meta_with_profile_image_check_block_status',
    payload,
  );
  console.log('data', data);
  if (error) {
    console.log(error);
    throw Error(error.message);
  }
  return { ...data[0], user_picture: data[0]?.profile_image_url };
};
