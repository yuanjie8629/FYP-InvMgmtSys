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
  label,
  select,
  textSpan = 5,
  justify = 'end',
  className,
  ...props
}: SelectLabelProps) => {
  const { Text } = Typography;

  return (
    <Row align='middle' gutter={30} className='input-select-label'>
      <Col span={textSpan} className={justify === 'start' ? '' : 'justify-end'}>
        <Text type='secondary'>{label}</Text>
      </Col>
      <Col span={24 - textSpan}>
        <Select
          placeholder={select.placeholder}
          options={select.options}
          allowClear
          className={`full-width ${className !== undefined ? className : ''}`}
          {...props}
        />
      </Col>
    </Row>
  );
};

export default SelectWithLabel;
