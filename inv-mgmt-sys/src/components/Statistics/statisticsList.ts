import { IconType } from 'react-icons/lib';
import {
  MdOutlineAssignment,
  MdOutlineAttachMoney,
  MdOutlineTrendingUp,
  MdOutlineVisibility,
  MdPersonOutline,
} from 'react-icons/md';

const statisticsList: {
  key: string;
  title: string;
  icon: IconType;
  color: string;
  prefix?: string;
  suffix?: string;
  toFixed?: number;
}[] = [
  {
    key: 'sales',
    title: 'Sales',
    icon: MdOutlineTrendingUp,
    color: '#7367F0',
    prefix: 'RM ',
    toFixed: 2,
  },
  {
    key: 'profit',
    title: 'Profit',
    icon: MdOutlineAttachMoney,
    color: '#28C76F',
    prefix: 'RM ',
    toFixed: 2,
  },
  {
    key: 'visitors',
    title: 'Visitors',
    icon: MdOutlineVisibility,
    color: '#FDBA39',
  },
  {
    key: 'newCust',
    title: 'New Customers',
    icon: MdPersonOutline,
    color: '#00CFE8',
  },
  {
    key: 'newOrder',
    title: 'New Orders',
    icon: MdOutlineAssignment,
    color: '#EA5455',
  },
];

export default statisticsList;
