import { Input, InputProps as AntdInputProps, Select } from 'antd';

interface InputProps extends AntdInputProps {
  width?: number | string;
  selectBefore?: {
    defaultVal: string;
    options: {
      val: string;
      label: string;
    }[];
  };
  selectAfter?: {
    defaultVal: string;
    options: {
      val: string;
      label: string;
    }[];
  };
}

const InputSelect = ({
  width = '100%',
  selectBefore = undefined,
  selectAfter = undefined,
  ...props
}: InputProps) => {
  const { Option } = Select;
  const inputSelectBefore =
    selectBefore !== undefined ? (
      <Select defaultValue={selectBefore?.defaultVal}>
        {selectBefore?.options.map((option) => (
          <Option key={option.val} value={option.val}>
            {option.label}
          </Option>
        ))}
      </Select>
    ) : null;

  const inputSelectAfter =
    selectAfter !== undefined ? (
      <Select defaultValue={selectAfter?.defaultVal}>
        {selectAfter?.options.map((option) => (
          <Option key={option.val} value={option.val}>
            {option.label}
          </Option>
        ))}
      </Select>
    ) : null;

  return (
    <Input
      addonBefore={inputSelectBefore}
      addonAfter={inputSelectAfter}
      style={{ width: width }}
      {...props}
    />
  );
};

export default InputSelect;
