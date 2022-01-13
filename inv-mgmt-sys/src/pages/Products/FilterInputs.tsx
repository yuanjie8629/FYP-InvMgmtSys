import FilterInputCol from '@components/Grid/FilterInputCol';
import InputNumberRange from '@components/Input/InputNumberRange';
import InputSelect from '@components/Input/InputSelect';
import SelectWithLabel from '@components/Input/SelectWithLabel';
import { Button, Col, Row, Space } from 'antd';

const FilterInputs = () => {
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
    options: [
      { value: 'rte', label: 'Ready-To-Eat' },
      { value: 'rtc', label: 'Ready-To-Cook' },
      { value: 'paste', label: 'Paste' },
    ],
  };
  return (
    <Space direction='vertical' size={20} className='width-full'>
      <Row gutter={[30, 30]}>
        <FilterInputCol>
          <InputSelect
            selectBefore={prodInputSelect}
            placeholder='Input'
            selectWidth={150}
          ></InputSelect>
        </FilterInputCol>
        <FilterInputCol>
          <SelectWithLabel
            label='Category'
            select={prodCatSelect}
            textSpan={4}
          />
        </FilterInputCol>
        <FilterInputCol>
          <InputNumberRange
            label='Stock'
            placeholder={['Start', 'End']}
            min={0}
          />
        </FilterInputCol>
        <FilterInputCol>
          <InputNumberRange
            label='Price'
            placeholder={['Start', 'End']}
            prefix='RM'
            prefixWidth={45}
            min={0}
            precision={2}
            textSpan={2}
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
