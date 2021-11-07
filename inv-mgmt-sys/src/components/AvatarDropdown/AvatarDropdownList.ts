import { MdPersonOutline, MdOutlineSettings, MdLogout } from 'react-icons/md';

const menuList = [
  {
    key: '/my-acc/profile-management',
    label: 'Manage Profile',
    icon: MdPersonOutline,
  },
  {
    key: '/my-acc/acc-settings',
    label: 'Account Settings',
    icon: MdOutlineSettings,
  },
  { key: '/', label: 'Logout', icon: MdLogout },
];

export default menuList;
