import FilterSubmitButton from '@components/Button/ActionButton/FilterSubmitButton';
import FilterInputCol from '@components/Container/FilterInputCol';
import DateRangePickerWithLabel from '@components/Input/DateRangePickerWithLabel';
import InputNumberRange from '@components/Input/InputNumberRange';
import InputSelect from '@components/Input/InputSelect';
import SelectWithLabel from '@components/Input/SelectWithLabel';
import { removeInvalidData } from '@utils/arrayUtils';
import { getDt } from '@utils/dateUtils';
import { custStatusCat } from '@utils/optionUtils';
import { Form, Row, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const CustMgmtFilterInputs = () => {
  const [custMgmtFilter] = useForm();
  const [searchParams, setSearchParams] = useSearchParams();

  const custInputSelect: {
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

  const [selectedInputSelect, setSelectedInputSelect] = useState(
    custInputSelect.defaultVal
  );

  const custStatus = {
    placeholder: 'Select Customer Status',
    options: custStatusCat,
  };

  const handleSearch = (values) => {
    values = removeInvalidData(values);
    let { joined_date, status, ...value } = values;
    if (status === 'active') {
      value.is_active = true;
    } else if (status === 'suspended') {
      value.is_active = false;
    }

    if (joined_date) {
      joined_date = {
        joined_date_after: getDt(joined_date[0]),
        joined_date_before: getDt(joined_date[1]),
      };
    }

    setSearchParams(
      searchParams.get('type') !== null
        ? {
            type: searchParams.get('type'),
            ...value,
          }
        : { ...value, ...joined_date }
    );
  };

  const handleReset = () => {
    setSearchParams(
      searchParams.get('type') !== null
        ? {
            type: searchParams.get('type'),
          }
        : {}
    );
  };

  return (
    <Form
      name='custMgmtFilter'
      form={custMgmtFilter}
      onFinish={handleSearch}
      layout='inline'
    >
      <Space direction='vertical' size={30} className='full-width'>
        <Row gutter={[30, 30]}>
          <FilterInputCol>
            <InputSelect
              formProps={{ name: selectedInputSelect }}
              selectBefore={custInputSelect}
              placeholder='Input'
              selectWidth={150}
              onChange={(selected) => {
                custMgmtFilter.setFieldsValue({
                  [selected.type]: selected.value,
                });
                setSelectedInputSelect(selected.type);
              }}
            ></InputSelect>
          </FilterInputCol>
          <FilterInputCol>
            <SelectWithLabel
              formProps={{ name: 'status' }}
              label='Customer Status'
              select={custStatus}
              textSpan={7}
              onSelect={(value) => {
                custMgmtFilter.setFieldsValue({ status: value });
              }}
            />
          </FilterInputCol>

          <FilterInputCol>
            <DateRangePickerWithLabel
              formProps={{ name: 'joined_date' }}
              label='Joined Date'
              textSpan={6}
              justify='start'
            />
          </FilterInputCol>
          <FilterInputCol>
            <InputNumberRange
              formProps={{ name: 'sales_per_month' }}
              label='Sales per Month'
              placeholder={['Start', 'End']}
              prefix='RM'
              prefixWidth={60}
              min={0}
              precision={2}
              textSpan={7}
              onChange={(value) => {
                custMgmtFilter.setFieldsValue({ sales_per_month: value });
              }}
            />
          </FilterInputCol>
          <FilterInputCol>
            <DateRangePickerWithLabel
              formProps={{ name: 'last_order_date' }}
              label='Last Order Date'
              textSpan={6}
              justify='start'
            />
          </FilterInputCol>
        </Row>
        <FilterSubmitButton onReset={handleReset} />
      </Space>
    </Form>
  );
};

export default CustMgmtFilterInputs;
