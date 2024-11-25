// 1. determine selected date count
// 2. calculate price markup
// 3. calculate revenue markup
// 4. add insurance markup
// 5. add shipping to cost (if shipping)

import { ListingItem } from "@/features/feed/types/supabaseListings";
import { dollarConversion } from "@/utils/dollarConversion";

// 6. add tax
export const calculateCost = (
  itemData: ListingItem,
  selectedDates: string[],
  insurance: boolean
): object => {
  const dateCount: number = selectedDates.length;
  const priceOriginal: any = itemData.priceOriginal
  const priceBorrow: any = itemData.priceBorrow

  const originalPrice = dollarConversion({
    amount: priceOriginal,
    direction: 'toCents',
    formatted: false,
  }) as number;

  const borrowPrice = dollarConversion({
    amount: priceBorrow,
    direction: 'toCents',
    formatted: false,
  }) as number;

  let borrowCost: number = dateCount * borrowPrice
  let revenueMarkup: number = 0;
  let insuranceMarkup: number = 0;
  let subTotal: number = 0;
  let serviceMarkup: number = 0;
  let tax: number = 0;


  // revenue markup
  switch (true) {
    case (dateCount > 4 && dateCount <= 10):
      revenueMarkup = borrowPrice * 0.20;
      break;
    case (dateCount > 10 && dateCount <= 20):
      revenueMarkup = borrowPrice * 0.30;
      break;
    case (dateCount > 20 && dateCount <= 30):
      revenueMarkup = borrowPrice * 0.60;
      break;
    case (dateCount > 30):
      revenueMarkup = borrowPrice * 0.90;
      break;
    default:
      break;
  }

  // Insurance markup calculations
  if (insurance) {
    insuranceMarkup = originalPrice < 50000 ? 500 : originalPrice * 0.04;
  }

  // Subtotal and service markup with rounding up
  subTotal = borrowCost + revenueMarkup;
  serviceMarkup = Math.ceil(subTotal * 0.02); // rounding up the service markup
  tax = subTotal * 0.13;

  return { subTotal, serviceMarkup, tax, insuranceMarkup }
}

export const calculateTotalPrice = (price: number, days: number) => {
  if (days === 4) return price;
  else if (days === 10) return (price + price * 0.2).toFixed(2);
  else if (days === 20) return (price + price * 0.6).toFixed(2);
  else if (days === 30) return (price + price * 0.9).toFixed(2);
  else if (days === 60) return (price + price * 1.2).toFixed(2);
  else if (days === 90) return (price + price * 1.5).toFixed(2);
  else return (price + price * 1.9).toFixed(2);
}