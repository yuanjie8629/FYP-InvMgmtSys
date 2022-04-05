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

const EoqFilterInputs = (props: FilterInputsProps) => {
  const [eoqFilter] = useForm();
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
      eoqFilter.setFieldsValue({ [key]: value });
      if (prodInputSelect.options.find((opt) => opt.value === key)) {
        setSelectedInputSelect(key);
      }

      if (key === 'month') {
        eoqFilter.setFieldsValue({ [key]: moment(value, 'YYYY-MM') });
      }

      if (
        [
          'min_optimal_order_qty',
          'max_optimal_order_qty',
          'min_demand',
          'max_demand',
        ].includes(key)
      ) {
        eoqFilter.setFieldsValue({ [key]: parseFloat(value) });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearch = (values) => {
    values = removeInvalidData(values);

    let { month, ...value } = values;
    month = getMth(month, undefined, 'YYYY-MM');

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
      name='eoqFilter'
      form={eoqFilter}
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
                eoqFilter.setFieldsValue({ [selected.type]: selected.value });
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
                eoqFilter.setFieldsValue({ category: value });
              }}
              textSpan={7}
            />
          </FilterInputCol>
          <FilterInputCol>
            <InputNumberRange
              formProps={{ name: 'demand' }}
              label='Demand'
              defaultValue={
                searchParams.has('min_demand') &&
                searchParams.has('max_demand') && [
                  parseFloat(searchParams.get('min_demand')),
                  parseFloat(searchParams.get('max_demand')),
                ]
              }
              placeholder={['Start', 'End']}
              maxLength={10}
              min={0}
              textSpan={6}
              justify='start'
              onChange={(value) => {
                eoqFilter.setFieldsValue({ demand: value });
              }}
            />
          </FilterInputCol>
          <FilterInputCol>
            <InputNumberRange
              formProps={{ name: 'optimal_order_qty' }}
              label='Optimal Order Qty'
              defaultValue={
                searchParams.has('min_optimal_order_qty') &&
                searchParams.has('max_optimal_order_qty') && [
                  parseFloat(searchParams.get('min_optimal_order_qty')),
                  parseFloat(searchParams.get('max_optimal_order_qty')),
                ]
              }
              placeholder={['Start', 'End']}
              prefix='RM'
              prefixWidth={60}
              min={0}
              maxLength={10}
              precision={2}
              textSpan={7}
              onChange={(value) => {
                eoqFilter.setFieldsValue({ optimal_order_qty: value });
              }}
            />
          </FilterInputCol>
          <FilterInputCol>
            <InputNumberRange
              formProps={{ name: 'ordering_cost' }}
              label='Ordering Cost'
              defaultValue={
                searchParams.has('min_ordering_cost') &&
                searchParams.has('max_ordering_cost') && [
                  parseFloat(searchParams.get('min_ordering_cost')),
                  parseFloat(searchParams.get('max_ordering_cost')),
                ]
              }
              placeholder={['Start', 'End']}
              maxLength={10}
              min={0}
              textSpan={7}
              justify='start'
              onChange={(value) => {
                eoqFilter.setFieldsValue({ ordering_cost: value });
              }}
            />
          </FilterInputCol>
          <FilterInputCol>
            <InputNumberRange
              formProps={{ name: 'holding_cost' }}
              label='Holding Cost'
              defaultValue={
                searchParams.has('min_holding_cost') &&
                searchParams.has('max_holding_cost') && [
                  parseFloat(searchParams.get('min_holding_cost')),
                  parseFloat(searchParams.get('max_holding_cost')),
                ]
              }
              placeholder={['Start', 'End']}
              maxLength={10}
              min={0}
              textSpan={7}
              onChange={(value) => {
                eoqFilter.setFieldsValue({ holding_cost: value });
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

export default EoqFilterInputs;
