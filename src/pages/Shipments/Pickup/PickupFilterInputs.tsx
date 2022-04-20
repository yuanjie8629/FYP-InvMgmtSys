import FilterSubmitButton from '@components/Button/ActionButton/FilterSubmitButton';
import FilterInputCol from '@components/Container/FilterInputCol';
import InputSelect from '@components/Input/InputSelect';
import { removeInvalidData } from '@utils/arrayUtils';
import { Form, Row, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const FilterInputs = () => {
  const [pickupLocFilter] = useForm();
  const [searchParams, setSearchParams] = useSearchParams();

  const pickupLocInputSelect: {
    defaultVal: string;
    options: {
      value: string;
      label: string;
    }[];
  } = {
    defaultVal: 'location',
    options: [{ value: 'location', label: 'Location' }],
  };

  const [selectedInputSelect, setSelectedInputSelect] = useState(
    pickupLocInputSelect.defaultVal
  );

  useEffect(() => {
    searchParams.forEach((value, key) => {
      pickupLocFilter.setFieldsValue({ [key]: value });
      if (pickupLocInputSelect.options.find((opt) => opt.value === key)) {
        setSelectedInputSelect(key);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearch = (values) => {
    values = removeInvalidData(values);

    setSearchParams(
      searchParams.get('type') !== null
        ? {
            limit: searchParams.get('limit'),
            type: searchParams.get('type'),
            ...values,
          }
        : { limit: searchParams.get('limit'), ...values }
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
      name='pickupLocFilter'
      form={pickupLocFilter}
      onFinish={handleSearch}
      layout='inline'
    >
      <Space direction='vertical' size={30} className='full-width'>
        <Row gutter={[30, 30]}>
          <FilterInputCol>
            <InputSelect
              formProps={{ name: selectedInputSelect }}
              selectBefore={pickupLocInputSelect}
              placeholder='Input'
              selectedKeyValue={selectedInputSelect}
              selectWidth={150}
              onChange={(selected) => {
                pickupLocFilter.setFieldsValue({
                  [selected.type]: selected.value,
                });
                setSelectedInputSelect(selected.type);
              }}
            ></InputSelect>
          </FilterInputCol>
        </Row>
        <FilterSubmitButton onReset={handleReset} />
      </Space>
    </Form>
  );
};

export default FilterInputs;
