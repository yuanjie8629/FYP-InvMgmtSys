import { Col, DatePicker, Form, FormItemProps, Row, Typography } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';

type DatePickerWithLabelProps = RangePickerProps & {
  label: string;
  textSpan?: number;
  justify?: 'start' | 'end';
  formProps?: FormItemProps;
};

const DatePickerWithLabel = ({
  label,
  textSpan = 5,
  justify = 'end',
  formProps,
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
        <Form.Item {...formProps}>
          <RangePicker
            className='full-width'
            {...props}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default DatePickerWithLabel;
