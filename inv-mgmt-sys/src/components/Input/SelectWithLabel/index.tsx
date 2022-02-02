import { Col, Row, Select, SelectProps, Typography } from 'antd';

interface SelectLabelProps extends SelectProps<any> {
  label: string;
  select: {
    placeholder: string;
    options: {
      value: string;
      label: string;
    }[];
  };
  textSpan?: number;
  justify?: 'start' | 'end';
}

const SelectWithLabel = ({
  textSpan = 5,
  justify = 'end',
  ...props
}: SelectLabelProps) => {
  const { Text } = Typography;

  return (
    <Row align='middle' gutter={30} className='input-select-label'>
      <Col span={textSpan} className={justify === 'start' ? '' : 'justify-end'}>
        <Text type='secondary'>{props.label}</Text>
      </Col>
      <Col span={24 - textSpan}>
        <Select
          placeholder={props.select.placeholder}
          options={props.select.options}
          allowClear
          {...props}
          className={`width-full ${
            props.className !== undefined ? props.className : ''
          }`}
        />
      </Col>
    </Row>
  );
};

export default SelectWithLabel;
