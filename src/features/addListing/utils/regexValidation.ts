const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

export const validatePostalCode = (postalCode: string) => postalCodeRegex.test(postalCode);

// const phoneNumberRegex = /^\+1-\d{3}\d{3}-\d{4}$/;
const phoneNumberRegex = /^[+][1][0-9]{10}$/

export const validatePhoneNumber = (phoneNumber: string) => phoneNumberRegex.test(phoneNumber);

const routingNumberRegex =/^\d{5}$/;  // /^\d{5}-\d{3}$/;

export const validateRoutingNumber = (routingNumber: string) => routingNumberRegex.test(routingNumber);

const bankNumberRegex =/^\d{3}$/;  // /^\d{5}-\d{3}$/;

export const validateBankNumber = (bankNumber: string) => bankNumberRegex.test(bankNumber);