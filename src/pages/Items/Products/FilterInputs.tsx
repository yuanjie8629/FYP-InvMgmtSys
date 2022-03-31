import FilterSubmitButton from '@components/Button/ActionButton/FilterSubmitButton';
import FilterInputCol, {
  FilterInputsProps,
} from '@components/Container/FilterInputCol';
import InputNumberRange from '@components/Input/InputNumberRange';
import InputSelect from '@components/Input/InputSelect';
import SelectWithLabel from '@components/Input/SelectWithLabel';
import { removeInvalidData } from '@utils/arrayUtils';
import { prodCat } from '@utils/optionUtils';
import { Form, Row, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const FilterInputs = (props: FilterInputsProps) => {
  const [prodFilter] = useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const prodInputSelect: {
    defaultVal: string;
    options: {
      value: string;
      label: string;
    }[];
  } = {
    defaultVal: 'name',
    options: [
      { value: 'name', label: 'Product Name' },
      { value: 'sku', label: 'Product SKU' },
    ],
  };

  const prodCatSelect = {
    placeholder: 'Select Category',
    options: prodCat,
  };

  const [selectedInputSelect, setSelectedInputSelect] = useState(
    prodInputSelect.defaultVal
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
      name='prodFilter'
      form={prodFilter}
      onFinish={handleSearch}
      layout='inline'
    >
      <Space direction='vertical' size={20} className='full-width'>
        <Row gutter={[30, 30]}>
          <FilterInputCol>
            <InputSelect
              formProps={{ name: selectedInputSelect }}
              selectBefore={prodInputSelect}
              placeholder='Input'
              selectWidth={150}
              onChange={(selected) => {
                prodFilter.setFieldsValue({ [selected.type]: selected.value });
                setSelectedInputSelect(selected.type);
              }}
            />
          </FilterInputCol>
          <FilterInputCol>
            <SelectWithLabel
              formProps={{ name: 'category' }}
              label='Category'
              select={prodCatSelect}
              onSelect={(value) => {
                prodFilter.setFieldsValue({ category: value });
              }}
            />
          </FilterInputCol>
          <FilterInputCol>
            <InputNumberRange
              formProps={{ name: 'stock' }}
              label='Stock'
              placeholder={['Start', 'End']}
              min={0}
              justify='start'
              textSpan={4}
              disabled={searchParams.get('status') === 'oos'}
              onChange={(value) => {
                prodFilter.setFieldsValue({ stock: value });
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
              onChange={(value) => {
                prodFilter.setFieldsValue({ price: value });
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
