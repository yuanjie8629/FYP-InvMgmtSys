import { Col, Row, DatePicker, DatePickerProps } from 'antd';
import { MdChevronRight } from 'react-icons/md';
import './MenuDatePicker.less';

type MenuDatePickerProps = DatePickerProps & {
  label: string;
};

const MenuDatePicker = ({
  label,
  className,
  ...props
}: MenuDatePickerProps) => (
  <Row align='middle' justify='space-between'>
    <Col span={20}>{label}</Col>
    <Col className='center-flex'>
      <MdChevronRight size={20} className='color-grey' />
    </Col>
    <DatePicker
      bordered={false}
      allowClear={false}
      inputReadOnly
      style={{ height: 0, width: 0, padding: 0 }}
      className={`menu-date-picker${
        className !== undefined ? ` ${className}` : ''
      }`}
      {...props}
    />
  </Row>
);

export default MenuDatePicker;
