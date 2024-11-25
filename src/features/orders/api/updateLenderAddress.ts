import { supabase } from "@/lib/supabase"

export const updateLenderAddress = async (address: string, latitude: number, longitude: number, uid: string, listingId: string, listingBorrowerId: string, borrowerId: string, postalCode: string) => {

    const payload = {
        p_address: address,
        p_latitude: latitude,
        p_longitude: longitude,
        p_apartment_suite: '',
        p_delivery_hand_off_instructions: '',
        p_default: false,
        p_user_id: uid,
        p_listing_id: listingId,
        p_listing_borrower_id: listingBorrowerId,
        p_borrower_id: borrowerId,
        p_postal_code: postalCode,
    }
    console.log("payload : ", payload)
    const { data, error } = await supabase.rpc('update_address_from_order_by_lender', payload);

    if (error) {
        console.log("Error updating address : ", error)
        throw new Error(error.message);
    }
    console.log(data)
    return data;
}