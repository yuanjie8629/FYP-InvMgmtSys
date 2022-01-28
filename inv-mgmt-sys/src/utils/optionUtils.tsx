const ynOptions = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
];

const prodCat = [
  { value: 'rte', label: 'Ready-To-Eat' },
  { value: 'rtc', label: 'Ready-To-Cook' },
  { value: 'paste', label: 'Paste' },
];

const prodStatList = [
  { status: 'active', label: 'Active', color: 'success' },
  { status: 'oos', label: 'Out of Stock', color: 'error' },
  { status: 'hidden', label: 'Hidden', color: 'default' },
];

const packStatList = [
  { status: 'active', label: 'Active', color: 'success' },
  { status: 'oos', label: 'Out of Stock', color: 'error' },
  { status: 'scheduled', label: 'Scheduled', color: 'processing' },
  { status: 'expired', label: 'Expired', color: 'warning' },
  { status: 'hidden', label: 'Hidden', color: 'default' },
];

const orderStatList = [
  { status: 'completed', label: 'Completed', color: 'success' },
  { status: 'cancel', label: 'Cancellation', color: 'error' },
  { status: 'unpaid', label: 'Unpaid', color: 'error' },
  { status: 'toShip', label: 'To Ship', color: 'warning' },
  { status: 'shipping', label: 'Shipping', color: 'processing' },
];

const genderCat = [
  { value: 'm', label: 'Male' },
  { value: 'f', label: 'Female' },
];

const maritalStatCat = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'seperated', label: 'Seperated' },
  { value: 'divorced', label: 'Divorced' },
];

const custPositionCat = [
  { value: 'agent', label: 'Agent' },
  { value: 'drpshpr', label: 'Dropshipper' },
];

const custStatusCat = [
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
];

const discCat = [
  { value: 'amount', label: 'Fixed Amount' },
  { value: 'percentage', label: 'Percentage' },
];

const custCat = [
  { label: 'Agent', value: 'agent' },
  { label: 'Direct Customer', value: 'cust' },
  { label: 'Dropshipper', value: 'drpshpr' },
];

export {
  ynOptions,
  prodCat,
  prodStatList,
  packStatList,
  orderStatList,
  genderCat,
  maritalStatCat,
  custPositionCat,
  custStatusCat,
  discCat,
  custCat,
};
