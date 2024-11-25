import { supabase } from "@/lib/supabase"

export const updateSellerAddress = async (address: string, latitude: number, longitude: number, uid: string, listingId: string, purchaserId: string, listingPurchaserId: string, postalCode: string) => {

    const payload = {
        p_address: address,
        p_latitude: latitude,
        p_longitude: longitude,
        p_apartment_suite: '',
        p_delivery_hand_off_instructions: '',
        p_default: false,
        p_user_id: uid,
        p_listing_id: listingId,
        p_purchaser_id: purchaserId,
        p_listing_purchase_id: listingPurchaserId,
        p_postal_code: postalCode
    }
    console.log("seller update address payload : ", payload)
    const { data, error } = await supabase.rpc('update_address_from_order_by_seller', payload);

    if (error) {
        console.log("Error updating address : ", error)
        throw new Error(error.message);
    }
    console.log(data)
    return data;
}