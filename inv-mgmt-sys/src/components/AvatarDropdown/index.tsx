import { Avatar, Col, Dropdown, Menu, Row } from 'antd';
import menuList from './avatarDropdownList';
import { useNavigate, useLocation } from 'react-router-dom';
import './AvatarDropdown.less';
import AvatarImg from '@assets/avatar.png';

const AvatarDropdown = () => {
  let navigate = useNavigate();
  let location = useLocation();
  const menuAvatarDropdown = (
    <Menu
      defaultSelectedKeys={[location.pathname]}
      onClick={(item: { key: string }) => {
        navigate(item.key, { replace: true });
      }}
    >
      {menuList.map((menu) => (
        <Menu.Item
          key={menu.key}
          icon={<menu.icon size={20} />}
          style={{ fontWeight: 500 }}
        >
          {menu.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown
      overlay={menuAvatarDropdown}
      arrow
      placement='bottomCenter'
      className='avatar-dropdown'
    >
      <Row align='middle' gutter={10}>
        <Col className='avatar-dropdown-account'>
          <Row justify='end' className='avatar-dropdown-name'>
            Tan Yuan Jie
          </Row>
          <Row justify='end' className='avatar-dropdown-role'>
            Super Admin
          </Row>
        </Col>
        <Col>
          <Avatar
            src={AvatarImg}
            alt='avatar'
            size={42}
            className='avatarDropdown-avatar'
          />
        </Col>
      </Row>
    </Dropdown>
  );
};

export default AvatarDropdown;
