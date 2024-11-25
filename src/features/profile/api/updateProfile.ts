import { uploadUserImage } from "@/features/auth/api/uploadImage"
import { supabase } from "@/lib/supabase"

export const updateProfile = async (uid: string, username: string, name: string, bio: string, path: string, uploadImage: boolean) => {

    const updateUserDetail = async (image: string) => {
        const payload = {
            p_id: uid,
            p_first_name: name,
            p_user_name: username,
            p_bio: bio,
            p_url_path: image
        }
        console.log("payload  : ", payload);
        const { data, error } = await supabase.rpc('update_user_meta_and_image', payload)
        if (error) {
            console.log("Error : ", error)
            throw Error(error.message)
        }
        console.log("user profile update response  : ", data)
        return { status: true, message: "", image: image }
    }

    if (uploadImage) {
        return uploadUserImage(path, uid).then(async image => {
            if (image) {
                return await updateUserDetail(image)
            } else {
                return { status: false, message: "Failed to update Profile, Try again", image: null }
            }
        }).catch(error => {
            console.log("Error updating user profile image : ", error)
            return { status: false, message: "Failed to update Profile, Try again", image: null }
        })
    } else {
        return await updateUserDetail(path)
    }
}