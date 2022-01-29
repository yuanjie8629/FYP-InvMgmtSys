import { Avatar, Col, Row, Typography } from 'antd';
import { IconType } from 'react-icons';

interface StatisticsProps {
  value: number;
  title: string;
  icon: IconType;
  color: string;
  prefix?: string;
  suffix?: string;
  toFixed?: number;
}

const Statistics = (props: StatisticsProps) => {
  const { Text, Title } = Typography;

  return (
    <Row gutter={40} justify='start' align='middle'>
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

export default Statistics;
