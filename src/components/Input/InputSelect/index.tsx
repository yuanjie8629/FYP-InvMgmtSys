import { capitalize } from '@utils/strUtils';
import {
  Form,
  FormItemProps,
  Input,
  InputProps as AntdInputProps,
  Select,
} from 'antd';
import { useState } from 'react';
import './InputSelect.less';

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
  selectedKeyValue?: string;
}

const InputSelect = ({
  width = '100%',
  selectBefore,
  selectAfter,
  selectedKeyValue,
  selectWidth = 'fit-content',
  onChange = () => null,
  formProps,
  placeholder,
  className,
  ...props
}: InputProps) => {
  const [selectType, setSelectType] = useState(selectBefore.defaultVal);
  const [selectValue, setSelectValue] = useState('');

  const inputSelectBefore = selectBefore && (
    <Select
      defaultValue={selectedKeyValue || selectBefore.defaultVal}
      options={selectBefore.options}
      style={{ width: selectWidth }}
      onSelect={(value) => {
        setSelectType(value);
        onChange({ type: value, value: selectValue });
      }}
    />
  );

  const inputSelectAfter = selectAfter && (
    <Select
      defaultValue={selectedKeyValue || selectAfter?.defaultVal}
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
        onChange={(e) => {
          setSelectValue(e.target.value);
          onChange({ type: selectType, value: e.target.value });
        }}
        placeholder={`${placeholder} ${
          selectBefore.options.find(
            (option) => option.value === selectedKeyValue
          )?.label || capitalize(selectBefore.defaultVal)
        }`}
        className={`input-select${className ? ` ${className}` : ''}`}
        {...props}
      />
    </Form.Item>
  );
};

export default InputSelect;
