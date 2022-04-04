import { MdPersonOutline, MdOutlineSettings, MdLogout } from 'react-icons/md';

const menuList = [
  {
    key: '/my_acc/profile_management',
    label: 'Manage Profile',
    icon: MdPersonOutline,
  },
  {
    key: '/my_acc/acc_settings',
    label: 'Account Settings',
    icon: MdOutlineSettings,
  },
  { key: '', label: 'Logout', icon: MdLogout },
];

export default menuList;
