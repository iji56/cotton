import { supabase } from "@/lib/supabase"
import { successToast } from "@/lib/toastConfig";

export const updateAddress = async (uuid: string, address: string, latitude: number, longitude: number, suiteText: string, instruction: string, postalCode: string) => {
    const payload = {
        address_id: uuid,
        new_address: address,
        new_latitude: latitude,
        new_longitude: longitude,
        new_apartment_suite: suiteText,
        new_delivery_hand_off_instructions: instruction,
        new_postal_code: postalCode,
    }
    console.log("payload: ", payload)
    const { data, error } = await supabase.rpc('edit_user_address', payload);
    if (error) {
        console.log("Error Updating address : ", error);
        throw new Error(error.message);
    } else {
        successToast("Address updated successfully")
    }
    return data;
}