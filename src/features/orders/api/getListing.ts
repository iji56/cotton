import { supabase } from '@/lib/supabase';

/**
 * Fetch a specific listing by ID from the 'listings' table.
 * 
 * @param {string | number} id - The unique identifier for the listing.
 * @return {Promise<Object|null>} The listing data if found, or null if not found.
 */
export async function getListing(id: string) {
  // console.log("payload listing id : ", id)
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching listing data:', error.message);
    return null;
  }

  return data;
}
