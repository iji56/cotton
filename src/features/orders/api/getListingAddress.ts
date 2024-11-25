import { supabase } from '@/lib/supabase';

export const getListingAddressByUserID = async (uid: string) => {
  const payload = {
    p_user_id: uid,
  };
  console.log('payload', payload);
  const { data, error } = await supabase.rpc('get_address_by_user_id', payload);
  console.log('data address', data);

  if (error) {
    console.log('error while gettig listing address: ', error);
    throw new Error(error.message);
  }
  return data;
};
export const getListingAddress = async (uid: string) => {
  const payload = {
    p_address_id: uid,
  };
  console.log('payload  ', payload);
  const { data, error } = await supabase.rpc('get_list_address_by_id', payload);

  if (error) {
    console.log('error while gettig listing address: ', error);
    throw new Error(error.message);
  }
  return data;
};
