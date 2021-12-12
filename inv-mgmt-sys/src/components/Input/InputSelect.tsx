import { Input, InputProps as AntdInputProps, Select } from 'antd';
import './Input.less';
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
  selectWidth?: number | string;
}

const InputSelect = ({
  width = '100%',
  selectWidth = 'fit-content',
  ...props
}: InputProps) => {
  const { Option } = Select;
  const inputSelectBefore =
    props.selectBefore !== undefined ? (
      <Select
        defaultValue={props.selectBefore?.defaultVal}
        style={{ width: selectWidth }}
      >
        {props.selectBefore?.options.map((option) => (
          <Option key={option.val} value={option.val}>
            {option.label}
          </Option>
        ))}
      </Select>
    ) : null;

  const inputSelectAfter =
    props.selectAfter !== undefined ? (
      <Select defaultValue={props.selectAfter?.defaultVal}>
        {props.selectAfter?.options.map((option) => (
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
    ></Input>
  );
};

export default InputSelect;
