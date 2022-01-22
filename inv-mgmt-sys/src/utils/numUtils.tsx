const moneyFormatter = (num: number) => {
  if (num >= 1000 && num < 1000000) {
    return 'RM ' + (num / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million
  } else if (num > 1000000) {
    return 'RM ' + (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million
  } else {
    return 'RM ' + num.toFixed(2); // if value < 1000, nothing to do
  }
};

const percentFormatter = (num: number) => (num * 100).toFixed() + '%';

export { moneyFormatter, percentFormatter };
