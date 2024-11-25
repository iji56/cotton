import { dollarConversion } from './dollarConversion';

const calculateTotalEarnings = (price: string, shippingCost: number) => {
  const priceCents: number = dollarConversion({
    amount: price,
    direction: 'toCents',
    formatted: true,
  });
  const shippingCostCents: number = dollarConversion({
    amount: shippingCost,
    direction: 'toCents',
    formatted: true,
  }); 
  const earningsCents = priceCents - shippingCostCents
  const totalEarningsCents = earningsCents * 0.8;
  const totalEarningsDollars = totalEarningsCents / 100;
  const totalEarnings = dollarConversion({
    amount: totalEarningsDollars,
    direction: 'toDollars',
    formatted: true,
  });
  return totalEarnings;
};
export default calculateTotalEarnings;