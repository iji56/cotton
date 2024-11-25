import { supabase } from "@/lib/supabase"

export const deleteListingImage = async (uid: string) => {
    const { data, error } = await supabase.rpc('mark_image_as_deleted', {
        p_image_id: uid
    });

    if (error) {
        console.log("Error deleting listing image : ", error);
    }
    console.log("Listing image delte response  : ", data)
    return data

}