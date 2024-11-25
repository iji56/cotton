import { supabase } from "@/lib/supabase";

export const getTakenDates = async (listing_id: null | string) => {
  try {
    let { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', listing_id)

    if (error) throw new Error((error).message);

    return data;
    
  } catch (error) {
    console.log(error);
    throw new Error((error as Error).message);
  }
}