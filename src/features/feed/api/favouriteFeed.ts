import { supabase } from '@/lib/supabase';
import { ListingItem } from '../types/supabaseListings';

export const getUserFavouriteListings = async (uid: string) => {
  try {
    const payload = { p_user_id: uid };
    console.log("payload  : ", uid)
    let { data, error } = await supabase.rpc('get_favourite_listings_by_user_id', payload) //fetch_favorite_listings

    if (error) throw new Error(error.message);
    if (data) {
      console.log('this is the favourites data', data);
    }
    return data as ListingItem[];
  } catch (error) {
    console.log("Error getting favourite listings : ", error)
    throw new Error((error as Error).message);
  }
};

