import { MdAdd, MdRemove } from 'react-icons/md';
import { Typography } from 'antd';
export const { Text } = Typography;

export const ynOptions = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
];

export const dateRangeOptions = [
  { value: 'year', label: 'Year' },
  { value: 'month', label: 'Month' },
  { value: 'week', label: 'Week' },
  { value: 'day', label: 'Day' },
];

export const prodCat = [
  { value: 'rte', label: 'Ready-To-Eat' },
  { value: 'rtc', label: 'Ready-To-Cook' },
  { value: 'paste', label: 'Paste' },
];

export const prodStatList = [
  { status: 'active', label: 'Active', color: 'success' },
  { status: 'oos', label: 'Out of Stock', color: 'error' },
  { status: 'hidden', label: 'Hidden', color: 'default' },
];

export const packStatList = [
  { status: 'active', label: 'Active', color: 'success' },
  { status: 'oos', label: 'Out of Stock', color: 'error' },
  { status: 'scheduled', label: 'Scheduled', color: 'processing' },
  { status: 'expired', label: 'Expired', color: 'warning' },
  { status: 'hidden', label: 'Hidden', color: 'default' },
];

export const orderStatList = [
  { status: 'completed', label: 'Completed', color: 'success' },
  { status: 'cancel', label: 'Cancellation', color: 'error' },
  { status: 'unpaid', label: 'Unpaid', color: 'error' },
  { status: 'toShip', label: 'To Ship', color: 'warning' },
  { status: 'shipping', label: 'Shipping', color: 'processing' },
];

export const custStatList = [
  { status: 'active', label: 'Active', color: 'success' },
  { status: 'suspended', label: 'Suspended', color: 'error' },
];

export const voucherStatList = [
  { status: 'active', label: 'Active', color: 'success' },
  { status: 'scheduled', label: 'Scheduled', color: 'processing' },
  { status: 'expired', label: 'Expired', color: 'error' },
  { status: 'hidden', label: 'Hidden', color: 'default' },
];

export const genderCat = [
  { value: 'm', label: 'Male' },
  { value: 'f', label: 'Female' },
];

export const maritalStatCat = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'seperated', label: 'Seperated' },
  { value: 'divorced', label: 'Divorced' },
];

export const custPositionCat = [
  { value: 'agent', label: 'Agent' },
  { value: 'drpshpr', label: 'Dropshipper' },
];

export const custStatusCat = [
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
];
export const discCat = [
  { value: 'amount', label: 'Fixed Amount' },
  { value: 'percentage', label: 'Percentage' },
];

export const custCat = [
  { label: 'Agent', value: 'agent' },
  { label: 'Direct Customer', value: 'cust' },
  { label: 'Dropshipper', value: 'drpshpr' },
];

export const invInputOptions = [
  {
    value: '+',
    label: <MdAdd size={20} />,
  },
  {
    value: '-',
    label: <MdRemove size={20} />,
  },
  {
    value: 'set',
    label: (
      <Text strong style={{ color: 'white', padding: '0 12px' }}>
        Set
      </Text>
    ),
  },
];
