import { Col, Radio, Row, Space, Typography } from 'antd';
import { CaretRightOutlined, RightOutlined } from '@ant-design/icons';
import ContainerCard from '@components/ContainerCard/ContainerCard';
import Layout from '@components/Layout/Layout';
import SmallCard from '@components/SmallCard/SmallCard';
import LineChart from '@components/Chart/LineChart';
import toDoList from './ToDoList';
import routeList from '@routes/RouteList';
import './Dashboard.less';
import { useHistory } from 'react-router';
import Button from '@components/Button/Button';

const Dashboard = () => {
  const { Text, Title } = Typography;
  const history = useHistory();
  const findRoutePath = (label: string) => {
    let route = routeList.find((route) => route.label === label);
    return route?.path === undefined ? '404' : route.path;
  };
  return (
    <Layout>
      <div className='dashboard'>
        <Row justify='center' className='container-card'>
          <ContainerCard>
            <Space direction='vertical'>
              <Title level={5}>To Do List</Title>
              <Row justify='start' gutter={[30, 20]}>
                {toDoList.map((toDoItem) => (
                  <Col
                    key={toDoItem.label}
                    onClick={() => history.push(findRoutePath(toDoItem.link))}
                  >
                    <SmallCard width={255} className='dashboard-toDoList-item'>
                      <Title level={5}>{toDoItem.quantity}</Title>
                      <Text className='dashboard-toDoList-text'>
                        {toDoItem.label}{' '}
                      </Text>
                      <CaretRightOutlined
                        className='dashboard-toDoList-text'
                        style={{ margin: 2 }}
                      />
                    </SmallCard>
                  </Col>
                ))}
              </Row>
            </Space>
          </ContainerCard>
        </Row>
        <Row justify='center' className='container-card'>
          <ContainerCard>
            <Row justify='space-between'>
              <Col>
                <Row>
                  <Title level={5}>Sales</Title>
                </Row>
              </Col>
              <Col>
                <Button type='link' color='info'>
                  More <RightOutlined style={{ margin: 4 }} />
                </Button>
              </Col>
            </Row>
            <Row justify='space-between'>
              <Col>
                <Text className='dashboard-toDoList-text'>2021</Text>
              </Col>
              <Col>
                <Radio.Group
                  buttonStyle='solid'
                  size='large'
                  style={{ marginRight: 30 }}
                  defaultValue='year'
                >
                  <Radio.Button value='year'>Year</Radio.Button>
                  <Radio.Button value='month'>Month</Radio.Button>
                  <Radio.Button value='week'>Week</Radio.Button>
                  <Radio.Button value='day'>Day</Radio.Button>
                </Radio.Group>
              </Col>
            </Row>
            <Row style={{ paddingTop: 30 }}>
              <Space direction='vertical' style={{ width: '100%' }} size={20}>
                <Text strong>RM</Text>
                <LineChart />
              </Space>
            </Row>
          </ContainerCard>
        </Row>
      </div>
    </Layout>
  );
};

export default Dashboard;
