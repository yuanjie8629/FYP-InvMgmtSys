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
import { useState } from 'react';
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
    custRegInputSelect.defaultVal
  );

  const regStatus = {
    placeholder: 'Select registration Status',
    options: custRegStatusCat,
  };

  const handleSearch = (values) => {
    values = removeInvalidData(values);
    let { registration_date, status, ...value } = values;

    if (status === 'pending') {
      value.accept = 'None';
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
            type: searchParams.get('type'),
            ...value,
          }
        : { ...value, ...registration_date }
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
              placeholder='Input'
              selectWidth={150}
              onChange={(selected) => {
                custRegFilter.setFieldsValue({
                  [selected.type]: selected.value,
                });
                setSelectedInputSelect(selected.type);
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
