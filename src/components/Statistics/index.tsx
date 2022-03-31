import { Avatar, Col, Row, Space, Typography } from 'antd';
import { IconType } from 'react-icons';

export interface StatisticsProps {
  value: number;
  title: string;
  date?: string;
  untilTm?: string;
  icon: IconType;
  color: string;
  prefix?: string;
  suffix?: string;
  toFixed?: number;
  space?: number;
  valueSize?: number;
  avatarSize?: number;
}

const Statistics = ({
  space = 40,
  avatarSize = 48,
  ...props
}: StatisticsProps) => {
  const { Text, Title } = Typography;

  return (
    <>
      <Row gutter={space} align='middle'>
        <Col>
          <Avatar
            icon={<props.icon size={avatarSize * 0.6} color={props?.color} />}
            size={avatarSize}
            className='center-flex'
            style={{ backgroundColor: `${props?.color}33` }} //background opacity = 20%
          />
        </Col>
        <Col flex='auto'>
          <Space direction='vertical' size={0}>
            <Title level={5} style={{ fontSize: props?.valueSize }}>
              {props?.prefix}
              {props?.value?.toFixed(props?.toFixed)}
              {props?.suffix}
            </Title>
            <Text type='secondary'>{props?.title}</Text>
            {props?.date !== undefined && (
              <Text type='secondary' style={{ fontSize: 10 }}>
                {props?.date}
              </Text>
            )}
          </Space>
        </Col>
      </Row>
      {props?.untilTm !== undefined && (
        <Row justify='end'>
          <Text type='secondary' style={{ fontSize: 10 }}>
            {props?.untilTm}
          </Text>
        </Row>
      )}
    </>
  );
};

export default Statistics;
