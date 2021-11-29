import Radio, { RadioGroupProps as AntdRadioGroupProps } from 'antd/es/radio';

interface RadioGroupProps extends AntdRadioGroupProps {
  radioButtons: { value: string; label: string }[];
  onClickEvent?: any;
}

const RadioGroup = (props: RadioGroupProps) => {
  return (
    <Radio.Group
      buttonStyle='solid'
      size='large'
      style={{ marginRight: 30 }}
      defaultValue='year'
      onChange={(e) => props.onClickEvent(e.target.value)}
    >
      {props.radioButtons.map((radioBtn) => (
        <Radio.Button
          key={radioBtn.value}
          value={radioBtn.value}
          onClick={(e) => {
            e.currentTarget.blur();
          }}
        >
          {radioBtn.label}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};

export default RadioGroup;
