import { supabase } from "@/lib/supabase";

const deleteListing = async (listingRow: string) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .delete()
      .eq('id', listingRow)
      .select()
    
    if (error) throw new Error(error.message);
    if (data) return;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export default deleteListing;