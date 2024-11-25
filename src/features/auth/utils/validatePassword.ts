// const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{8,}$/;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

const hasDigitRegex = /\d/;

const hasLetterRegex = /[a-zA-Z]/;

export const validatePassword = (password: string) => passwordRegex.test(password);

export const hasDigit = (password: string) => hasDigitRegex.test(password);

export const hasLetter = (password: string) => hasLetterRegex.test(password);