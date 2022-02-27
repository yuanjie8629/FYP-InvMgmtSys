import React, { useState } from 'react';
import {
  Button,
  Col,
  InputNumber,
  InputNumberProps,
  Radio,
  Row,
  Space,
} from 'antd';
import { invInputOptions } from '@/utils/optionUtils';

export interface InvStockInputProps extends InputNumberProps {
  input: number;
  onSave?: (data: { operation: string; value: number }) => void;
}

const InvStockInput = ({
  input,
  onSave = () => '',
  ...props
}: InvStockInputProps) => {
  const [operation, setOperation] = useState(invInputOptions[0].value);
  const [value, setValue] = useState(input);

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
        </Col>
        <Col>
          <Button
            type='primary'
            size={'small'}
            onClick={() => {
              onSave({ operation: operation, value: value });
            }}
          >
            Save
          </Button>
        </Col>
      </Row>
    </Space>
  );
};

export default InvStockInput;
