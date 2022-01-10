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
    defaultVal: 'custID',
    options: [
      { value: 'custID', label: 'Customer ID' },
      { value: 'custNm', label: 'Customer Name' },
    ],
  };

  const custStatus = {
    placeholder: 'Select Customer Status',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'suspended', label: 'Suspended' },
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
            label='Customer Status'
            select={custStatus}
            textSpan={8}
          />
        </FilterInputCol>

        <FilterInputCol>
          <DatePickerWithLabel label='Birthdate' justify={'end'} textSpan={7} />
        </FilterInputCol>
        <FilterInputCol>
          <DatePickerWithLabel
            label='Registration Date'
            justify={'start'}
            textSpan={8}
          />
        </FilterInputCol>
        <FilterInputCol>
          <InputNumberRange
            label='Sales per Month'
            placeholder={['Start', 'End']}
            prefix='RM'
            prefixWidth={45}
            min={0}
            precision={2}
            justify={'end'}
            textSpan={8}
          />
        </FilterInputCol>
        <FilterInputCol>
          <DatePickerWithLabel label='Last Order Date' textSpan={7} />
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