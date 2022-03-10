import { Col, Row, RowProps } from 'antd';
import Button from '..';

interface FilterSubmitButtonProps extends RowProps {
  onSubmit?: () => void;
  onReset?: () => void;
}

const FilterSubmitButton = ({
  onSubmit = () => null,
  onReset = () => null,
  ...props
}: FilterSubmitButtonProps) => {
  return (
    <Row gutter={20} {...props}>
      <Col>
        <Button type='primary' htmlType='submit' onClick={onSubmit}>
          Search
        </Button>
      </Col>
      <Col>
        <Button htmlType='reset' onClick={onReset}>
          Reset
        </Button>
      </Col>
    </Row>
  );
};

export default FilterSubmitButton;
