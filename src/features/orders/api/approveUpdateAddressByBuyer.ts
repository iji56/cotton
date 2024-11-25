import { supabase } from "@/lib/supabase"

export const approveUpdateAddressByBuyer = async (uid: string, purchaserId: string) => {
    const payload = {
        p_listings_purchased_id: uid,
        p_is_address_approved_by_purchaser: true,
        p_purchaser_id: purchaserId,
    }
    console.log("approve address by buyer : ", payload)
    const { data, error } = await supabase.rpc('update_buyer_address_approval_status', payload);

    if (error) {
        console.log("error approving update address by buyer : ", error)
        throw new Error(error.message)
    }

    console.log("update address by buyer approved response : ", data)
    return data;
}