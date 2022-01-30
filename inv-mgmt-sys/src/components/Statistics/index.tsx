import { Avatar, Col, Row, Typography } from 'antd';
import { IconType } from 'react-icons';

interface StatisticsProps {
  value: number;
  title: string;
  date?: string;
  icon: IconType;
  color: string;
  prefix?: string;
  suffix?: string;
  toFixed?: number;
  space?: number;
  valueSize?: number;
}

const Statistics = ({ space = 40, ...props }: StatisticsProps) => {
  const { Text, Title } = Typography;

  return (
    <Row gutter={space} justify='start' align='middle'>
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
          <Title
            level={5}
            style={{ fontWeight: 600, fontSize: props.valueSize }}
          >
            {props.prefix}
            {props.value.toFixed(props.toFixed)}
            {props.suffix}
          </Title>
        </Row>
        <Row>
          <Text type='secondary'>{props.title}</Text>
        </Row>
        {props.date !== undefined ? (
          <Row>
            <Text type='secondary' className='text-sm'>
              {props.date}
            </Text>
          </Row>
        ) : null}
      </Col>
    </Row>
  );
};

export default Statistics;
