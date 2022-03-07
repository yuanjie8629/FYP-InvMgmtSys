import React, { memo } from 'react';
import { Avatar, Col, Row, Space, Typography } from 'antd';
import Button from '@components/Button';
import classNames from 'classnames';
import DescriptionList, {
  DescriptionListDataProps,
  TitleTextProps,
} from '@components/List/DescriptionList';

export interface ActionContentProps {
  label: string;
  Icon: (props: any) => JSX.Element;
  okText?: string;
  onOk?: () => void;
  onCancel?: () => void;
  color?: 'success' | 'warning' | 'error' | 'info' | 'grey';
  loading?: boolean;
  children?: React.ReactNode;
  recordType?: string;
  dataSource?: DescriptionListDataProps[];
  titleProps?: TitleTextProps;
  descProps?: TitleTextProps;
  multi?: boolean;
}

const Content = memo(
  (
    {
      label,
      Icon,
      okText = 'OK',
      onOk = () => '',
      onCancel = () => '',
      color,
      loading,
      children,
      dataSource,
      recordType,
      titleProps,
      descProps,
      multi,
      ...props
    }: ActionContentProps,
    ref
  ) => {
    const { Title } = Typography;

    return (
      <Space direction='vertical' size={20} className='full-width'>
        <Space size={15}>
          <Avatar
            size={40}
            icon={
              <Icon
                className={`color-${color === undefined ? 'primary' : color}`}
              />
            }
            className={classNames(
              'center-flex',
              { 'bg-red-200': color === 'error' },
              { 'bg-blue-200': color === 'info' },
              { 'bg-yellow-200': color === 'warning' },
              { 'bg-grey-200': color === 'grey' },
              {
                'bg-green-200': color === 'success' || color === undefined,
              }
            )}
          />
          <Title level={4}>{label}</Title>
        </Space>
        {children}
        {multi && (
          <DescriptionList
            dataSource={dataSource}
            bordered
            titleProps={{ style: { fontSize: 14 }, ...titleProps }}
            descProps={descProps}
          />
        )}
        <Row gutter={20} justify='end'>
          <Col>
            <Button color={color} disabled={loading} onClick={onCancel}>
              Cancel
            </Button>
          </Col>
          <Col>
            <Button
              type='primary'
              color={color}
              loading={loading}
              onClick={onOk}
            >
              {okText}
            </Button>
          </Col>
        </Row>
      </Space>
    );
  }
);

export default Content;
