import { Avatar, Col, Dropdown, Menu, Row } from 'antd';
import { MdPersonOutline, MdOutlineSettings, MdLogout } from 'react-icons/md';
import AvatarImg from '@assets/avatar.png';
const AvatarDropdown = () => {
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

  const menuAvatarDropdown = (
    <Menu>
      {menuList.map((menu) => (
        <Menu.Item key={menu.key} icon={<menu.icon size={20} />}>
          {menu.label}
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <Dropdown overlay={menuAvatarDropdown} trigger={['click']}>
      <Row align='middle'>
        <Row style={{ height: '80px' }}>
          <Col span={24} style={{ height: '40px' }}>
            <p>Tan Yuan Jie</p>
          </Col>
          <Col span={24} style={{ height: '40px' }}>
            Admin
          </Col>
        </Row>
        <Avatar
          src={AvatarImg}
          alt='avatar'
          className='avatarDropdown-avatar'
        />
      </Row>
    </Dropdown>
  );
};

export default AvatarDropdown;
