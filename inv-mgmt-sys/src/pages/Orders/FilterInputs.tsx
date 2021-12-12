import FilterInputCol from '@components/Grid/FilterInputCol';
import DatePickerWithLabel from '@components/Input/DatePickerWithLabel';
import InputRange from '@components/Input/InputRange';
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
    defaultVal: 'orderID',
    options: [
      { val: 'orderID', label: 'Order ID' },
      { val: 'custNm', label: 'Customer' },
      { val: 'custType', label: 'Customer Type' },
      { val: 'trackingNum', label: 'Tracking Number' },
    ],
  };

  const custCatSelect = {
    placeholder: 'Select Customer Type',
    options: [
      { val: 'agent', label: 'Agent' },
      { val: 'drpshpr', label: 'Dropshipper' },
      { val: 'cust', label: 'Direct Customer' },
    ],
  };

  const payMthdSelect = {
    placeholder: 'Select Payment Method',
    options: [
      { val: 'intBnk', label: 'Internet Banking' },
      { val: 'card', label: 'Card' },
      { val: 'paypal', label: 'Paypal' },
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
            textSpan={screens.xl ? 6 : 5}
          />
        </FilterInputCol>

        <FilterInputCol>
          <SelectWithLabel
            label='Payment Method'
            select={payMthdSelect}
            justify={screens.xl ? 'end' : 'start'}
            textSpan={6}
          />
        </FilterInputCol>
        <FilterInputCol>
          <InputRange
            label='Amount'
            placeholder={['Start', 'End']}
            addonBefore='RM'
            min={0}
            precision={2}
            justify={screens.xl ? 'start' : 'end'}
            textSpan={screens.xl ? 4 : 6}
          />
        </FilterInputCol>
        <FilterInputCol>
          <DatePickerWithLabel
            label='Order Date'
            justify={screens.xl ? 'end' : 'start'}
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
