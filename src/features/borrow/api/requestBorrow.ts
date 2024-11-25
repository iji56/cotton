import { supabase } from "@/lib/supabase"
import moment from "moment";
import { formatDateTimeZone } from "../utils/formatDate";
import { calculateTotalPrice } from "../utils/calculateCost";

export const requestBorrow = async (
    listingId: string,
    borrowerId: string,
    lenderId: string,
    cpId: 0 | 1,
    borrowStart: string,
    borrowEnd: string,
    tax: number,
    shipping: number,
    insurance: number,
    discount: number,
    totalPrice: number,
    borrowPrice: number,
    paymentMethodId: string,
    clientSecret: string,
    paymentIntentId: string,
    costService: number,
    addressId: string,
    message: string,
) => {

    const daysBorrowed = moment(new Date(borrowEnd)).diff(new Date(borrowStart), 'days') + 1;

    const payload = {
        _listing_id: listingId,
        _borrower_id: borrowerId,
        _lender_id: lenderId,
        _cp_id: cpId,
        _payment_intent_id: paymentIntentId,
        _payment_method_id: paymentMethodId,
        _borrow_start: formatDateTimeZone(borrowStart),
        _borrow_end: formatDateTimeZone(borrowEnd),
        _borrow_price: calculateTotalPrice(parseFloat(borrowPrice?.toFixed(2)), daysBorrowed),
        _cost_tax: tax || 0,
        _cost_shipping: parseFloat(shipping?.toFixed(2)) || 0,
        _cost_insurance: parseFloat(insurance?.toFixed(2)) || 0,
        _discount: parseFloat(discount?.toFixed(2)) || 0,
        _total_price: parseFloat(totalPrice?.toFixed(2)),
        _status: "awaiting confirmation",
        _cost_service: costService,
        _days_borrowed: daysBorrowed,
        _payment_client_secret: clientSecret,
        _borrower_shipping_address_id: addressId,
        _message: message,
    };

    console.log("request borrow payload  : ", payload);

    const { data, error } = await supabase.rpc('insert_into_listings_borrow', payload);

    if (error) {
        console.log("Error requesting to borrow : ", error)
        throw new Error(error.message)
    }

    return data;
}