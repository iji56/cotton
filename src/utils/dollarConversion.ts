type ConvertCurrencyParams = {
  amount: number | string;
  direction: 'toDollars' | 'toCents';
  formatted: boolean;
};

export const dollarConversion = ({ amount, direction, formatted = false }: ConvertCurrencyParams): string | number => {
  if (direction === 'toDollars') {
    const dollars = typeof amount === 'number' ? amount : parseFloat(amount.toString());
    if (formatted) {
      // Assuming conversion to CAD for demonstration, without 'CAD' prefix
      return dollars.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' }).replace('CAD', '').trim();
    } else {
      return `$${dollars}`;
    }
  } else if (direction === 'toCents') {
    // Ensure amount is treated as a string for parseFloat
		// Remove currency symbol and any other non-numeric characters except the decimal point
    const sanitizedAmount = amount.toString().replace(/[^0-9.]/g, '');
    const numericAmount = parseFloat(sanitizedAmount);
    const cents = Math.round(numericAmount * 100);

    // Now let's handle the `formatted` flag correctly
    if (formatted) {
      // Assuming you want to format the cents as a string in some way
      // For example, return with a cents symbol or just a plain number string (optional)
      return cents.toString(); // Convert to string if formatted is true
    } else {
      return cents; // Keep as a number if formatted is false
    }
  } else {
    throw new Error('Invalid conversion direction');
  }
}