import { supabase } from "@/lib/supabase"
import { formatDateTimeZone } from "../utils/formatDate";

export const requestBuy = async (
    purchaserId: string,
    ownerId: string,
    cpId: 0 | 1,
    tax: number,
    shipping: number,
    insurance: number,
    discount: number,
    totalPrice: number,
    listingId: string,
    pickupDate: string,
    shippingDate: string,
    purchasePrice: number,
    paymentIntentId: string,
    paymentMethodId: string,
    clientSecret: string,
    addressId: string,
    message: string,
) => {

    const payload = {
        _purchaser_id: purchaserId,
        _owner_id: ownerId,
        _cp_id: cpId,
        _purchase_price: parseFloat(purchasePrice.toFixed(2)),
        _cost_tax: tax || 0,
        _cost_shipping: parseFloat(shipping?.toFixed(2)) || 0,
        _cost_insurance: parseFloat(insurance.toFixed(2)) || 0,
        _discount: parseFloat(discount.toFixed(2)) || 0,
        _total_price: parseFloat(totalPrice.toFixed(2)),
        _status: 'awaiting confirmation',
        _listing_id: listingId,
        _local_pickup_date: pickupDate ? formatDateTimeZone(pickupDate) : null,
        _shipping_date: shippingDate ? formatDateTimeZone(shippingDate) : null,
        _payment_intent_id: paymentIntentId,
        _payment_client_secret: clientSecret,
        _payment_method_id: paymentMethodId,
        _purchaser_shipping_address_id: addressId,
        _message: message,
    };

    console.log("request buy payload  : ", payload);

    const { data, error } = await supabase.rpc('insert_into_listings_purchased', payload);

    if (error) {
        console.log("Error requesting to buy : ", error)
        throw new Error(error.message)
    }

    return data;
}