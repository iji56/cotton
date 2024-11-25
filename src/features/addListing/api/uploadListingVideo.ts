import { supabase } from "@/lib/supabase"

export const updateListingVideo = async (uid: string, link: string) => {
    const { data, error } = await supabase.rpc('insert_listing_video', {
        p_listing_id: uid,
        p_video_link: link
    });

    if (error) {
        console.log("Error update listing video reference : ", error);
        throw new Error(error.message);
    }

    console.log("updated listing video response : ", data)
    return data
}