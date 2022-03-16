import {
  Col,
  Form,
  FormItemProps,
  Row,
  Select,
  SelectProps,
  Typography,
} from 'antd';

export interface SelectLabelProps extends SelectProps<any> {
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
  formProps?: FormItemProps;
  onSelect?: (selected: string) => void;
}

const SelectWithLabel = ({
  label,
  select,
  textSpan = 5,
  justify = 'end',
  className,
  onSelect = () => null,
  formProps,
  ...props
}: SelectLabelProps) => {
  const { Text } = Typography;

  return (
    <Row align='middle' gutter={30} className='input-select-label'>
      <Col span={textSpan} className={justify === 'start' ? '' : 'justify-end'}>
        <Text type='secondary'>{label}</Text>
      </Col>
      <Col span={24 - textSpan}>
        <Form.Item {...formProps}>
          <Select
            placeholder={select.placeholder}
            options={select.options}
            allowClear
            className={`full-width${
              className !== undefined ? ` ${className}` : ''
            }`}
            onClear={() => onSelect(null)}
            onSelect={(selected) => onSelect(selected)}
            {...props}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default SelectWithLabel;
