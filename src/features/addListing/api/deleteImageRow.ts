import { supabase } from "@/lib/supabase";


const deleteImageRow = async (listingID: string) => {
  try {
    const { data, error } = await supabase
      .from('images')
      .delete()
      .eq('listing_id', listingID)
      .select()
    
    if (error) throw new Error(error.message);
    if (data) return;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export default deleteImageRow;