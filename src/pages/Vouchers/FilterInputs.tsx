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
import { useSearchParams } from 'react-router-dom';

const FilterInputs = () => {
  const [voucherFilter] = useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const orderInputSelect: {
    defaultVal: string;
    options: {
      value: string;
      label: string;
    }[];
  } = {
    defaultVal: 'voucherCde',
    options: [{ value: 'voucherCde', label: 'Voucher Code' }],
  };

  const custCatSelect = {
    placeholder: 'Select Customer Type',
    options: custCat,
  };

  const handleSearch = (values) => {
    values = removeInvalidData(values);
    let { avail_tm, ...value } = values;

    let availTm = {
      avail_start_dt: getDt(avail_tm[0]),
      avail_end_dt: getDt(avail_tm[1]),
    };

    setSearchParams(
      searchParams.get('status') !== null
        ? {
            status: searchParams.get('status'),
            ...value,
            ...availTm,
          }
        : { ...value, ...availTm }
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
              selectBefore={orderInputSelect}
              placeholder='Input'
              selectWidth={150}
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
              formProps={{ name: 'avail_tm' }}
              label='Available Date'
              justify='start'
              textSpan={6}
            />
          </FilterInputCol>
          <FilterInputCol>
            <InputNumberRange
              formProps={{ name: 'avail' }}
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
