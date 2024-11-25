import { supabase } from "@/lib/supabase"

export const updateBorrowerAddressAndPickupStatus = async (uid: string, borrowerId: string, cpId: 0 | 1, cost: number) => {
    const payload = {
        p_listings_borrow_id: uid,
        p_is_address_approved_by_borrower: true,
        p_borrower_id: borrowerId,
        p_cp_id: cpId,
        p_cost_shipping: cost
    }

    console.log("update_borrower_address_and_pickup_status payload  ", payload)

    const { data, error } = await supabase.rpc('update_borrower_address_and_pickup_status', payload);

    if (error) {
        console.log("error in update_borrower_address_and_pickup_status : ", error)
        throw new Error(error.message)
    }

    console.log("update_borrower_address_and_pickup_status response : ", data)
    return data;
}