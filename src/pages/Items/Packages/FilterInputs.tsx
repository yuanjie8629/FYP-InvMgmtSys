import FilterSubmitButton from '@components/Button/ActionButton/FilterSubmitButton';
import FilterInputCol, {
  FilterInputsProps,
} from '@components/Container/FilterInputCol';
import DateRangePickerWithLabel from '@components/Input/DateRangePickerWithLabel';
import InputNumberRange from '@components/Input/InputNumberRange';
import InputSelect from '@components/Input/InputSelect';
import { removeInvalidData } from '@utils/arrayUtils';
import { getDt } from '@utils/dateUtils';
import { Form, Row, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import moment from 'moment';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    searchParams.forEach((value, key) => {
      packFilter.setFieldsValue({ [key]: value });
      if (packInputSelect.options.find((opt) => opt.value === key)) {
        setSelectedInputSelect(key);
      }

      if (['min_price', 'max_price', 'min_stock', 'max_stock'].includes(key)) {
        packFilter.setFieldsValue({ [key]: parseFloat(value) });
      }
    });
    if (
      searchParams.has('avail_start_dt') &&
      searchParams.has('avail_end_dt')
    ) {
      packFilter.setFieldsValue({
        avail: [
          moment(searchParams.get('avail_start_dt'), 'DD-MM-YYYY'),
          moment(searchParams.get('avail_end_dt'), 'DD-MM-YYYY'),
        ],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearch = (values) => {
    values = removeInvalidData(values);

    let { avail, ...value } = values;
    let availTm = {
      avail_start_dt: getDt(avail[0]),
      avail_end_dt: getDt(avail[1]),
    };

    setSearchParams(
      searchParams.get('status') !== null
        ? {
            limit: searchParams.get('limit'),
            status: searchParams.get('status'),
            ...value,
            ...availTm,
          }
        : { limit: searchParams.get('limit'), ...value, ...availTm }
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
              selectedKeyValue={selectedInputSelect}
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
              defaultValue={
                searchParams.has('min_stock') &&
                searchParams.has('max_stock') && [
                  parseFloat(searchParams.get('min_stock')),
                  parseFloat(searchParams.get('max_stock')),
                ]
              }
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
            <DateRangePickerWithLabel
              formProps={{ name: 'avail' }}
              label='Available Period'
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
