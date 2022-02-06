import { Input, InputProps as AntdInputProps, Select } from 'antd';

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
  selectBefore,
  selectAfter,
  selectWidth = 'fit-content',
  ...props
}: InputProps) => {
  const inputSelectBefore =
    selectBefore !== undefined ? (
      <Select
        defaultValue={selectBefore?.defaultVal}
        options={selectBefore.options}
        style={{ width: selectWidth }}
      />
    ) : null;

  const inputSelectAfter =
    selectAfter !== undefined ? (
      <Select
        defaultValue={selectAfter?.defaultVal}
        options={selectAfter.options}
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
