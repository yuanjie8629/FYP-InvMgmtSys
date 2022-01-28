import ContainerCard from '@components/Card/ContainerCard';
import DropdownDate from '@components/Input/DropdownDate';
import Layout from '@components/Layout/Layout';
import { Row, Space } from 'antd';

import './BusinessInsights.less';

const Statistics = () => {
  const DateCard = (props) => (
    <ContainerCard contentStyle={{ padding: 0, textAlign: 'center' }}>
      {props.children}
    </ContainerCard>
  );

  return (
    <Layout>
      <div className='statistics'>
        <Space
          direction='vertical'
          size={20}
          className='container-card-wrapper'
        >
          <Row justify='center'>
            <DateCard>
              <DropdownDate />
            </DateCard>
          </Row>
          <Row></Row>
        </Space>
      </div>
    </Layout>
  );
};

export default Statistics;
