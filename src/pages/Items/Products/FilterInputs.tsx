import FilterSubmitButton from '@components/Button/ActionButton/FilterSubmitButton';
import FilterInputCol, {
  FilterInputsProps,
} from '@components/Container/FilterInputCol';
import InputNumberRange from '@components/Input/InputNumberRange';
import InputSelect from '@components/Input/InputSelect';
import SelectWithLabel from '@components/Input/SelectWithLabel';
import { removeInvalidData } from '@utils/arrayUtils';
import { prodCat } from '@utils/optionUtils';
import { removeSearchParams } from '@utils/urlUtls';
import { Form, Row, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    searchParams.forEach((value, key) => {
      prodFilter.setFieldsValue({ [key]: value });
      if (prodInputSelect.options.find((opt) => opt.value === key)) {
        setSelectedInputSelect(key);
      }

      if (['min_price', 'max_price', 'min_stock', 'max_stock'].includes(key)) {
        prodFilter.setFieldsValue({ [key]: parseFloat(value) });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearch = (values) => {
    values = removeInvalidData(values);
    setSearchParams(
      removeSearchParams(
        new URLSearchParams(
          searchParams.get('status') !== null
            ? {
                limit: searchParams.get('limit'),
                status: searchParams.get('status'),
                ...values,
              }
            : { limit: searchParams.get('limit'), ...values }
        ),
        'offset'
      )
    );
  };

  const handleReset = () => {
    setSearchParams(
      searchParams.get('status') !== null
        ? {
            limit: searchParams.get('limit'),
            status: searchParams.get('status'),
          }
        : { limit: searchParams.get('limit') }
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
              selectedKeyValue={selectedInputSelect}
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
          {searchParams.get('status') !== 'oos' && (
            <FilterInputCol>
              <InputNumberRange
                formProps={{ name: 'stock' }}
                label='Stock'
                defaultValue={
                  searchParams.has('min_stock') &&
                  searchParams.has('max_stock') && [
                    parseFloat(searchParams.get('min_stock')),
                    parseFloat(searchParams.get('max_stock')),
                  ]
                }
                placeholder={['Start', 'End']}
                min={0}
                maxLength={10}
                justify='start'
                textSpan={4}
                onChange={(value) => {
                  prodFilter.setFieldsValue({ stock: value });
                }}
              />
            </FilterInputCol>
          )}
          <FilterInputCol>
            <InputNumberRange
              formProps={{ name: 'price' }}
              label='Price'
              defaultValue={
                searchParams.has('min_price') &&
                searchParams.has('max_price') && [
                  parseFloat(searchParams.get('min_price')),
                  parseFloat(searchParams.get('max_price')),
                ]
              }
              placeholder={['Start', 'End']}
              prefix='RM'
              prefixWidth={60}
              justify={searchParams.get('status') === 'oos' ? 'start' : 'end'}
              min={0}
              maxLength={10}
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
