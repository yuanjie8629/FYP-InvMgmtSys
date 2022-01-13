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
  textSpan = 3,
  justify = 'end',
  ...props
}: SelectLabelProps) => {
  const { Text } = Typography;

  return (
    <Row align='middle' gutter={10} className='input-select-label'>
      <Col
        xs={textSpan + 1}
        xl={textSpan}
        className={justify === 'start' ? '' : 'justify-end'}
      >
        <Text type='secondary'>{props.label}</Text>
      </Col>
      <Col xs={23 - textSpan} xl={24 - textSpan}>
        <Select
          placeholder={props.select.placeholder}
          className='width-full'
          options={props.select.options}
          {...props}
        />
      </Col>
    </Row>
  );
};

export default SelectWithLabel;
