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

const SsFilterInputs = (props: FilterInputsProps) => {
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
          'max_lead_time_start',
          'max_lead_time_end',
          'avg_lead_time_start',
          'avg_lead_time_end',
          'max_demand_start',
          'max_demand_end',
          'avg_demand_start',
          'avg_demand_end',
          'safety_stock_start',
          'safety_stock_end',
          'reorder_point_start',
          'reorder_point_end',
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
              textSpan={6}
              onSelect={(value) => {
                eoqFilter.setFieldsValue({ category: value });
              }}
            />
          </FilterInputCol>
          <FilterInputCol>
            <InputNumberRange
              formProps={{ name: 'avg_demand' }}
              label='Average Demand'
              rangeNaming='startend'
              defaultValue={
                searchParams.has('avg_demand_start') &&
                searchParams.has('avg_demand_end') && [
                  parseFloat(searchParams.get('avg_demand_start')),
                  parseFloat(searchParams.get('avg_demand_end')),
                ]
              }
              placeholder={['Start', 'End']}
              maxLength={10}
              min={0}
              textSpan={7}
              justify='start'
              onChange={(value) => {
                eoqFilter.setFieldsValue({ avg_demand: value });
              }}
            />
          </FilterInputCol>
          <FilterInputCol>
            <InputNumberRange
              formProps={{ name: 'max_demand' }}
              label='Max Demand'
              rangeNaming='startend'
              defaultValue={
                searchParams.has('max_demand_start') &&
                searchParams.has('max_demand_end') && [
                  parseFloat(searchParams.get('max_demand_start')),
                  parseFloat(searchParams.get('max_demand_end')),
                ]
              }
              placeholder={['Start', 'End']}
              maxLength={10}
              min={0}
              textSpan={6}
              onChange={(value) => {
                eoqFilter.setFieldsValue({ max_demand: value });
              }}
            />
          </FilterInputCol>
          <FilterInputCol>
            <InputNumberRange
              formProps={{ name: 'avg_lead_tm' }}
              label='Average Lead Time'
              rangeNaming='startend'
              defaultValue={
                searchParams.has('avg_lead_tm_start') &&
                searchParams.has('avg_lead_tm_end') && [
                  parseFloat(searchParams.get('avg_lead_tm_start')),
                  parseFloat(searchParams.get('avg_lead_tm_end')),
                ]
              }
              placeholder={['Start', 'End']}
              maxLength={10}
              min={0}
              textSpan={7}
              justify='start'
              onChange={(value) => {
                eoqFilter.setFieldsValue({ avg_lead_tm: value });
              }}
            />
          </FilterInputCol>
          <FilterInputCol>
            <InputNumberRange
              formProps={{ name: 'max_lead_tm' }}
              label='Max Lead Time'
              rangeNaming='startend'
              defaultValue={
                searchParams.has('max_lead_tm_start') &&
                searchParams.has('max_lead_tm_end') && [
                  parseFloat(searchParams.get('max_lead_tm_start')),
                  parseFloat(searchParams.get('max_lead_tm_end')),
                ]
              }
              placeholder={['Start', 'End']}
              maxLength={10}
              min={0}
              textSpan={6}
              onChange={(value) => {
                eoqFilter.setFieldsValue({ max_lead_tm: value });
              }}
            />
          </FilterInputCol>
          <FilterInputCol>
            <InputNumberRange
              formProps={{ name: 'safety_stock' }}
              label='Safety Stock'
              rangeNaming='startend'
              defaultValue={
                searchParams.has('safety_stock_start') &&
                searchParams.has('safety_stock_end') && [
                  parseFloat(searchParams.get('safety_stock_start')),
                  parseFloat(searchParams.get('safety_stock_end')),
                ]
              }
              placeholder={['Start', 'End']}
              maxLength={10}
              min={0}
              textSpan={7}
              justify='start'
              onChange={(value) => {
                eoqFilter.setFieldsValue({ safety_stock: value });
              }}
            />
          </FilterInputCol>
          <FilterInputCol>
            <InputNumberRange
              formProps={{ name: 'reorder_point' }}
              label='Reorder Point'
              rangeNaming='startend'
              defaultValue={
                searchParams.has('reorder_point_start') &&
                searchParams.has('reorder_point_end') && [
                  parseFloat(searchParams.get('reorder_point_start')),
                  parseFloat(searchParams.get('reorder_point_end')),
                ]
              }
              placeholder={['Start', 'End']}
              maxLength={10}
              min={0}
              textSpan={6}
              onChange={(value) => {
                eoqFilter.setFieldsValue({ reorder_point: value });
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

export default SsFilterInputs;
