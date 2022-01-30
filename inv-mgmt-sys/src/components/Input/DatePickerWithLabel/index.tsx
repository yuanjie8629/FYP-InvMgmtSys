import { Col, DatePicker, Row, Typography } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';

type DatePickerWithLabelProps = RangePickerProps & {
  label: string;
  textSpan?: number;
  justify?: 'start' | 'end';
};

const DatePickerWithLabel = ({
  label,
  textSpan = 5,
  justify = 'end',
  ...props
}: DatePickerWithLabelProps) => {
  const { Text } = Typography;
  const { RangePicker } = DatePicker;

  return (
    <Row align='middle' gutter={30} className='input-date'>
      <Col span={textSpan} className={justify === 'start' ? '' : 'justify-end'}>
        <Text type='secondary'>{label}</Text>
      </Col>
      <Col span={24 - textSpan}>
        <RangePicker className='width-full' {...props} />
      </Col>
    </Row>
  );
};

export default DatePickerWithLabel;
