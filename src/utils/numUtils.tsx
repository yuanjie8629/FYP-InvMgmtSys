export const moneyFormatter = (num: number, numOnly: boolean = false) => {
  let value = '';
  if (num >= 1000 && num < 1000000) {
    value = (num / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million
  } else if (num > 1000000) {
    value = (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million
  } else {
    value = num.toFixed(2); // if value < 1000, nothing to do
  }

  return numOnly === true ? value : `RM ${value}`;
};

export const percentFormatter = (
  num: number,
  numOnly: boolean = false,
  toFixed: number = 2
) => {
  let value = (num * 100).toFixed(toFixed);
  return numOnly === true ? value : `${value} %`;
};

