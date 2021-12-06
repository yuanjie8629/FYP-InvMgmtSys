import InputRange from '@components/Input/InputRange';
import InputSelect from '@components/Input/InputSelect';
import { Button, Col, Row, Space, DatePicker, Typography } from 'antd';

const FilterInputs = () => {
  const { RangePicker } = DatePicker;
  const { Text } = Typography;
  const packInputSelect: {
    defaultVal: string;
    options: {
      val: string;
      label: string;
    }[];
  } = {
    defaultVal: 'packName',
    options: [
      { val: 'packName', label: 'Package Name' },
      { val: 'packSKU', label: 'Package SKU' },
    ],
  };

  return (
    <Space direction='vertical' size={20} className='width-full'>
      <Row gutter={[30, 30]}>
        <Col lg={10} xl={8}>
          <InputSelect
            selectBefore={packInputSelect}
            placeholder='Input'
          ></InputSelect>
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
        <Col>
          <Space size={10}>
          <Text className='color-grey'>Available Period</Text>
          <RangePicker /></Space>
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
