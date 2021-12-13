import React, { useEffect, useRef, useState } from 'react';
import {
  Input,
  InputNumber,
  InputNumberProps,
  Typography,
  Row,
  Col,
} from 'antd';
import './Input.less';

interface InputNumberRangeProps
  extends Omit<InputNumberProps, 'placeholder' | 'addonBefore' | 'addonAfter'> {
  label?: string;
  placeholder?: string[];
  prefix?: string;
  suffix?: string;
  textSpan?: number;

  justify?: 'start' | 'end';
  prefixPadding?: number;
  suffixPadding?: number;
}

const InputNumberRange = ({
  justify = 'end',
  placeholder = ['', ''],
  textSpan = 3,
  prefixPadding = 22,
  suffixPadding = 22,
  ...props
}: InputNumberRangeProps) => {
  const { Text } = Typography;
  const prefixRef = useRef<Input>(null);
  const suffixRef = useRef<Input>(null);
  const firstRender = useRef(true);

  const [prefixWidth, setPrefixWidth] = useState(20);
  const [suffixWidth, setSuffixWidth] = useState(20);

  const inputNumWidth = `calc((100% - (28px + ${prefixWidth}px + ${suffixWidth}px)) / 2)`;

  useEffect(() => {
    if (firstRender.current) {
      // Dynamically set the width of prefix and suffix (input.width + padding width)
      setPrefixWidth(
        prefixRef.current !== null
          ? prefixRef.current.input.offsetWidth + prefixPadding
          : 0
      );
      setSuffixWidth(
        suffixRef.current !== null
          ? suffixRef.current.input.offsetWidth + suffixPadding
          : 0
      );
      firstRender.current = false;
    }
  }, [prefixPadding, firstRender, suffixPadding]);

  return (
    <Row align='middle' gutter={10} className='input-range'>
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
          {props.prefix !== undefined ? (
            <Input
              ref={prefixRef}
              value={props.prefix}
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
            className='input-range-left'
            {...props}
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
            className='input-range-right'
            {...props}
          />
          {props.suffix !== undefined ? (
            <Input
              ref={suffixRef}
              value={props.suffix}
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
