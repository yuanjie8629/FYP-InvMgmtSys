import InputRange from '@components/Input/InputRange';
import InputSelect from '@components/Input/InputSelect';
import { Button, Col, Row, Select, Space } from 'antd';

const FilterInputs = () => {
  const { Option } = Select;
  const prodInputSelect: {
    defaultVal: string;
    options: {
      val: string;
      label: string;
    }[];
  } = {
    defaultVal: 'prodName',
    options: [
      { val: 'prodName', label: 'Product Name' },
      { val: 'prodSKU', label: 'Product SKU' },
    ],
  };

  const prodCatSelect = {
    placeholder: 'Category',
    options: [
      { val: 'rte', label: 'Ready-To-Eat' },
      { val: 'rtc', label: 'Ready-To-Cook' },
      { val: 'paste', label: 'Paste' },
    ],
  };
  return (
    <Space direction='vertical' size={20} className='width-full'>
      <Row gutter={[30, 30]}>
        <Col lg={10} xl={8}>
          <InputSelect
            selectBefore={prodInputSelect}
            placeholder='Input'></InputSelect>
        </Col>
        <Col lg={4} xl={3}>
          <Select
            placeholder={prodCatSelect.placeholder}
            style={{ width: '100%' }}>
            {prodCatSelect.options.map((option) => (
              <Option key={option.val} value={option.val}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Col>
        <Col lg={7} xl={5}>
          <InputRange label='Stock' placeholder={['Start', 'End']} min={0} />
        </Col>
        <Col lg={12} xl={7}>
          <InputRange
            label='Price'
            placeholder={['Start', 'End']}
            addonBefore='RM'
            min={0}
            precision={2}
          />
        </Col>
      </Row>
      <Row gutter={20}>
        <Col>
          <Button type='primary'>Search</Button>
        </Col>
        <Col>
          <Button>Reset</Button>
        </Col>
      </Row>
    </Space>
  );
};

export default FilterInputs;
