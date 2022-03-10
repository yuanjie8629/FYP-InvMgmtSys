import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Form,
  InputNumber,
  InputNumberProps,
  Radio,
  Row,
  Space,
} from 'antd';
import { invInputOptions } from '@utils/optionUtils';

export type InvStockInputProps = InputNumberProps & {
  loading?: boolean;
} & (
    | { initialValue: number; onSave?: (value: number) => void }
    | { initialValue?: never; onSave?: never }
  );

const InvStockInput = ({
  onSave = () => '',
  loading = false,
  initialValue,
  ...props
}: InvStockInputProps) => {
  const [operation, setOperation] = useState(invInputOptions[0].value);
  const [value, setValue] = useState(0 | initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Space size={10} direction='vertical'>
      <Row>
        <Radio.Group
          buttonStyle='solid'
          size={'small'}
          value={operation}
          options={invInputOptions}
          optionType='button'
          onChange={(e) => {
            setOperation(e.target.value);
          }}
        />
      </Row>
      <Row gutter={[10, 10]}>
        <Col>
          <Form.Item>
            <InputNumber
              value={value}
              min={0}
              size={'small'}
              style={{ width: 150 }}
              onChange={(value: number) => {
                setValue(value);
              }}
              {...props}
            />
          </Form.Item>
        </Col>
        <Col>
          <Button
            type='primary'
            size={'small'}
            onClick={() => {
              if (initialValue) {
                let newValue = initialValue;
                if (operation === '+') {
                  newValue += value;
                } else if (operation === '-') {
                  newValue -= value;
                } else if (operation === 'set') {
                  newValue = value;
                }
                onSave(newValue);
                setValue(0);
              }
            }}
            loading={loading}
          >
            Save
          </Button>
        </Col>
      </Row>
    </Space>
  );
};

export default InvStockInput;
