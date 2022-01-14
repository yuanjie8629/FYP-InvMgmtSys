import { Col, DatePicker, DatePickerProps, Row, Typography } from 'antd';
import './Input.less';

type DatePickerWithLabelProps = Partial<DatePickerProps> & {
  label: string;
  textSpan?: number;
  justify?: 'start' | 'end';
};

const DatePickerWithLabel = ({
  justify = 'end',
  textSpan = 5,
  ...props
}: DatePickerWithLabelProps) => {
  const { Text } = Typography;
  const { RangePicker } = DatePicker;

  return (
    <Row align='middle' gutter={30} className='input-date'>
      <Col span={textSpan} className={justify === 'start' ? '' : 'justify-end'}>
        <Text type='secondary'>{props.label}</Text>
      </Col>
      <Col span={24 - textSpan}>
        <RangePicker className='width-full' />
      </Col>
    </Row>
  );
};

export default DatePickerWithLabel;
