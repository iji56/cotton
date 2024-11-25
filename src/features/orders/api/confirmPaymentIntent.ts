import { confirmPayment } from "@stripe/stripe-react-native";

export const confirmPaymentIntent = async (clientSecret: string, paymentMethodId: string) => {
    console.log("payload  : ", clientSecret, paymentMethodId)
    const { error: confirmError, paymentIntent } = await confirmPayment(
        clientSecret,
        {
            paymentMethodType: 'Card',
            paymentMethodData: {
                paymentMethodId: paymentMethodId,
            }
        }
    );
    if (paymentIntent) {
        console.log("confirmed payment intent ", paymentIntent)
        return paymentIntent
    }
    if (confirmError) {
        console.log("Error confirming payment intent:", confirmError)
        throw new Error(confirmError.message)
    }
}