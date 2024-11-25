import { supabase } from '@/lib/supabase';

/**
 * Currently, there's no way to filter (.eq) within a nested
 * join query string.
 * So instead of filtering for the user's profile picture,
 * after the api call, we'd need to manually filter through
 * the nested object to get the image where profile === true.
 *
 * To completely avoid this, when we add a new listing, we leave
 * the user_id column empty in supabase. This will isolate user
 * images to the user, and listing images to the listing.
 */
export const getOrders = async (
  page: number = 1
) => {
  const itemsPerPage = 100;
  const startIndex = (page - 1) * itemsPerPage;

  try {
    let query = supabase
      .from('listings_borrow')
      .select('*')	
      .range(startIndex, startIndex + itemsPerPage - 1);

    let { data, error } = await query;

    if (error) throw new Error(error.message);
    if (data) return data;

  } catch (error) {
    throw new Error((error as Error).message);
  }
};