import {
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  FormItemProps,
  Row,
  Typography,
} from 'antd';

type DateRangePickerWithLabelProps = DatePickerProps & {
  label: string;
  textSpan?: number;
  justify?: 'start' | 'end';
  formProps?: FormItemProps;
};

const DateRangePickerWithLabel = ({
  label,
  textSpan = 5,
  justify = 'end',
  formProps,
  ...props
}: DateRangePickerWithLabelProps) => {
  const { Text } = Typography;

  return (
    <Row align='middle' gutter={30} className='input-date'>
      <Col span={textSpan} className={justify === 'start' ? '' : 'justify-end'}>
        <Text type='secondary'>{label}</Text>
      </Col>
      <Col span={24 - textSpan}>
        <Form.Item {...formProps}>
          <DatePicker className='full-width' {...props} />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default DateRangePickerWithLabel;
