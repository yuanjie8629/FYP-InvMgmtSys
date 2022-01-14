import { Col, ColProps } from 'antd';

interface FilterInputColProps extends ColProps {
  children: React.ReactNode;
}

const FilterInputCol = (props: FilterInputColProps) => (
  <Col span={12} {...props}>
    {props.children}
  </Col>
);

export default FilterInputCol;
