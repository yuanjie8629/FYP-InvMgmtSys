import ContainerCard from '@components/Card/ContainerCard';
import Layout from '@components/Layout/Layout';
import { DatePicker, Row, Space } from 'antd';
import moment from 'moment';
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
              <DatePicker
                allowClear={false}
                bordered={false}
                size='large'
                defaultValue={moment('2022-01-21')}
              />
            </DateCard>
          </Row>
          <Row></Row>
        </Space>
      </div>
    </Layout>
  );
};

export default Statistics;
