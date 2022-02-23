import { Col, DatePicker,DatePickerProps, Row, Typography } from 'antd';

type DateRangePickerWithLabelProps = DatePickerProps & {
  label: string;
  textSpan?: number;
  justify?: 'start' | 'end';
};

const DateRangePickerWithLabel = ({
  label,
  textSpan = 5,
  justify = 'end',
  ...props
}: DateRangePickerWithLabelProps) => {
  const { Text } = Typography;

  return (
    <Row align='middle' gutter={30} className='input-date'>
      <Col span={textSpan} className={justify === 'start' ? '' : 'justify-end'}>
        <Text type='secondary'>{label}</Text>
      </Col>
      <Col span={24 - textSpan}>
        <DatePicker className='full-width' {...props} />
      </Col>
    </Row>
  );
};

export default DateRangePickerWithLabel;
