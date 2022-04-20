import FilterSubmitButton from '@components/Button/ActionButton/FilterSubmitButton';
import FilterInputCol from '@components/Container/FilterInputCol';
import DateRangePickerWithLabel from '@components/Input/DateRangePickerWithLabel';
import InputNumberRange from '@components/Input/InputNumberRange';
import InputSelect from '@components/Input/InputSelect';
import SelectWithLabel from '@components/Input/SelectWithLabel';
import { removeInvalidData } from '@utils/arrayUtils';
import { getDt } from '@utils/dateUtils';
import { custCat } from '@utils/optionUtils';
import { Form, Row, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const FilterInputs = () => {
  const [orderFilter] = useForm();
  const [searchParams, setSearchParams] = useSearchParams();

  const orderInputSelect: {
    defaultVal: string;
    options: {
      value: string;
      label: string;
    }[];
  } = {
    defaultVal: 'id',
    options: [
      { value: 'id', label: 'Order Number' },
      { value: 'cust_name', label: 'Customer Name' },
      { value: 'email', label: 'Customer Email' },
      { value: 'track_num', label: 'Tracking Number' },
    ],
  };

  const [selectedInputSelect, setSelectedInputSelect] = useState(
    orderInputSelect.defaultVal
  );

  const custCatSelect = {
    placeholder: 'Select Customer Type',
    options: custCat,
  };

  useEffect(() => {
    searchParams.forEach((value, key) => {
      orderFilter.setFieldsValue({ [key]: value });
      if (orderInputSelect.options.find((opt) => opt.value === key)) {
        setSelectedInputSelect(key);
      }

      if (['min_amount', 'max_amount'].includes(key)) {
        orderFilter.setFieldsValue({ [key]: parseFloat(value) });
      }
    });
    if (
      searchParams.has('order_date_after') &&
      searchParams.has('order_date_before')
    ) {
      orderFilter.setFieldsValue({
        order_date: [
          moment(searchParams.get('order_date_after'), 'DD-MM-YYYY'),
          moment(searchParams.get('order_date_before'), 'DD-MM-YYYY'),
        ],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearch = (values) => {
    let { order_date, ...value } = values;
    value = removeInvalidData(value);

    if (order_date) {
      order_date = {
        order_date_after: getDt(order_date[0]),
        order_date_before: getDt(order_date[1]),
      };
    }

    setSearchParams(
      searchParams.get('type') !== null
        ? {
            limit: searchParams.get('limit'),
            type: searchParams.get('type'),
            ...value,
            ...order_date,
          }
        : { limit: searchParams.get('limit'), ...value, ...order_date }
    );
  };

  const handleReset = () => {
    setSearchParams(
      searchParams.get('type') !== null
        ? {
            limit: searchParams.get('limit'),
            type: searchParams.get('type'),
          }
        : { limit: searchParams.get('limit') }
    );
  };

  return (
    <Form
      name='orderFilter'
      form={orderFilter}
      onFinish={handleSearch}
      layout='inline'
    >
      <Space direction='vertical' size={30} className='full-width'>
        <Row gutter={[30, 30]}>
          <FilterInputCol>
            <InputSelect
              formProps={{ name: selectedInputSelect }}
              selectBefore={orderInputSelect}
              selectedKeyValue={selectedInputSelect}
              placeholder='Input'
              selectWidth={150}
              onChange={(selected) => {
                orderFilter.setFieldsValue({
                  [selected.type]: selected.value,
                });
                setSelectedInputSelect(selected.type);
              }}
            />
          </FilterInputCol>
          <FilterInputCol>
            <SelectWithLabel
              formProps={{ name: 'cust_type' }}
              label='Customer Type'
              select={custCatSelect}
              textSpan={7}
              onSelect={(value) => {
                orderFilter.setFieldsValue({ cust_type: value });
              }}
            />
          </FilterInputCol>

          <FilterInputCol>
            <InputNumberRange
              formProps={{ name: 'amount' }}
              label='Amount'
              placeholder={['Start', 'End']}
              defaultValue={
                searchParams.has('min_amount') &&
                searchParams.has('max_amount') && [
                  parseFloat(searchParams.get('min_amount')),
                  parseFloat(searchParams.get('max_amount')),
                ]
              }
              prefix='RM'
              justify='start'
              prefixWidth={60}
              min={0}
              precision={2}
              textSpan={4}
              onChange={(value) => {
                orderFilter.setFieldsValue({ amount: value });
              }}
              maxLength={10}
            />
          </FilterInputCol>
          <FilterInputCol>
            <DateRangePickerWithLabel
              formProps={{ name: 'order_date' }}
              label='Order Date'
              textSpan={7}
            />
          </FilterInputCol>
        </Row>
        <FilterSubmitButton onReset={handleReset} />
      </Space>
    </Form>
  );
};

export default FilterInputs;
