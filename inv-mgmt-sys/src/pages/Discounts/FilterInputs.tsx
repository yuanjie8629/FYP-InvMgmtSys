import FilterInputCol from '@components/Grid/FilterInputCol';
import DatePickerWithLabel from '@components/Input/DatePickerWithLabel';
import InputNumberRange from '@components/Input/InputNumberRange';
import InputSelect from '@components/Input/InputSelect';
import SelectWithLabel from '@components/Input/SelectWithLabel';
import { Button, Col, Row, Space } from 'antd';

const FilterInputs = () => {
  const orderInputSelect: {
    defaultVal: string;
    options: {
      value: string;
      label: string;
    }[];
  } = {
    defaultVal: 'discCde',
    options: [{ value: 'discCde', label: 'Discount Code' }],
  };

  const custCatSelect = {
    placeholder: 'Select Customer Type',
    options: [
      { value: 'agent', label: 'Agent' },
      { value: 'drpshpr', label: 'Dropshipper' },
      { value: 'cust', label: 'Direct Customer' },
    ],
  };

  return (
    <Space direction='vertical' size={20} className='width-full'>
      <Row gutter={[30, 30]}>
        <FilterInputCol>
          <InputSelect
            selectBefore={orderInputSelect}
            placeholder='Input'
            selectWidth={150}
          ></InputSelect>
        </FilterInputCol>
        <FilterInputCol>
          <SelectWithLabel
            label='Customer Type'
            select={custCatSelect}
            textSpan={7}
            mode='multiple'
          />
        </FilterInputCol>

        <FilterInputCol>
          <DatePickerWithLabel
            label='Available Date'
            justify='start'
            textSpan={6}
          />
        </FilterInputCol>
        <FilterInputCol>
          <InputNumberRange
            label='Availability'
            placeholder={['Start', 'End']}
            min={0}
            textSpan={7}
          />
        </FilterInputCol>
      </Row>
      <Row gutter={20}>
        <Col>
          <Button type='primary'>Search</Button>
        </Col>
        <Col>
          <Button>Reset</Button>
        </Col>
      </Row>
    </Space>
  );
};

export default FilterInputs;
