import { Input, AutoComplete, AutoCompleteProps } from 'antd';
import { useState } from 'react';
import Button from '@components/Button';
import { groupBy } from '@utils/arrayUtils';

interface ProductListProps extends AutoCompleteProps {
  products?: any[];
  onSelect?: (data) => void;
}

const ProductList = ({
  products,
  onSelect = () => null,
  ...props
}: ProductListProps) => {
  const [searchProd, setSearchProd] = useState('');
  const [value, setValue] = useState('');

  const onDataSourceSelect = () => {
    if (Number.isInteger(searchProd)) {
      onSelect(searchProd);
      setSearchProd('');
      setValue('');
    }
  };

  const getProdByCat = () =>
    Object.entries(groupBy(products, 'category')).map(([label, products]) => {
      let prods: any = products;
      let options = prods?.map((prod) => {
        return { label: prod?.name, value: prod?.name, extra: prod?.id };
      });
      return { label, options };
    });

  return (
    <Input.Group compact>
      <AutoComplete
        placeholder='Product Name'
        options={getProdByCat()}
        filterOption={(inputValue, option) => {
          if (value !== '')
            return option.value
              ?.toString()
              .toLowerCase()
              .includes(inputValue.toLowerCase());
          else return true;
        }}
        notFoundContent='Not Found'
        style={{ width: '40%' }}
        onChange={(value, option) => {
          setSearchProd(option['extra']);
          setValue(value);
        }}
        value={value}
        {...props}
      />
      <Button
        type='primary'
        style={{ padding: '0 15px' }}
        onClick={onDataSourceSelect}
      >
        Add
      </Button>
    </Input.Group>
  );
};

export default ProductList;
