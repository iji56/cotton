import { supabase } from '@/lib/supabase';

export const getListingDetail = async (userId: string, listingId: string) => {
  const payload = {
    p_listing_id: listingId,
    p_user_id: userId,
  };

  console.log(
    'fetch_listing_details_with_favorite_status payload2  : ',
    payload,
  );

  const { data, error } = await supabase.rpc(
    'fetch_listing_details_with_favorite_status',
    payload,
  );
  console.log('data', JSON.stringify(data));
  if (error) {
    console.log('error : getting listing details ', error);
    throw new Error(error.message);
  }
  return data;
};
