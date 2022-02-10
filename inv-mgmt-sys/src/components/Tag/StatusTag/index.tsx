import { Dropdown, Menu, Row } from 'antd';
import { MdArrowDropDown } from 'react-icons/md';
import Tag, { TagProps } from '..';

export interface StatusTagProps extends TagProps {
  status: string;
  statusList: { status: string; label: string; color: string }[];
  dropdownStatus?: string[];
}

const StatusTag = ({
  status,
  statusList,
  dropdownStatus,
  ...props
}: StatusTagProps) => {
  const menu = (
    <Menu>
      {statusList.map((statusItem) =>
        !(
          status === statusItem.status ||
          !dropdownStatus?.includes(statusItem.status)
        ) ? (
          <Menu.Item key={statusItem.status}>{statusItem.label}</Menu.Item>
        ) : null
      )}
    </Menu>
  );

  const matchedStatus = statusList.find(
    (statusItem) => status === statusItem.status
  );

  return dropdownStatus?.includes(matchedStatus.status) ? (
    <Row align='middle'>
      <Tag
        minWidth='70%'
        maxWidth='100%'
        color={matchedStatus.color}
        {...props}
      >
        {matchedStatus.label}
      </Tag>
      <Dropdown overlay={menu} placement='bottomRight'>
        <MdArrowDropDown size={25} style={{ cursor: 'pointer' }} />
      </Dropdown>
    </Row>
  ) : (
    <Tag minWidth='70%' maxWidth='100%' color={matchedStatus.color} {...props}>
      {matchedStatus.label}
    </Tag>
  );
};

export default StatusTag;
