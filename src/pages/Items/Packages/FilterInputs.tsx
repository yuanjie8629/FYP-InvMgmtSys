import FilterSubmitButton from '@components/Button/ActionButton/FilterSubmitButton';
import FilterInputCol, {
  FilterInputsProps,
} from '@components/Container/FilterInputCol';
import DateRangePickerWithLabel from '@components/Input/DateRangePickerWithLabel';
import InputNumberRange from '@components/Input/InputNumberRange';
import InputSelect from '@components/Input/InputSelect';
import { removeInvalidData } from '@utils/arrayUtils';
import { Form, Row, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const FilterInputs = (props: FilterInputsProps) => {
  const [packFilter] = useForm();
  const [searchParams, setSearchParams] = useSearchParams();

  const packInputSelect: {
    defaultVal: string;
    options: {
      value: string;
      label: string;
    }[];
  } = {
    defaultVal: 'name',
    options: [
      { value: 'name', label: 'Package Name' },
      { value: 'sku', label: 'Package SKU' },
    ],
  };

  const [selectedInputSelect, setSelectedInputSelect] = useState(
    packInputSelect.defaultVal
  );

  const handleSearch = (values) => {
    values = removeInvalidData(values);

    setSearchParams(
      searchParams.get('status') !== null
        ? {
            status: searchParams.get('status'),
            ...values,
          }
        : values
    );
  };

  const handleReset = () => {
    setSearchParams(
      searchParams.get('status') !== null
        ? {
            status: searchParams.get('status'),
          }
        : {}
    );
  };

  return (
    <Form
      name='packFilter'
      form={packFilter}
      onFinish={handleSearch}
      layout='inline'
    >
      <Space direction='vertical' size={20} className='full-width'>
        <Row gutter={[30, 10]}>
          <FilterInputCol>
            <InputSelect
              formProps={{ name: selectedInputSelect }}
              selectBefore={packInputSelect}
              placeholder='Input'
              selectWidth={150}
              onChange={(selected) => {
                packFilter.setFieldsValue({ [selected.type]: selected.value });
                setSelectedInputSelect(selected.type);
              }}
            />
          </FilterInputCol>
          <FilterInputCol>
            <InputNumberRange
              formProps={{ name: 'stock' }}
              label='Stock'
              placeholder={['Start', 'End']}
              min={0}
              textSpan={7}
              disabled={searchParams.get('status') === 'oos'}
              onChange={(value) => {
                packFilter.setFieldsValue({ stock: value });
              }}
            />
          </FilterInputCol>
          <FilterInputCol>
            <InputNumberRange
              formProps={{ name: 'price' }}
              label='Price'
              placeholder={['Start', 'End']}
              prefix='RM'
              prefixWidth={60}
              min={0}
              precision={2}
              justify='start'
              textSpan={3}
              onChange={(value) => {
                packFilter.setFieldsValue({ price: value });
              }}
            />
          </FilterInputCol>
          <FilterInputCol>
            <DateRangePickerWithLabel label='Available Period' textSpan={7} />
          </FilterInputCol>
        </Row>
        <FilterSubmitButton onReset={handleReset} />
      </Space>
    </Form>
  );
};

export default FilterInputs;
