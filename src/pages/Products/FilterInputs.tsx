import FilterInputCol from '@components/Container/FilterInputCol';
import InputNumberRange from '@components/Input/InputNumberRange';
import InputSelect from '@components/Input/InputSelect';
import SelectWithLabel from '@components/Input/SelectWithLabel';
import { prodCat } from '@utils/optionUtils';
import { Button, Col, Row, Space } from 'antd';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface FilterInputsProps {
  loading?: boolean;
}

const FilterInputs = (props: FilterInputsProps) => {
  const [filter, setFilter] = useState({});
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

  return (
    <Space direction='vertical' size={20} className='full-width'>
      <Row gutter={[30, 30]}>
        <FilterInputCol>
          <InputSelect
            selectBefore={prodInputSelect}
            placeholder='Input'
            selectWidth={150}
            onSelectCat={(selected) => {
              selected.value !== ''
                ? setFilter({ ...filter, [selected.type]: selected.value })
                : setFilter(() => {
                    delete filter[selected.type];
                    return filter;
                  });
            }}
          ></InputSelect>
        </FilterInputCol>
        <FilterInputCol>
          <SelectWithLabel
            label='Category'
            select={prodCatSelect}
            onSelect={(value) =>
              value !== null
                ? setFilter({ ...filter, category: value })
                : setFilter(() => {
                    delete filter['category'];
                    return filter;
                  })
            }
          />
        </FilterInputCol>
        <FilterInputCol>
          <InputNumberRange
            label='Stock'
            placeholder={['Start', 'End']}
            min={0}
            justify='start'
            textSpan={4}
            disabled={searchParams.get('status') === 'oos'}
            onStartRange={(value) =>
              value !== null
                ? setFilter({ ...filter, min_stock: value })
                : setFilter(() => {
                    delete filter['min_stock'];
                    return filter;
                  })
            }
            onEndRange={(value) =>
              value !== null
                ? setFilter({ ...filter, max_stock: value })
                : setFilter(() => {
                    delete filter['max_stock'];
                    return filter;
                  })
            }
          />
        </FilterInputCol>
        <FilterInputCol>
          <InputNumberRange
            label='Price'
            placeholder={['Start', 'End']}
            prefix='RM'
            prefixWidth={60}
            min={0}
            precision={2}
            onStartRange={(value) =>
              value !== null
                ? setFilter({ ...filter, min_price: value })
                : setFilter(() => {
                    delete filter['min_price'];
                    return filter;
                  })
            }
            onEndRange={(value) =>
              value !== null
                ? setFilter({ ...filter, max_price: value })
                : setFilter(() => {
                    delete filter['max_price'];
                    return filter;
                  })
            }
          />
        </FilterInputCol>
      </Row>
      <Row gutter={20}>
        <Col>
          <Button
            type='primary'
            onClick={() =>
              setSearchParams(
                searchParams.get('status') !== null
                  ? {
                      status: searchParams.get('status'),
                      limit: searchParams.get('limit'),
                      offset: searchParams.get('offset'),
                      ...filter,
                    }
                  : filter
              )
            }
          >
            Search
          </Button>
        </Col>
        <Col>
          <Button
            onClick={() =>
              setSearchParams({
                status: searchParams.get('status'),
                limit: searchParams.get('limit'),
                offset: searchParams.get('offset'),
              })
            }
          >
            Reset
          </Button>
        </Col>
      </Row>
    </Space>
  );
};

export default FilterInputs;
