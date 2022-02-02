import {
  Input,
  InputNumber,
  InputNumberProps,
  Typography,
  Row,
  Col,
} from 'antd';
import './InputNumberRange.less';

interface InputNumberRangeProps
  extends Omit<InputNumberProps, 'placeholder' | 'addonBefore' | 'addonAfter'> {
  label?: string;
  placeholder?: string[];
  textSpan?: number;
  justify?: 'start' | 'end';
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
  justify = 'end',
  placeholder = ['', ''],
  textSpan = 5,
  prefix,
  suffix,
  prefixWidth = prefix !== undefined ? 80 : 0,
  suffixWidth = suffix !== undefined ? 80 : 0,
  ...props
}: AdvInputNumberRangeProps) => {
  const { Text } = Typography;
  const inputNumWidth = `calc((100% - (28px + ${prefixWidth}px + ${suffixWidth}px)) / 2)`;

  return (
    <Row align='middle' gutter={30} className='input-range'>
      {props.label !== undefined ? (
        <Col
          span={textSpan}
          className={justify === 'start' ? '' : 'justify-end'}
        >
          <Text type='secondary'>{props.label}</Text>
        </Col>
      ) : null}
      <Col span={24 - textSpan}>
        <Input.Group compact>
          {prefix !== undefined ? (
            <Input
              value={prefix}
              disabled
              style={{ width: prefixWidth }}
              className='input-range-prefix color-grey'
            />
          ) : null}
          <InputNumber
            placeholder={placeholder[0]}
            style={{
              width: inputNumWidth,
            }}
            {...props}
            className={`input-range-left ${
              props.className !== undefined ? props.className : ''
            }`}
          />
          <Input
            style={{ width: 30 }}
            value='-'
            disabled
            className='input-range-splitter'
          />
          <InputNumber
            placeholder={placeholder[1]}
            style={{
              width: inputNumWidth,
            }}
            {...props}
            className={`input-range-right ${
              props.className !== undefined ? props.className : ''
            }`}
          />
          {suffix !== undefined ? (
            <Input
              value={suffix}
              disabled
              style={{ width: suffixWidth }}
              className='input-range-suffix color-grey'
            />
          ) : null}
        </Input.Group>
      </Col>
    </Row>
  );
};

export default InputNumberRange;
