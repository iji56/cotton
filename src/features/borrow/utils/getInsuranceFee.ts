export const getInsuranceFee = (price: number) => price < 500 ? 0 : Number((price * 0.04).toFixed(2));

export const getTotalAmount = (price: number, deliveryCharge: number, insuranceFee: number): number => {
    return parseFloat((price + deliveryCharge + insuranceFee).toFixed(2));
};