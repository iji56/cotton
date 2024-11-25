import { supabase } from "@/lib/supabase";

const deleteImage = async (imagePath: string) => {
  try {
    const pathInBucket = imagePath.split('storage/v1/object/public/listings/')[1];
    const { data, error } = await supabase
      .storage
      .from('listings')
      .remove([pathInBucket])

    if (error) throw new Error(error.message);
    if (data) return;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export default deleteImage;