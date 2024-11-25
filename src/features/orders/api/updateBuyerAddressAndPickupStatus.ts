import { supabase } from "@/lib/supabase"

export const updateBuyerAddressAndPickupStatus = async (uid: string, purchaserId: string, cpId: 0 | 1, cost: number, pickUpDate: string, shippingDate: string) => {
    const payload = {
        p_listings_purchased_id: uid,
        p_is_address_approved_by_purchaser: true,
        p_purchaser_id: purchaserId,
        p_cp_id: cpId,
        p_cost_shipping: cost,
        p_local_pickup_date: pickUpDate,
        p_shipping_date: shippingDate
    }

    console.log("update_buyer_address_and_pickup_status: payload  ", payload)

    const { data, error } = await supabase.rpc('update_buyer_address_and_pickup_status', payload);

    if (error) {
        console.log("error in update_buyer_address_and_pickup_status : ", error)
        throw new Error(error.message)
    }

    console.log("update_buyer_address_and_pickup_status response : ", data)
    return data;
}