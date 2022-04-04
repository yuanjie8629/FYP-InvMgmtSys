import DatePickerWithLabel from '@components/Input/DatePickerWithLabel';
import FilterInputCol, {
  FilterInputsProps,
} from '@components/Container/FilterInputCol';
import InputNumberRange from '@components/Input/InputNumberRange';
import InputSelect from '@components/Input/InputSelect';
import SelectWithLabel from '@components/Input/SelectWithLabel';
import { prodCat } from '@utils/optionUtils';
import { Form, Row, Space } from 'antd';
import moment from 'moment';
import { useForm } from 'antd/es/form/Form';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { removeInvalidData } from '@utils/arrayUtils';
import { FilterSubmitButton } from '@components/Button/ActionButton';
import { getMth } from '@utils/dateUtils';

const HmlFilterInputs = (props: FilterInputsProps) => {
  const [hmlFilter] = useForm();
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
      hmlFilter.setFieldsValue({ [key]: value });
      if (prodInputSelect.options.find((opt) => opt.value === key)) {
        setSelectedInputSelect(key);
      }

      if (key === 'month') {
        hmlFilter.setFieldsValue({ [key]: moment(value, 'YYYY-MM') });
      }

      if (
        [
          'min_stock',
          'max_stock',
          'min_cost_per_unit',
          'max_cost_per_unit',
        ].includes(key)
      ) {
        hmlFilter.setFieldsValue({ [key]: parseFloat(value) });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearch = (values) => {
    values = removeInvalidData(values);

    let { month, ...value } = values;
    month = getMth(month, undefined, 'YYYY-MM');
    console.log(month);

    setSearchParams(
      searchParams.get('type') !== null
        ? {
            type: searchParams.get('type'),
            ...value,
            month: month,
          }
        : { ...value, month: month }
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
      name='hmlFilter'
      form={hmlFilter}
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
                hmlFilter.setFieldsValue({ [selected.type]: selected.value });
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
                hmlFilter.setFieldsValue({ category: value });
              }}
              textSpan={7}
            />
          </FilterInputCol>
          <FilterInputCol>
            <InputNumberRange
              formProps={{ name: 'cost_per_unit' }}
              label='Cost per Unit'
              defaultValue={
                searchParams.has('min_cost_per_unit') &&
                searchParams.has('max_cost_per_unit') && [
                  parseFloat(searchParams.get('min_cost_per_unit')),
                  parseFloat(searchParams.get('max_cost_per_unit')),
                ]
              }
              placeholder={['Start', 'End']}
              prefix='RM'
              prefixWidth={60}
              min={0}
              maxLength={10}
              precision={2}
              textSpan={6}
              justify='start'
              onChange={(value) => {
                hmlFilter.setFieldsValue({ cost_per_unit: value });
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
              maxLength={10}
              min={0}
              textSpan={7}
              onChange={(value) => {
                hmlFilter.setFieldsValue({ stock: value });
              }}
            />
          </FilterInputCol>

          <FilterInputCol>
            <DatePickerWithLabel
              formProps={{
                name: 'month',
                initialValue:
                  searchParams.has('month') &&
                  moment(searchParams.get('month'), 'YYYY-MM'),
              }}
              label='Analysis Month'
              picker='month'
              disabledDate={(current) => current >= moment().startOf('month')}
              defaultValue={
                searchParams.has('month') &&
                moment(searchParams.get('month'), 'YYYY-MM')
              }
              defaultPickerValue={
                searchParams.has('month') &&
                moment(searchParams.get('month'), 'YYYY-MM')
              }
              allowClear={false}
              dropdownAlign={{ points: ['tc', 'bc'] }}
              justify='start'
              textSpan={6}
            />
          </FilterInputCol>
        </Row>
        <FilterSubmitButton onReset={handleReset} />
      </Space>
    </Form>
  );
};

export default HmlFilterInputs;
