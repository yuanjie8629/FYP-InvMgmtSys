import { itemRankingAPI } from '@api/services/analysisAPI';
import MoreButton from '@components/Button/ActionButton/MoreButton';
import MainCard from '@components/Card/MainCard';
import RankingList from '@components/List/RankingList';
import RankingListSkeleton from '@components/List/RankingList/RankingListSkeleton';
import { BoldTitle } from '@components/Title';
import { MessageContext } from '@contexts/MessageContext';
import { getEndMthDt, getStartMthDt, getMthYr } from '@utils/dateUtils';
import { serverErrMsg } from '@utils/messageUtils';
import { prodCat } from '@utils/optionUtils';
import { Col, Row, Space, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';

const TopProducts = () => {
  const { Text } = Typography;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi] = useContext(MessageContext);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    itemRankingAPI({
      itemType: 'product',
      rankingType: 'sales',
      fromDate: getStartMthDt(),
      toDate: getEndMthDt(),
      limit: 6,
    })
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  return (
    <MainCard>
      <Space direction='vertical' size={5} className='full-width'>
        <div>
          <Row justify='space-between'>
            <Col>
              <BoldTitle level={5}>Top Products</BoldTitle>
            </Col>
            <Col>
              <MoreButton route='bizStatistics' />
            </Col>
          </Row>
          <Row>
            <Text className='dashboard-grey-text'>{getMthYr()}</Text>
          </Row>
        </div>
        {loading ? (
          <RankingListSkeleton itemType='product' active={loading} total={6} />
        ) : (
          <RankingList
            dataSource={{
              type: 'sales',
              items: data?.map((product) => {
                return {
                  name: product?.name,
                  category: prodCat.find(
                    (cat) => cat.value === product?.category
                  )?.label,
                  value: product?.sales,
                };
              }),
            }}
          />
        )}
      </Space>
    </MainCard>
  );
};
export default TopProducts;
