import { InputNumber, InputNumberProps, Typography, Space } from 'antd';

interface InputProps extends Omit<InputNumberProps, 'placeholder'> {
  totalWidth?: number | string;
  width?: number | string;
  label: string;
  placeholder?: string[];
}

const Input = ({
  totalWidth = '100%',
  width = 'fit-content',
  placeholder = ['', ''],
  ...props
}: InputProps) => {
  const { Text } = Typography;
  return (
    <Space size={10} style={{ width: totalWidth }}>
      <Text className='color-grey'>{props.label}</Text>
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
  );
};

export default Input;
