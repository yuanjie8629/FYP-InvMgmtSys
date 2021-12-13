import FilterInputCol from '@components/Grid/FilterInputCol';
import InputNumberRange from '@components/Input/InputNumberRange';
import InputSelect from '@components/Input/InputSelect';
import SelectWithLabel from '@components/Input/SelectWithLabel';
import { Button, Col, Row, Space, Grid } from 'antd';

const FilterInputs = () => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const prodInputSelect: {
    defaultVal: string;
    options: {
      val: string;
      label: string;
    }[];
  } = {
    defaultVal: 'prodName',
    options: [
      { val: 'prodName', label: 'Product Name' },
      { val: 'prodSKU', label: 'Product SKU' },
    ],
  };

  const prodCatSelect = {
    placeholder: 'Select Category',
    options: [
      { val: 'rte', label: 'Ready-To-Eat' },
      { val: 'rtc', label: 'Ready-To-Cook' },
      { val: 'paste', label: 'Paste' },
    ],
  };
  return (
    <Space direction='vertical' size={20} className='width-full'>
      <Row gutter={[30, 30]}>
        <FilterInputCol>
          <InputSelect
            selectBefore={prodInputSelect}
            placeholder='Input'
          ></InputSelect>
        </FilterInputCol>
        <FilterInputCol>
          <SelectWithLabel
            label='Category'
            select={prodCatSelect}
            textSpan={screens.xl ? 4 : 5}
          />
        </FilterInputCol>
        <FilterInputCol>
          <InputNumberRange
            label='Stock'
            placeholder={['Start', 'End']}
            min={0}
            justify={screens.xl ? 'end' : 'start'}
          />
        </FilterInputCol>
        <FilterInputCol>
          <InputNumberRange
            label='Price'
            placeholder={['Start', 'End']}
            prefix='RM'
            min={0}
            precision={2}
            textSpan={screens.xl ? 2 : 6}
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
