import { Input, InputProps as AntdInputProps, Select } from 'antd';
import './Input.less';
interface InputProps extends AntdInputProps {
  width?: number | string;
  selectBefore?: {
    defaultVal: string;
    options: {
      value: string;
      label: string;
    }[];
  };
  selectAfter?: {
    defaultVal: string;
    options: {
      value: string;
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
  const inputSelectBefore =
    props.selectBefore !== undefined ? (
      <Select
        defaultValue={props.selectBefore?.defaultVal}
        options={props.selectBefore.options}
        style={{ width: selectWidth }}
      />
    ) : null;

  const inputSelectAfter =
    props.selectAfter !== undefined ? (
      <Select
        defaultValue={props.selectAfter?.defaultVal}
        options={props.selectAfter.options}
      />
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
