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
import moment from 'moment';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    searchParams.forEach((value, key) => {
      if (
        !['joined_date_after', 'joined_date_before', 'last_order_dt'].includes(
          key
        )
      ) {
        custMgmtFilter.setFieldsValue({ [key]: value });
      }

      if (custInputSelect.options.find((opt) => opt.value === key)) {
        setSelectedInputSelect(key);
      }

      if (
        ['min_order_value_per_month', 'max_order_value_per_month'].includes(key)
      ) {
        custMgmtFilter.setFieldsValue({ [key]: parseFloat(value) });
      }

      if (key === 'is_active') {
        value === 'True'
          ? custMgmtFilter.setFieldsValue({ status: 'active' })
          : custMgmtFilter.setFieldsValue({ status: 'suspended' });
      }
    });

    if (
      searchParams.has('last_order_dt_after') &&
      searchParams.has('last_order_dt_before')
    ) {
      custMgmtFilter.setFieldsValue({
        last_order_dt: [
          moment(searchParams.get('last_order_dt_after'), 'DD-MM-YYYY'),
          moment(searchParams.get('last_order_dt_before'), 'DD-MM-YYYY'),
        ],
      });
    }

    if (
      searchParams.has('joined_date_after') &&
      searchParams.has('joined_date_before')
    ) {
      custMgmtFilter.setFieldsValue({
        joined_date: [
          moment(searchParams.get('joined_date_after'), 'DD-MM-YYYY'),
          moment(searchParams.get('joined_date_before'), 'DD-MM-YYYY'),
        ],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (values) => {
    values = removeInvalidData(values);
    let { joined_date, last_order_dt, status, ...value } = values;
    if (status === 'active') {
      value.is_active = true;
    } else if (status === 'suspended') {
      value.is_active = false;
    }

    if (last_order_dt) {
      last_order_dt = {
        last_order_dt_after: getDt(last_order_dt[0]),
        last_order_dt_before: getDt(last_order_dt[1]),
      };
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
            limit: searchParams.get('limit'),
            type: searchParams.get('type'),
            ...value,
            ...joined_date,
            ...last_order_dt,
          }
        : {
            limit: searchParams.get('limit'),
            ...value,
            ...joined_date,
            ...last_order_dt,
          }
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
              selectedKeyValue={selectedInputSelect}
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
              formProps={{ name: 'order_value_per_month' }}
              label='Monthly Order Value'
              placeholder={['Start', 'End']}
              defaultValue={
                searchParams.has('min_order_value_per_month') &&
                searchParams.has('max_order_value_per_month') && [
                  parseFloat(searchParams.get('min_order_value_per_month')),
                  parseFloat(searchParams.get('max_order_value_per_month')),
                ]
              }
              prefix='RM'
              prefixWidth={60}
              min={0}
              precision={2}
              textSpan={7}
              onChange={(value) => {
                custMgmtFilter.setFieldsValue({ order_value_per_month: value });
              }}
            />
          </FilterInputCol>
          <FilterInputCol>
            <DateRangePickerWithLabel
              formProps={{ name: 'last_order_dt' }}
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
