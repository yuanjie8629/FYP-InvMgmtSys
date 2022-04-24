import FilterSubmitButton from '@components/Button/ActionButton/FilterSubmitButton';
import FilterInputCol from '@components/Container/FilterInputCol';
import DateRangePickerWithLabel from '@components/Input/DateRangePickerWithLabel';
import InputNumberRange from '@components/Input/InputNumberRange';
import InputSelect from '@components/Input/InputSelect';
import SelectWithLabel from '@components/Input/SelectWithLabel';
import { removeInvalidData } from '@utils/arrayUtils';
import { getDt } from '@utils/dateUtils';
import { custCat } from '@utils/optionUtils';
import { Form, Row, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const FilterInputs = () => {
  const [voucherFilter] = useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const voucherInputSelect: {
    defaultVal: string;
    options: {
      value: string;
      label: string;
    }[];
  } = {
    defaultVal: 'voucherCde',
    options: [{ value: 'voucherCde', label: 'Voucher Code' }],
  };

  const [selectedInputSelect, setSelectedInputSelect] = useState(
    voucherInputSelect.defaultVal
  );

  const custCatSelect = {
    placeholder: 'Select Customer Type',
    options: custCat,
  };

  useEffect(() => {
    searchParams.forEach((value, key) => {
      voucherFilter.setFieldsValue({ [key]: value });

      if (['min_avail', 'max_avail'].includes(key)) {
        voucherFilter.setFieldsValue({ [key]: parseFloat(value) });
      }
    });

    if (
      searchParams.has('avail_start_dt') &&
      searchParams.has('avail_end_dt')
    ) {
      voucherFilter.setFieldsValue({
        avail_dt: [
          moment(searchParams.get('avail_start_dt'), 'DD-MM-YYYY'),
          moment(searchParams.get('avail_end_dt'), 'DD-MM-YYYY'),
        ],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearch = (values) => {
    console.log(values);
    values = removeInvalidData(values);
    let { avail_dt, ...value } = values;

    let availTm = undefined;
    if (avail_dt) {
      availTm = {
        avail_start_dt: getDt(avail_dt[0]),
        avail_end_dt: getDt(avail_dt[1]),
      };
    }

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
      name='voucherFilter'
      form={voucherFilter}
      onFinish={handleSearch}
      layout='inline'
    >
      <Space direction='vertical' size={20} className='full-width'>
        <Row gutter={[30, 30]}>
          <FilterInputCol>
            <InputSelect
              formProps={{ name: 'code' }}
              selectBefore={voucherInputSelect}
              selectedKeyValue={selectedInputSelect}
              placeholder='Input'
              selectWidth={150}
              onChange={(selected) => {
                voucherFilter.setFieldsValue({
                  [selected.type]: selected.value,
                });
                setSelectedInputSelect(selected.type);
              }}
            ></InputSelect>
          </FilterInputCol>
          <FilterInputCol>
            <SelectWithLabel
              formProps={{ name: 'type' }}
              label='Customer Type'
              select={custCatSelect}
              textSpan={7}
            />
          </FilterInputCol>

          <FilterInputCol>
            <DateRangePickerWithLabel
              formProps={{ name: 'avail_dt' }}
              label='Available Date'
              justify='start'
              textSpan={6}
            />
          </FilterInputCol>
          <FilterInputCol>
            <InputNumberRange
              formProps={{ name: 'avail' }}
              defaultValue={
                searchParams.has('min_avail') &&
                searchParams.has('max_avail') && [
                  Number(searchParams.get('min_avail')),
                  Number(searchParams.get('max_avail')),
                ]
              }
              label='Availability'
              placeholder={['Start', 'End']}
              min={0}
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
