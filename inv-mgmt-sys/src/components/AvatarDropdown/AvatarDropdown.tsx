import { Avatar, Col, Dropdown, Menu, Row } from 'antd';
import menuList from './AvatarDropdownList';
import { useHistory } from 'react-router-dom';

import './AvatarDropdown.less';
import AvatarImg from '@assets/avatar.png';
const AvatarDropdown = () => {
  let history = useHistory();

  const menuAvatarDropdown = (
    <Menu
      defaultSelectedKeys={[history.location.pathname]}
      onClick={(item: { key: string }) => {
        history.push(item.key);
      }}
    >
      {menuList.map((menu) => (
        <Menu.Item key={menu.key} icon={<menu.icon size={20} />} style={{fontWeight: 500}}>
          {menu.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown
      overlay={menuAvatarDropdown}
      arrow
      trigger={['hover']}
      placement='bottomCenter'
      className='avatar-dropdown'
    >
      <Row align='middle' gutter={10}>
        <Col className='avatar-dropdown-account'>
          <Row justify='end' className='avatar-dropdown-name'>
            Tan Yuan Jie
          </Row>
          <Row justify='end' className='avatar-dropdown-role'>
            Admin
          </Row>
        </Col>
        <Col>
          <Avatar
            src={AvatarImg}
            alt='avatar'
            className='avatarDropdown-avatar'
          />
        </Col>
      </Row>
    </Dropdown>
  );
};

export default AvatarDropdown;
