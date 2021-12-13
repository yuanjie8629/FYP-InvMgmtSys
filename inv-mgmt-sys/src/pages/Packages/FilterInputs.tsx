import FilterInputCol from '@components/Grid/FilterInputCol';
import DatePickerWithLabel from '@components/Input/DatePickerWithLabel';
import InputNumberRange from '@components/Input/InputNumberRange';
import InputSelect from '@components/Input/InputSelect';
import { Button, Col, Row, Space, Grid } from 'antd';

const FilterInputs = () => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const packInputSelect: {
    defaultVal: string;
    options: {
      val: string;
      label: string;
    }[];
  } = {
    defaultVal: 'packNm',
    options: [
      { val: 'packNm', label: 'Package Name' },
      { val: 'packSKU', label: 'Package SKU' },
    ],
  };

  return (
    <Space direction='vertical' size={20} className='width-full'>
      <Row gutter={[30, 30]}>
        <FilterInputCol>
          <InputSelect
            selectBefore={packInputSelect}
            placeholder='Input'
          ></InputSelect>
        </FilterInputCol>
        <FilterInputCol>
          <InputNumberRange
            label='Stock'
            placeholder={['Start', 'End']}
            min={0}
            textSpan={screens.xl ? 3 : 6}
          />
        </FilterInputCol>
        <FilterInputCol>
          <InputNumberRange
            label='Price'
            placeholder={['Start', 'End']}
            prefix='RM'
            min={0}
            precision={2}
            justify={screens.xl ? 'end' : 'start'}
          />
        </FilterInputCol>
        <FilterInputCol>
          <DatePickerWithLabel
            label='Available Period'
            justify={screens.xl ? 'start' : 'end'}
            textSpan={6}
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
