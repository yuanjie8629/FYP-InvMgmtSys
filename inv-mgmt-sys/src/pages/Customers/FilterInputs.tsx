import FilterInputCol from '@components/Grid/FilterInputCol';
import DatePickerWithLabel from '@components/Input/DatePickerWithLabel';
import InputNumberRange from '@components/Input/InputNumberRange';
import InputSelect from '@components/Input/InputSelect';
import SelectWithLabel from '@components/Input/SelectWithLabel';
import { Button, Col, Row, Space, Grid } from 'antd';

const FilterInputs = () => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const orderInputSelect: {
    defaultVal: string;
    options: {
      val: string;
      label: string;
    }[];
  } = {
    defaultVal: 'custID',
    options: [
      { val: 'custID', label: 'Customer ID' },
      { val: 'custNm', label: 'Customer Name' },
    ],
  };

  const custStatus = {
    placeholder: 'Select Customer Status',
    options: [
      { val: 'active', label: 'Active' },
      { val: 'suspended', label: 'Suspended' },
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
            textSpan={screens.xl ? 6 : 6}
          />
        </FilterInputCol>

        <FilterInputCol>
          <DatePickerWithLabel
            label='Birthdate'
            justify={screens.xl ? 'end' : 'start'}
            textSpan={screens.xl ? 6 : 7}
          />
        </FilterInputCol>
        <FilterInputCol>
          <DatePickerWithLabel
            label='Registration Date'
            justify={screens.xl ? 'start' : 'end'}
            textSpan={screens.xl ? 6 : 7}
          />
        </FilterInputCol>
        <FilterInputCol>
          <InputNumberRange
            label='Sales per Month'
            placeholder={['Start', 'End']}
            prefix='RM'
            min={0}
            precision={2}
            justify={screens.xl ? 'end' : 'start'}
            textSpan={screens.xl ? 6 : 7}
          />
        </FilterInputCol>
        <FilterInputCol>
          <DatePickerWithLabel
            label='Last Order Date'
            textSpan={screens.xl ? 6 : 7}
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
