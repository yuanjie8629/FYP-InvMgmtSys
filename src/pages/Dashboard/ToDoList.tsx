import React, { lazy, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import Space from 'antd/es/space';
import Typography from 'antd/es/typography';
import { MdArrowRight } from 'react-icons/md';
import ColorCard from '@components/Card/ColorCard';
import './Dashboard.less';
import { BoldTitle } from '@components/Title';
import { Skeleton } from 'antd';
import { toDoListAPI } from '@api/services/analysisAPI';
import { serverErrMsg } from '@utils/messageUtils';
import { MessageContext } from '@contexts/MessageContext';

const MainCard = lazy(() => import('@components/Card/MainCard'));

const ToDoList = () => {
  const { Text } = Typography;
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [messageApi] = useContext(MessageContext);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    toDoListAPI()
      .then((res) => {
        if (isMounted) {
          setData(res.data);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const toDoList: {
    label: string;
    value: string;
    link: string;
  }[] = [
    {
      label: 'Pending Order Shipments',
      value: 'order_shipment',
      link: '/order/management?status=toShip',
    },
    {
      label: 'Pending Order Pickup',
      value: 'order_pickup',
      link: '/order/management?status=toPick',
    },
    {
      label: 'Unpaid Orders',
      value: 'order_unpaid',
      link: '/order/management?status=unpaid',
    },
    {
      label: 'Out-of-Stock Products',
      value: 'product_oos',
      link: '/product/management?status=oos',
    },
    {
      label: 'Out-of-Stock Packages',
      value: 'package_oos',
      link: '/package/management?status=oos',
    },
    {
      label: 'Pending Agent Registration',
      value: 'agent_reg',
      link: '/customer/registration?type=agent&pending=true',
    },
    {
      label: 'Pending Dropshipper Registration',
      value: 'drpshpr_reg',
      link: '/customer/registration?type=drpshpr&pending=true',
    },
  ];

  return (
    <MainCard bodyStyle={{ padding: '35px 35px' }}>
      <Space direction='vertical' size={15} className='full-width'>
        <BoldTitle level={5}>To Do List</BoldTitle>
        <Row gutter={[30, 30]}>
          {toDoList.map((toDoItem) => {
            let value: any =
              data[Object.keys(data).find((key) => key === toDoItem.value)];

            return (
              <Col
                key={toDoItem.label}
                flex='25%'
                onClick={
                  !loading && Object.keys(data).length > 0
                    ? () => navigate(toDoItem.link)
                    : undefined
                }
                className='dashboard-toDoList-col'
              >
                <ColorCard
                  backgroundColor='grey'
                  hover={
                    !loading && Object.keys(data).length > 0
                      ? 'success'
                      : undefined
                  }
                  bodyStyle={{
                    padding: '25px 12px 15px',
                  }}
                >
                  {loading || Object.keys(data).length <= 0 ? (
                    <Skeleton
                      title={null}
                      paragraph={{ rows: 2, width: ['50%', '100%'] }}
                      active={loading}
                    />
                  ) : (
                    <Space direction='vertical' size={15}>
                      <BoldTitle
                        level={5}
                        type={value <= 0 ? 'secondary' : undefined}
                      >
                        {value}
                      </BoldTitle>
                      <div>
                        <Text className='dashboard-grey-text'>
                          {toDoItem.label}
                        </Text>
                        <MdArrowRight
                          size={19}
                          className='dashboard-grey-text dashboard-right-arrow'
                        />
                      </div>
                    </Space>
                  )}
                </ColorCard>
              </Col>
            );
          })}
        </Row>
      </Space>
    </MainCard>
  );
};

export default ToDoList;
