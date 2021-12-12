import {
  InputNumber,
  InputNumberProps,
  Typography,
  Row,
  Col,
  Space,
} from 'antd';

interface InputProps extends Omit<InputNumberProps, 'placeholder'> {
  label: string;
  placeholder?: string[];
  textSpan?: number;
  justify?: 'start' | 'end';
}

const Input = ({
  justify = 'end',
  width = 'fit-content',
  placeholder = ['', ''],
  textSpan = 3,
  ...props
}: InputProps) => {
  const { Text } = Typography;
  return (
    <Row align='middle' gutter={10} className='input-select-label'>
      <Col span={textSpan} className={justify === 'start' ? '' : 'justify-end'}>
        <Text type='secondary'>{props.label}</Text>
      </Col>
      <Col span={24 - textSpan}>
        <Space>
          <InputNumber
            placeholder={placeholder[0]}
            style={{ width: width }}
            {...props}
          />
          <Text>-</Text>
          <InputNumber
            placeholder={placeholder[1]}
            style={{ width: width }}
            {...props}
          ></InputNumber>
        </Space>
      </Col>
    </Row>
  );
};

export default Input;
