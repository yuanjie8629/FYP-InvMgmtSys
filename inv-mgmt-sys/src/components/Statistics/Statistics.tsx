import { Avatar, Col, Row, Typography, Grid } from 'antd';
import { IconType } from 'react-icons';

interface StatisticsDashboardProps {
  value: number;
  title: string;
  icon: IconType;
  color: string;
  prefix?: string;
  suffix?: string;
  toFixed?: number;
}

const StatisticsDashboard = (props: StatisticsDashboardProps) => {
  const { Text, Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  return (
    <Row gutter={screens.xl ? 40 : 20} justify='start' align='middle'>
      <Col>
        <Avatar
          icon={<props.icon size={28} color={props.color} />}
          size={48}
          className='centerFlex'
          style={{ backgroundColor: `${props.color}33` }} //background opacity = 20%
        />
      </Col>
      <Col>
        <Row>
          <Title level={5} style={{ fontWeight: 600 }}>
            {props.prefix}
            {props.value.toFixed(props.toFixed)}
            {props.suffix}
          </Title>
        </Row>
        <Row>
          <Text type='secondary'>{props.title}</Text>
        </Row>
      </Col>
    </Row>
  );
};

export default StatisticsDashboard;
