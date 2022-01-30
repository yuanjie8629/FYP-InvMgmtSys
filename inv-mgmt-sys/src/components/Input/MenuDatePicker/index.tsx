import { Col, Row, DatePicker, DatePickerProps } from 'antd';
import { MdChevronRight } from 'react-icons/md';
import './MenuDatePicker.less';

type MenuDatePickerProps = DatePickerProps & {
  label: string;
};

const MenuDatePicker = (props: MenuDatePickerProps) => (
  <Row align='middle' justify='space-between'>
    <Col span={20}>{props.label}</Col>
    <Col className='centerFlex'>
      <MdChevronRight size={20} className='color-grey' />
    </Col>
    <DatePicker
      bordered={false}
      allowClear={false}
      inputReadOnly
      style={{ height: 0, width: 0, padding: 0 }}
      {...props}
      className={`menu-date-picker ${props.className}`}
    />
  </Row>
);

export default MenuDatePicker;
