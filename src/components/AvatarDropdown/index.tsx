import { Avatar, Col, Dropdown, DropDownProps, Menu, Row } from 'antd';
import menuList from './avatarDropdownList';
import { useNavigate, useLocation } from 'react-router-dom';
import './AvatarDropdown.less';
import AvatarImg from '@assets/avatar.png';
import { logoutAPI } from '@api/services/authAPI';

export interface AvatarDropdownProps extends DropDownProps {
  name: string;
  role: string;
  img?: React.ReactNode;
}

const AvatarDropdown = ({
  name,
  role,
  img,
  ...props
}: Omit<AvatarDropdownProps, 'overlay'>) => {
  let navigate = useNavigate();
  let location = useLocation();
  const menuAvatarDropdown = (
    <Menu
      defaultSelectedKeys={[location.pathname]}
      onClick={(item) => {
        navigate(item.key);
      }}
    >
      {menuList.map((menu) => (
        <Menu.Item
          key={menu.key}
          icon={<menu.icon size={20} />}
          style={{ fontWeight: 500 }}
          onClick={() => {
            if (menu.label === 'Logout') {
              logoutAPI();
            }
          }}
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
            {name}
          </Row>
          <Row justify='end' className='avatar-dropdown-role'>
            {role}
          </Row>
        </Col>
        <Col>
          <Avatar
            src={img !== undefined ? img : AvatarImg}
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
