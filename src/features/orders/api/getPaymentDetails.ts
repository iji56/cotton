import { supabase } from '@/lib/supabase';

/**
 * Fetch a specific listing by ID from the 'listings' table.
 * 
 * @param {string | number} id - The unique identifier for the listing.
 * @return {Promise<Object|null>} The listing data if found, or null if not found.
 */
export async function getPaymentDetails(id) {
  const { data, error } = await supabase
    .from('listings_borrow')
    .select('pm_brand, pm_type, pm_4')
    .eq('payment_intent_id', id)
    .single();

  if (error) {
    console.error('Error fetching payment details:', error.message);
    return null;
  }

  return data;
}
