import { supabase } from "@/lib/supabase"

export const deleteListingVideo = async (uid: string) => {
    const { data, error } = await supabase.rpc('mark_image_as_deleted', {
        p_image_id: uid
    });

    if (error) {
        console.log("Error deleting listing video : ", error);
    }
    console.log("Listing video delte response  : ", data)
    return data

}