import MoreButton from '@components/Button/ActionButton/MoreButton';
import MainCard from '@components/Card/MainCard';
import RankingList from '@components/List/RankingList';
import ProductRankingListSkeleton from '@components/List/RankingList/ProductRankingListSkeleton';
import { BoldTitle } from '@components/Title';
import { getThisMthYr } from '@utils/dateUtils';
import { prodCat } from '@utils/optionUtils';
import { Col, Row, Space, Typography } from 'antd';
import { DashboardProps } from './Dashboard';

const TopProducts = ({ data, loading }: DashboardProps) => {
  const { Text } = Typography;
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
            <Text className='dashboard-grey-text'>{getThisMthYr()}</Text>
          </Row>
        </div>
        {loading || data.length <= 0 ? (
          <ProductRankingListSkeleton active={loading} />
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
