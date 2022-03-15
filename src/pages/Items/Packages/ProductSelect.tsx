import { Input, AutoComplete } from 'antd';
import { useEffect, useState } from 'react';
import Button from '@components/Button';

interface ProductListProps {
  products?: any[];
  onChange?: (data) => void;
}

const ProductList = ({ products, onChange = () => null }: ProductListProps) => {
  const [searchProd, setSearchProd] = useState('');
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setDataSource(products);
  }, [products]);

  const onDataSourceSelect = () => {
    if (Number.isInteger(searchProd)) onChange(searchProd);
  };

  return (
    <Input.Group compact>
      <AutoComplete
        placeholder='Product Name'
        options={dataSource?.map((prod) => {
          return { label: prod?.name, value: prod?.name, extra: prod?.id };
        })}
        filterOption
        notFoundContent='Not Found'
        style={{ width: '40%' }}
        onChange={(value, option) => {
          setSearchProd(option['extra']);
        }}
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
