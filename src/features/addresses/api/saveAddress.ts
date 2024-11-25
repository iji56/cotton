import { supabase } from "@/lib/supabase"
import { successToast } from "@/lib/toastConfig";

export const saveAddress = async (uuid: string, address: string, latitude: number, longitude: number, suiteText: string, instruction: string, postalCode: string) => {
    const payload = {
        p_user_id: uuid,
        address: address,
        latitude: latitude,
        longitude: longitude,
        apartment_suite: suiteText,
        delivery_hand_off_instructions: instruction,
        postal_code: postalCode,
    }
    console.log("payload : ", payload)
    const { data, error } = await supabase.rpc('add_user_address', payload);
    if (error) {
        console.log("Error saving address : ", error);
        throw new Error(error.message);
    }
    console.log("added : ", data)
    successToast("Address saved successfully")
    return data;
}