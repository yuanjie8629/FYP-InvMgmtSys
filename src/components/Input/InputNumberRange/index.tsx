import {
  Input,
  InputNumber,
  InputNumberProps,
  Typography,
  Row,
  Col,
} from 'antd';
import './InputNumberRange.less';

export interface InputNumberRangeProps
  extends Omit<InputNumberProps, 'placeholder' | 'addonBefore' | 'addonAfter'> {
  label?: string;
  placeholder?: string[];
  textSpan?: number;
  justify?: 'start' | 'end';
  disabled?: boolean;
  onStartRange?: (value: number) => void;
  onEndRange?: (value: number) => void;
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
  onStartRange = () => null,
  onEndRange = () => null,
  className,
  ...props
}: AdvInputNumberRangeProps) => {
  const { Text } = Typography;
  const inputNumWidth = `calc((100% - (28px + ${prefixWidth}px + ${suffixWidth}px)) / 2)`;

  return (
    <Row align='middle' gutter={30} className='input-range'>
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
          <InputNumber
            placeholder={placeholder[0]}
            disabled={disabled}
            onChange={(value: number) => onStartRange(value)}
            style={{
              width: inputNumWidth,
            }}
            className={`input-range-left${
              className !== undefined ? ` ${className}` : ''
            }`}
            {...props}
          />
          <Input
            style={{ width: 30 }}
            value='-'
            disabled={disabled}
            className='input-range-splitter'
          />
          <InputNumber
            placeholder={placeholder[1]}
            disabled={disabled}
            onChange={(value: number) => onEndRange(value)}
            style={{
              width: inputNumWidth,
            }}
            className={`input-range-right${
              className !== undefined ? ` ${className}` : ''
            }`}
            {...props}
          />
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
  );
};

export default InputNumberRange;
