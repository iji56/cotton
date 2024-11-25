import { supabase } from '@/lib/supabase';
import { ListingItem } from '../types/supabaseListings';

export const getListings = async (uid: string): Promise<ListingItem[]> => {

  try {

    const payload = {
      p_user_id: uid,
    }
    console.log("get listing payload  : ", payload)

    const { data, error } = await supabase.rpc('get_listings', payload);
    if (error) {
      console.log("Error  getting all listings : ", error);
      throw new Error(error.message)
    }

    return data
  } catch (error: any) {
    throw new Error(error.message);
  }
};