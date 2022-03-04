import FilterInputCol from '@components/Container/FilterInputCol';
import DateRangePickerWithLabel from '@components/Input/DateRangePickerWithLabel';
import InputNumberRange from '@components/Input/InputNumberRange';
import InputSelect from '@components/Input/InputSelect';
import SelectWithLabel from '@components/Input/SelectWithLabel';
import { custCat } from '@utils/optionUtils';
import { Button, Col, Row, Space } from 'antd';

const FilterInputs = () => {
  const orderInputSelect: {
    defaultVal: string;
    options: {
      value: string;
      label: string;
    }[];
  } = {
    defaultVal: 'orderID',
    options: [
      { value: 'orderID', label: 'Order ID' },
      { value: 'custNm', label: 'Customer Name' },
      { value: 'trackingNum', label: 'Tracking Number' },
    ],
  };

  const custCatSelect = {
    placeholder: 'Select Customer Type',
    options: custCat,
  };

  const payMthdSelect = {
    placeholder: 'Select Payment Method',
    options: [
      { value: 'intBnk', label: 'Internet Banking' },
      { value: 'card', label: 'Card' },
      { value: 'paypal', label: 'Paypal' },
    ],
  };

  return (
    <Space direction='vertical' size={20} className='full-width'>
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
          />
        </FilterInputCol>

        <FilterInputCol>
          <SelectWithLabel
            label='Payment Method'
            select={payMthdSelect}
            justify='start'
            textSpan={7}
          />
        </FilterInputCol>
        <FilterInputCol>
          <InputNumberRange
            label='Amount'
            placeholder={['Start', 'End']}
            prefix='RM'
            prefixWidth={60}
            min={0}
            precision={2}
            textSpan={7}
          />
        </FilterInputCol>
        <FilterInputCol>
          <DateRangePickerWithLabel
            label='Order Date'
            justify='start'
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