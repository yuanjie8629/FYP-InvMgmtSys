import { Col, Row, Select, SelectProps, Typography } from 'antd';

interface SelectLabelProps extends SelectProps<any> {
  label: string;
  select: {
    placeholder: string;
    options: {
      val: string;
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
  const { Option } = Select;

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
        <Select placeholder={props.select.placeholder} className='width-full'>
          {props.select.options.map((option) => (
            <Option key={option.val} value={option.val}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Col>
    </Row>
  );
};

export default SelectWithLabel;
