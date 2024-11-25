import { supabase } from "@/lib/supabase"

export const approveUpdateAddressByBorrower = async (uid: string, borrowerId: string) => {
    const payload = {
        p_listings_borrow_id: uid,
        p_is_address_approved_by_borrower: true,
        p_borrower_id: borrowerId,
    }

    console.log("payload  ", payload)
    
    const { data, error } = await supabase.rpc('update_borrower_address_approval_status', payload);

    if (error) {
        console.log("error approving update address by borrower : ", error)
        throw new Error(error.message)
    }

    console.log("update address by borrower approved response : ", data)
    return data;
}