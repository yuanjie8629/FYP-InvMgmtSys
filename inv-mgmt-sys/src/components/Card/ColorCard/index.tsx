import { Card, CardProps, Col, Row, Space } from 'antd';
import React from 'react';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import './ColorCard.less';

export interface ColorCardProps extends CardProps {
  backgroundColor?:
    | 'default'
    | 'white'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'grey';
  hover?: boolean | 'success' | 'warning' | 'error' | 'info' | 'grey';
  label?: React.ReactNode;
  indicator?: 'true' | 'false';
}

const ColorCard = ({
  backgroundColor = 'default',
  hover = false,
  label,
  indicator,
  className,
  ...props
}: ColorCardProps) => {
  return (
    <Card
      bordered={false}
      {...props}
      className={`small-card${
        backgroundColor !== undefined ? `-${backgroundColor} ` : ''
      }${
        hover === true
          ? `small-card-${backgroundColor}-hover`
          : hover !== false
          ? ` small-card-${hover}-hover`
          : ''
      } full-height ${className !== undefined ? ` ${className}` : ''}`}
    >
      <Space direction='vertical' size={20} className='full-width'>
        {label !== undefined || indicator !== undefined ? (
          <Row justify='space-between'>
            <Col span={22}>{label}</Col>
            <Col
              span={2}
              style={{ position: 'absolute', right: 20 }}
              className='centerFlex'
            >
              {indicator === 'true' ? (
                <HiCheckCircle size={20} className='color-primary' />
              ) : indicator === 'false' ? (
                <HiXCircle size={20} className='color-error' />
              ) : null}
            </Col>
          </Row>
        ) : null}
        <div>{props.children}</div>
      </Space>
    </Card>
  );
};

export default ColorCard;
