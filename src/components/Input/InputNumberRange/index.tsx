import {
  Input,
  InputNumber,
  InputNumberProps,
  Typography,
  Row,
  Col,
  Form,
  FormItemProps,
} from 'antd';
import { useEffect, useState } from 'react';
import './InputNumberRange.less';

export interface InputNumberRangeProps
  extends Omit<
    InputNumberProps,
    | 'placeholder'
    | 'addonBefore'
    | 'addonAfter'
    | 'value'
    | 'defaultValue'
    | 'onChange'
  > {
  label?: string;
  placeholder?: string[];
  textSpan?: number;
  justify?: 'start' | 'end';
  disabled?: boolean;
  value?: number[];
  onChange?: (value: number) => void;
  formProps?: FormItemProps;
}

type AdvInputNumberRangeProps = InputNumberRangeProps &
  (
    | {
        prefix?: never;
        prefixWidth?: never;
      }
    | {
        prefix: string;
        prefixWidth?: number | string;
      }
  ) &
  (
    | {
        suffix?: never;
        suffixWidth?: never;
      }
    | {
        suffix: string;
        suffixWidth?: number | string;
      }
  );

const InputNumberRange = ({
  label,
  justify = 'end',
  placeholder = ['', ''],
  textSpan = 5,
  prefix,
  suffix,
  prefixWidth = prefix !== undefined ? 80 : 0,
  suffixWidth = suffix !== undefined ? 80 : 0,
  disabled = false,
  value,
  formProps,
  onChange = () => '',
  className,
  ...props
}: AdvInputNumberRangeProps) => {
  const { Text } = Typography;
  const inputNumWidth = `calc((100% - (28px + ${prefixWidth}px + ${suffixWidth}px)) / 2)`;
  const [start, setStart] = useState<number>(undefined);
  const [end, setEnd] = useState<number>(undefined);
  const [validateFailed, setValidateFailed] = useState(false);
  const { name, ...formPropsSpread } = formProps !== undefined && formProps;

  useEffect(() => {
    if (start > end) {
      setValidateFailed(true);
    } else {
      setValidateFailed(false);
    }
  }, [end, start]);

  return (
    <Form.Item
      {...formPropsSpread}
      validateStatus={validateFailed && 'error'}
      help={
        validateFailed && (
          <Row>
            <Col
              push={textSpan}
              span={24 - textSpan}
              style={{ textAlign: 'center' }}
            >
              Starting value should be smaller than ending value.
            </Col>
          </Row>
        )
      }
    >
      <Row
        align='middle'
        gutter={30}
        className={`input-range${validateFailed ? ' input-range-error' : ''}`}
      >
        {label !== undefined && (
          <Col
            span={textSpan}
            className={justify === 'start' ? '' : 'justify-end'}
          >
            <Text type='secondary'>{label}</Text>
          </Col>
        )}
        <Col span={24 - textSpan}>
          <Input.Group compact>
            {prefix !== undefined && (
              <Input
                value={prefix}
                disabled
                style={{ width: prefixWidth }}
                className='input-range-prefix color-grey'
              />
            )}
            <Form.Item
              name={formProps && `min_${formProps.name}`}
              noStyle
              getValueProps={(value) => {
                setStart(value);
                return null;
              }}
            >
              <InputNumber
                value={value && value[0]}
                placeholder={placeholder[0]}
                disabled={disabled}
                style={{
                  width: inputNumWidth,
                }}
                className={`input-range-left${
                  className !== undefined ? ` ${className}` : ''
                }`}
                {...props}
              />
            </Form.Item>

            <Input
              style={{ width: 30 }}
              value='-'
              disabled={disabled}
              className='input-range-splitter'
            />
            <Form.Item
              name={formProps && `max_${formProps.name}`}
              noStyle
              getValueProps={(value) => {
                setEnd(value);
                return null;
              }}
            >
              <InputNumber
                value={value && value[1]}
                placeholder={placeholder[1]}
                disabled={disabled}
                style={{
                  width: inputNumWidth,
                }}
                className={`input-range-right${
                  className !== undefined ? ` ${className}` : ''
                }`}
                {...props}
              />
            </Form.Item>

            {suffix !== undefined && (
              <Input
                value={suffix}
                disabled
                style={{ width: suffixWidth }}
                className='input-range-suffix color-grey'
              />
            )}
          </Input.Group>
        </Col>
      </Row>
    </Form.Item>
  );
};

export default InputNumberRange;
