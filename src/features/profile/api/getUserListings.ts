import { supabase } from '@/lib/supabase';
import { UserListingRow } from '../types/userListings';

export const getUserListings = async (
  user_id: null | string,
): Promise<UserListingRow[]> => {
  try {
    let { data, error } = await supabase.rpc('fetch_listings_with_details', {
      p_user_id: user_id,
    });

    if (error) {
      console.log('Error gettign user lstings : ', error);
      throw new Error(error.message);
    }

    if (data) return data as UserListingRow[];
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
