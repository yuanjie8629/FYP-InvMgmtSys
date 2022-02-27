export const hasDigit = (str: string) => /\d/.test(str);

export const hasUpperCaseLetter = (str: string) => /[A-Z]/.test(str);

export const hasLowerCaseLetter = (str: string) => /[a-z]/.test(str);

export const hasSymbolLetter = (str: string) =>
  /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(str);

export const checkLength = (str: string, minRange: number, maxRange: number) =>
  str.length >= minRange && str.length <= maxRange;
