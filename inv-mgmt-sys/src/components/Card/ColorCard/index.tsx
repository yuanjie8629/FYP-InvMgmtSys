import { Card, CardProps as AntdCardProps, Col, Row, Space } from 'antd';
import React from 'react';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import './ColorCard.less';

interface CardProps extends AntdCardProps {
  backgroundColor?:
    | 'default'
    | 'white'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'grey';
  children?: React.ReactNode;
  hover?: boolean | 'success' | 'warning' | 'error' | 'info' | 'grey';
  label?: React.ReactNode;
  indicator?: 'true' | 'false';
}

const ColorCard = ({
  backgroundColor = 'default',
  hover = false,
  className,
  ...props
}: CardProps) => {
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
      } ${className !== undefined ? className : ''}`}
    >
      <Space direction='vertical' size={20} className='full-width'>
        {props.label !== undefined || props.indicator !== undefined ? (
          <Row justify='space-between'>
            <Col span={22}>{props.label}</Col>
            <Col span={2} style={{ position: 'absolute', right: 20 }}>
              {props.indicator === 'true' ? (
                <HiCheckCircle size={20} className='color-primary' />
              ) : props.indicator === 'false' ? (
                <HiXCircle size={20} className='color-error' />
              ) : null}
            </Col>
          </Row>
        ) : null}
        {props.children}
      </Space>
    </Card>
  );
};

export default ColorCard;
