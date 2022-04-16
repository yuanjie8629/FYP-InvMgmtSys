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
    | { stock: number; onSave?: (value: number) => void }
    | { stock?: never; onSave?: never }
  );

const InvStockInput = ({
  onSave = () => '',
  loading = false,
  stock,
  ...props
}: InvStockInputProps) => {
  const [operation, setOperation] = useState(invInputOptions[0].value);
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(0);
  }, [stock]);

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
          disabled={loading}
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
              disabled={loading}
              {...props}
            />
          </Form.Item>
        </Col>
        <Col>
          <Button
            type='primary'
            size={'small'}
            onClick={() => {
              if (stock !== undefined) {
                let newValue = stock;
                if (operation === '+') {
                  newValue += value;
                  console.log(newValue);
                } else if (operation === '-') {
                  if (newValue >= value) {
                    newValue -= value;
                  } else {
                    newValue = 0;
                  }
                } else if (operation === 'set') {
                  newValue = value;
                }
                onSave(newValue);
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
