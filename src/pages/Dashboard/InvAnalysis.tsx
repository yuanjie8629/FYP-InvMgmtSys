import { invAnalysisAPI } from '@api/services/analysisAPI';
import MoreButton from '@components/Button/ActionButton/MoreButton';
import MainCard from '@components/Card/MainCard';
import Popover from '@components/Popover';
import { BoldTitle } from '@components/Title';
import { MessageContext } from '@contexts/MessageContext';
import { getPrevMth } from '@utils/dateUtils';
import { serverErrMsg } from '@utils/messageUtils';
import { Col, Row, Skeleton, Space, Table, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { HiExclamation } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const InvAnalysis = () => {
  const { Text } = Typography;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi] = useContext(MessageContext);

  useEffect(
    () => {
      let isMounted = true;
      setLoading(true);
      invAnalysisAPI('ss', `?limit=5&month=${getPrevMth()}`)
        .then((res) => {
          if (isMounted) {
            setData(res.data?.results);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (err.response?.status !== 401) {
            setLoading(false);
            showServerErrMsg();
          }
        });
      return () => {
        isMounted = false;
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const ssColumns: {
    title: string;
    dataIndex?: string | string[];
    key: string;
    sorter?: boolean;
    align?: 'left' | 'center' | 'right';
    width?: number | string;
    fixed?: 'left' | 'right';
    render?: any;
  }[] = [
    {
      title: 'Product',
      dataIndex: ['id', 'name', 'category', 'thumbnail'],
      key: 'name',
      render: (_: any, data: { [x: string]: string }) => (
        <Space direction='vertical' size={5}>
          <div className='text-button-wrapper'>
            <Text
              strong
              className='text-button'
              onClick={() => {
                navigate(`/product/${data['id']}`);
              }}
            >
              {data.name}
            </Text>
          </div>
          <Text type='secondary' className='text-sm text-break'>
            {data.category}
          </Text>
        </Space>
      ),
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      render: (data: string) => <Text type='secondary'>{data}</Text>,
    },
    {
      title: 'Safety Stock',
      dataIndex: 'safety_stock',
      key: 'safety_stock',
      render: (amount: number) =>
        amount !== undefined && amount !== null ? (
          <Text type='secondary'>{amount}</Text>
        ) : (
          <Popover content='Please fill up the maximum and average amount for the demand and lead time.'>
            <Space size={5}>
              <HiExclamation size={20} className='color-error' />
              <Text strong className='color-error'>
                Insufficient Info
              </Text>
            </Space>
          </Popover>
        ),
    },
    {
      title: 'Reorder Point',
      dataIndex: 'reorder_point',
      key: 'reorder_point',
      render: (amount: number) =>
        amount !== undefined && amount !== null ? (
          <Text type='secondary'>{amount}</Text>
        ) : (
          <Popover content='Please fill up the maximum and average amount for the demand and lead time.'>
            <Space size={5}>
              <HiExclamation size={20} className='color-error' />
              <Text strong className='color-error'>
                Insufficient Info
              </Text>
            </Space>
          </Popover>
        ),
    },
  ];
  return (
    <MainCard>
      <Space direction='vertical' size={30} className='full-width'>
        <Row justify='space-between'>
          <Col>
            <Row>
              <BoldTitle level={5}>Inventory Analysis</BoldTitle>
            </Row>
          </Col>
          <Col>
            <MoreButton route='invAnalysis' />
          </Col>
        </Row>
        <Row>
          {loading ? (
            <Skeleton
              active={loading}
              title={null}
              paragraph={{ rows: 13, width: '100%' }}
            />
          ) : (
            <Table
              dataSource={data}
              columns={ssColumns}
              pagination={false}
              className='full-width'
            />
          )}
        </Row>
      </Space>
    </MainCard>
  );
};

export default InvAnalysis;
