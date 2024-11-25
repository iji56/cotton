import { supabase } from "@/lib/supabase";
import { SaveListingType } from "../types/UploadListingType";

const saveListing = async (payload: SaveListingType) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .insert([payload])
      .select()
  
    if (error) throw new Error('there was an error saving your listing.');
    if (data) return data[0];

  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export default saveListing;