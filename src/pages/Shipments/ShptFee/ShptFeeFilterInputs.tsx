import FilterSubmitButton from '@components/Button/ActionButton/FilterSubmitButton';
import FilterInputCol from '@components/Container/FilterInputCol';
import InputNumberRange from '@components/Input/InputNumberRange';
import InputSelect from '@components/Input/InputSelect';
import { removeInvalidData } from '@utils/arrayUtils';
import { Form, Row, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const FilterInputs = () => {
  const [shptFeeFilter] = useForm();
  const [searchParams, setSearchParams] = useSearchParams();

  const shptFeeInputSelect: {
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
    shptFeeInputSelect.defaultVal
  );

  const handleSearch = (values) => {
    values = removeInvalidData(values);

    setSearchParams(
      searchParams.get('type') !== null
        ? {
            type: searchParams.get('type'),
            ...values,
          }
        : values
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
      name='shptFeeFilter'
      form={shptFeeFilter}
      onFinish={handleSearch}
      layout='inline'
    >
      <Space direction='vertical' size={30} className='full-width'>
        <Row gutter={[30, 30]}>
          <FilterInputCol>
            <InputSelect
              formProps={{ name: selectedInputSelect }}
              selectBefore={shptFeeInputSelect}
              placeholder='Input'
              selectWidth={150}
              onChange={(selected) => {
                shptFeeFilter.setFieldsValue({
                  [selected.type]: selected.value,
                });
                setSelectedInputSelect(selected.type);
              }}
            ></InputSelect>
          </FilterInputCol>

          <FilterInputCol>
            <InputNumberRange
              formProps={{ name: 'ship_fee' }}
              label='Shipping Fee'
              placeholder={['Start', 'End']}
              prefix='RM'
              prefixWidth={60}
              min={0}
              precision={2}
              textSpan={5}
              onChange={(value) => {
                shptFeeFilter.setFieldsValue({ sales_per_month: value });
              }}
            />
          </FilterInputCol>
          <FilterInputCol>
            <InputNumberRange
              formProps={{ name: 'weight' }}
              label='Weight'
              placeholder={['Start', 'End']}
              suffix='g'
              suffixWidth={60}
              min={0}
              textSpan={3}
              onChange={(value) => {
                shptFeeFilter.setFieldsValue({ sales_per_month: value });
              }}
            />
          </FilterInputCol>
        </Row>
        <FilterSubmitButton onReset={handleReset} />
      </Space>
    </Form>
  );
};

export default FilterInputs;