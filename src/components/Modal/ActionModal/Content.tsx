import React, { memo } from 'react';
import { Avatar, Col, List, ListProps, Row, Space, Typography } from 'antd';
import Button from '@components/Button';
import classNames from 'classnames';
import { DescriptionListDataProps } from '@components/List/DescriptionList';
import VirtualList from 'rc-virtual-list';
import { ListItemProps } from 'antd/lib/list';

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
  listProps?: Omit<ListProps<any>, 'dataSource'>;
  listItemProps?: ListItemProps;
  listContent?: (item: DescriptionListDataProps) => React.ReactNode;
  contentSpace?: boolean;
  data?: any;
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
      listProps,
      listItemProps,
      listContent,
      contentSpace = true,
      data,
      ...props
    }: ActionContentProps,
    ref
  ) => {
    const { Text, Title } = Typography;

    const RecordList = (
      <List bordered {...listProps}>
        <VirtualList
          data={dataSource}
          itemHeight={47}
          itemKey='key'
          style={{ maxHeight: 360, overflow: 'auto' }}
        >
          {(item) => (
            <List.Item {...listItemProps}>
              <Row className='full-width' align='middle'>
                <List.Item.Meta
                  avatar={item.icon}
                  title={<Text className='text-lg'>{item.title}</Text>}
                  description={<Text type='secondary'>{item.desc}</Text>}
                />
              </Row>
              {listContent && listContent(item)}
            </List.Item>
          )}
        </VirtualList>
      </List>
    );

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
        {contentSpace ? (
          <>
            {children}
            {RecordList}
          </>
        ) : (
          <div>
            {children}
            {RecordList}
          </div>
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
