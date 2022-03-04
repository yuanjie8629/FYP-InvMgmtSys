import { Form, FormItemProps, Input, InputProps as AntdInputProps, Select } from 'antd';
import { useState } from 'react';

interface OnSelectProps {
  type: string;
  value: string;
}

export interface InputProps extends Omit<AntdInputProps, 'onChange'> {
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
  onChange?: (selected: OnSelectProps) => void;
  formProps?: FormItemProps;
}

const InputSelect = ({
  width = '100%',
  selectBefore,
  selectAfter,
  selectWidth = 'fit-content',
  onChange = () => null,
  formProps,
  ...props
}: InputProps) => {
  const [selectType, setSelectType] = useState(selectBefore.defaultVal);
  const inputSelectBefore = selectBefore !== undefined && (
    <Select
      defaultValue={selectBefore?.defaultVal}
      options={selectBefore.options}
      style={{ width: selectWidth }}
      onSelect={(value) => setSelectType(value)}
    />
  );

  const inputSelectAfter = selectAfter !== undefined && (
    <Select
      defaultValue={selectAfter?.defaultVal}
      options={selectAfter.options}
      style={{ width: selectWidth }}
    />
  );

  return (
    <Form.Item {...formProps}>
      <Input
        addonBefore={inputSelectBefore}
        addonAfter={inputSelectAfter}
        style={{ width: width }}
        onChange={(e) => onChange({ type: selectType, value: e.target.value })}
        {...props}
      />
    </Form.Item>
  );
};

export default InputSelect;
