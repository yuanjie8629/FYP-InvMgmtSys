import ContainerCard from '@components/ContainerCard/ContainerCard';
import InputRange from '@components/Input/InputRange';
import InputSelect from '@components/Input/InputSelect';
import Button from '@components/Button/Button';
import Layout from '@components/Layout/Layout';
import { Row, Space, Select, Col } from 'antd';

const ProdMgmt = () => {
  const { Option } = Select;
  const tabList = [
    { key: 'all', tab: 'All' },
    { key: 'active', tab: 'Active' },
    { key: 'oos', tab: 'Out of Stock' },
    { key: 'hidden', tab: 'Hidden' },
  ];

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
    <Layout>
      <div className='prod-mgmt'>
        <Space
          direction='vertical'
          size={20}
          className='container-card-wrapper'
        >
          <Row justify='center'>
            <ContainerCard tabList={tabList}>
              <Space direction='vertical' size={20}>
                <Row gutter={[20, 20]}>
                  <Col lg={10} xl={8}>
                    <InputSelect
                      selectBefore={prodInputSelect}
                      placeholder='Input'
                    ></InputSelect>
                  </Col>
                  <Col lg={4} xl={3}>
                    <Select
                      placeholder={prodCatSelect.placeholder}
                      style={{ width: '100%' }}
                    >
                      {prodCatSelect.options.map((option) => (
                        <Option key={option.val} value={option.val}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col lg={7} xl={5}>
                    <InputRange
                      label='Stock'
                      placeholder={['Start', 'End']}
                      min={0}
                    />
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
            </ContainerCard>
          </Row>
        </Space>
      </div>
    </Layout>
  );
};

export default ProdMgmt;
