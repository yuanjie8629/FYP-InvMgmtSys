import { Row, Typography } from 'antd';
import ContainerCard from '@components/ContainerCard/ContainerCard';
import Layout from '@components/Layout/Layout';

const Dashboard = () => {
  const { Title } = Typography;
  return (
    <Layout>
      <Row justify='center'  className='container-card'>
        <ContainerCard>
          <Title level={5}>To Do List</Title>
        </ContainerCard>
      </Row>
      <Row justify='center' className='container-card'>
        <ContainerCard></ContainerCard>
      </Row>
    </Layout>
  );
};

export default Dashboard;
