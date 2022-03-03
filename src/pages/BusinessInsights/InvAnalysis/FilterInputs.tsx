import DatePickerWithLabel from '@components/Input/DatePickerWithLabel';
import FilterInputCol from '@components/Container/FilterInputCol';
import InputNumberRange from '@components/Input/InputNumberRange';
import InputSelect from '@components/Input/InputSelect';
import SelectWithLabel from '@components/Input/SelectWithLabel';
import { prodCat } from '@utils/optionUtils';
import { Button, Col, Row, Space } from 'antd';
import moment from 'moment';

interface FilterInputsProps {
  onSearch?: (searchParams: string[]) => void;
}

const FilterInputs = (props: FilterInputsProps) => {
  const prodInputSelect: {
    defaultVal: string;
    options: {
      value: string;
      label: string;
    }[];
  } = {
    defaultVal: 'prodName',
    options: [
      { value: 'prodName', label: 'Product Name' },
      { value: 'prodSKU', label: 'Product SKU' },
    ],
  };

  const prodCatSelect = {
    placeholder: 'Select Category',
    options: prodCat,
  };

  return (
    <Space direction='vertical' size={20} className='full-width'>
      <Row gutter={[30, 30]}>
        <FilterInputCol>
          <InputSelect
            selectBefore={prodInputSelect}
            placeholder='Input'
            selectWidth={150}
          ></InputSelect>
        </FilterInputCol>
        <FilterInputCol>
          <SelectWithLabel label='Category' select={prodCatSelect} />
        </FilterInputCol>
        <FilterInputCol>
          <InputNumberRange
            label='Demand'
            placeholder={['Start', 'End']}
            min={0}
            justify='start'
          />
        </FilterInputCol>
        <FilterInputCol>
          <InputNumberRange
            label='Price'
            placeholder={['Start', 'End']}
            prefix='RM'
            prefixWidth={60}
            min={0}
            precision={2}
          />
        </FilterInputCol>
        <FilterInputCol>
          <DatePickerWithLabel
            picker='month'
            disabledDate={(current) => current > moment()}
            defaultValue={moment()}
            defaultPickerValue={moment()}
            allowClear={false}
            dropdownAlign={{ points: ['tc', 'bc'] }}
            label='Analysis Month'
            justify='start'
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
