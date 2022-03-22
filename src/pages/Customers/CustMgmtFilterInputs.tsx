import FilterInputCol from '@components/Container/FilterInputCol';
import DateRangePickerWithLabel from '@components/Input/DateRangePickerWithLabel';
import InputNumberRange from '@components/Input/InputNumberRange';
import InputSelect from '@components/Input/InputSelect';
import SelectWithLabel from '@components/Input/SelectWithLabel';
import { custStatusCat } from '@utils/optionUtils';
import { Button, Col, Row, Space } from 'antd';

const CustMgmtFilterInputs = () => {
  const orderInputSelect: {
    defaultVal: string;
    options: {
      value: string;
      label: string;
    }[];
  } = {
    defaultVal: 'id',
    options: [
      { value: 'id', label: 'Customer ID' },
      { value: 'name', label: 'Customer Name' },
      { value: 'email', label: 'Customer Email' },
    ],
  };

  const custStatus = {
    placeholder: 'Select Customer Status',
    options: custStatusCat,
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
            label='Customer Status'
            select={custStatus}
            textSpan={7}
          />
        </FilterInputCol>

        <FilterInputCol>
          <DateRangePickerWithLabel
            label='Joined Date'
            textSpan={6}
            justify='start'
          />
        </FilterInputCol>
        <FilterInputCol>
          <InputNumberRange
            label='Sales per Month'
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
            label='Last Order Date'
            textSpan={6}
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

export default CustMgmtFilterInputs;
