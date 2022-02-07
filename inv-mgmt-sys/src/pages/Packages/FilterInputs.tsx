import FilterInputCol from '@components/Container/FilterInputCol';
import DateRangePickerWithLabel from '@components/Input/DateRangePickerWithLabel';
import InputNumberRange from '@components/Input/InputNumberRange';
import InputSelect from '@components/Input/InputSelect';
import { Button, Col, Row, Space } from 'antd';

const FilterInputs = () => {
  const packInputSelect: {
    defaultVal: string;
    options: {
      value: string;
      label: string;
    }[];
  } = {
    defaultVal: 'packNm',
    options: [
      { value: 'packNm', label: 'Package Name' },
      { value: 'packSKU', label: 'Package SKU' },
    ],
  };

  return (
    <Space direction='vertical' size={20} className='full-width'>
      <Row gutter={[30, 30]}>
        <FilterInputCol>
          <InputSelect
            selectBefore={packInputSelect}
            placeholder='Input'
            selectWidth={150}
          ></InputSelect>
        </FilterInputCol>
        <FilterInputCol>
          <InputNumberRange
            label='Stock'
            placeholder={['Start', 'End']}
            min={0}
            textSpan={7}
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
            justify='start'
            textSpan={3}
          />
        </FilterInputCol>
        <FilterInputCol>
          <DateRangePickerWithLabel label='Available Period' textSpan={7} />
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
