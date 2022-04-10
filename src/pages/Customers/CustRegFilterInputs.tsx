import FilterSubmitButton from '@components/Button/ActionButton/FilterSubmitButton';
import FilterInputCol from '@components/Container/FilterInputCol';
import DateRangePickerWithLabel from '@components/Input/DateRangePickerWithLabel';
import InputSelect from '@components/Input/InputSelect';
import SelectWithLabel from '@components/Input/SelectWithLabel';
import { removeInvalidData } from '@utils/arrayUtils';
import { getDt } from '@utils/dateUtils';
import { custRegStatusCat } from '@utils/optionUtils';
import { Form, Row, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const CustRegFilterInputs = () => {
  const [custRegFilter] = useForm();
  const [searchParams, setSearchParams] = useSearchParams();

  const custRegInputSelect: {
    defaultVal: string;
    options: {
      value: string;
      label: string;
    }[];
  } = {
    defaultVal: 'id',
    options: [
      { value: 'id', label: 'Registration ID' },
      { value: 'name', label: 'Applicant Name' },
      { value: 'email', label: 'Applicant Email' },
      { value: 'phone_num', label: 'Contact Number' },
    ],
  };

  const [selectedInputSelect, setSelectedInputSelect] = useState(
    custRegInputSelect?.defaultVal
  );

  const regStatus = {
    placeholder: 'Select registration Status',
    options: custRegStatusCat,
  };

  useEffect(() => {
    searchParams.forEach((value, key) => {
      if (custRegInputSelect.options.find((opt) => opt.value === key)) {
        setSelectedInputSelect(key);
      }
      if (
        ![
          'registration_date_after',
          'registration_date_before',
          'last_order_date',
        ].includes(key)
      ) {
        custRegFilter.setFieldsValue({ [key]: value });
      }

      if (key === 'accept') {
        value === 'true'
          ? custRegFilter.setFieldsValue({ status: 'accept' })
          : custRegFilter.setFieldsValue({ status: 'reject' });
      }

      if (key === 'pending') {
        if (value === 'true') {
          custRegFilter.setFieldsValue({ status: 'pending' });
        }
      }
    });

    if (
      searchParams.has('registration_date_after') &&
      searchParams.has('registration_date_before')
    ) {
      custRegFilter.setFieldsValue({
        registration_date: [
          moment(searchParams.get('registration_date_after'), 'DD-MM-YYYY'),
          moment(searchParams.get('registration_date_before'), 'DD-MM-YYYY'),
        ],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearch = (values) => {
    values = removeInvalidData(values);
    let { registration_date, status, ...value } = values;

    if (status === 'pending') {
      value.pending = true;
    } else if (status === 'accept') {
      value.accept = true;
    } else if (status === 'reject') {
      value.accept = false;
    }

    if (registration_date) {
      registration_date = {
        registration_date_after: getDt(registration_date[0]),
        registration_date_before: getDt(registration_date[1]),
      };
    }

    setSearchParams(
      searchParams.get('type') !== null
        ? {
            limit: searchParams.get('limit'),
            type: searchParams.get('type'),
            ...value,
          }
        : { limit: searchParams.get('limit'), ...value, ...registration_date }
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
      name='custRegFilter'
      form={custRegFilter}
      onFinish={handleSearch}
      layout='inline'
    >
      <Space direction='vertical' size={30} className='full-width'>
        <Row gutter={[30, 30]}>
          <FilterInputCol>
            <InputSelect
              formProps={{ name: selectedInputSelect }}
              selectBefore={custRegInputSelect}
              selectedKeyValue={selectedInputSelect}
              placeholder='Input'
              selectWidth={150}
              onChange={(selected) => {
                setSelectedInputSelect(selected.type);
                custRegFilter.setFieldsValue({
                  [selected.type]: selected.value,
                });
              }}
            />
          </FilterInputCol>
          <FilterInputCol>
            <SelectWithLabel
              formProps={{ name: 'status' }}
              label='Registration Status'
              select={regStatus}
              textSpan={7}
              onSelect={(value) => {
                custRegFilter.setFieldsValue({ status: value });
              }}
            />
          </FilterInputCol>

          <FilterInputCol>
            <DateRangePickerWithLabel
              formProps={{ name: 'registration_date' }}
              label='Registration Date'
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

export default CustRegFilterInputs;
