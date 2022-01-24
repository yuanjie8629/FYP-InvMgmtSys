import ContainerCard from '@components/Card/ContainerCard';
import Layout from '@components/Layout/Layout';
import { DatePicker, Row, Space } from 'antd';

const Statistics = () => {
  return (
    <Layout>
      <div className='dashboard'>
        <Space
          direction='vertical'
          size={20}
          className='container-card-wrapper'
        >
          <Row justify='center'>
            <ContainerCard>
              <DatePicker bordered={false}/>
            </ContainerCard>
          </Row>
        </Space>
      </div>
    </Layout>
  );
};

export default Statistics;
