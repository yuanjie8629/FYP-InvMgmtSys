import { itemRankingAPI } from '@api/services/analysisAPI';
import MainCard from '@components/Card/MainCard';
import RankingList from '@components/List/RankingList';
import RankingListSkeleton from '@components/List/RankingList/RankingListSkeleton';
import { BoldTitle } from '@components/Title';
import { MessageContext } from '@contexts/MessageContext';
import { formatDt } from '@utils/dateUtils';
import { serverErrMsg } from '@utils/messageUtils';
import { prodCat, RankingType } from '@utils/optionUtils';
import { Space, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { rankingCardSelections, RankingDashboardProps } from '.';

const PackageRanking = ({ dateInfo }: RankingDashboardProps) => {
  const { Text } = Typography;
  const [data, setData] = useState([]);
  const [total, setTotal] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [rankingType, setRankingType] = useState<RankingType>('sales');
  const [pagination, setPagination] = useState({ page: 1, pageSize: 6 });
  const [messageApi] = useContext(MessageContext);

  const getPackageRanking = (isMounted = true) => {
    setLoading(true);
    itemRankingAPI({
      itemType: 'package',
      rankingType: rankingType,
      fromDate: dateInfo.date.includes(' ~ ')
        ? dateInfo.date.split(' ~ ')[0]
        : dateInfo.date,
      toDate: dateInfo.date.includes(' ~ ')
        ? dateInfo.date.split(' ~ ')[1]
        : dateInfo.date,
      limit: 6,
      offset: (pagination.page - 1) * pagination.pageSize,
    })
      .then((res) => {
        if (isMounted) {
          setData(res.data?.results);
          setTotal(res.data?.count);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setLoading(false);
          showServerErrMsg();
        }
      });
  };

  useEffect(() => {
    let isMounted = true;

    getPackageRanking(isMounted);

    return () => {
      isMounted = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateInfo, rankingType]);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  return (
    <MainCard>
      <Space direction='vertical' size={5} className='full-width'>
        <div>
          <BoldTitle level={5}>Promotion Rankings</BoldTitle>

          <Text type='secondary'>
            {formatDt(
              dateInfo.date,
              dateInfo.cat,
              'DD-MM-YYYY',
              'MMM DD, YYYY'
            )}
          </Text>
        </div>
        {loading ? (
          <RankingListSkeleton
            itemType='package'
            active={loading}
            total={6}
            cardSelection
            pagination
          />
        ) : (
          <RankingList
            dataSource={{
              type: rankingType,
              items: data?.map((pack) => {
                return {
                  name: pack?.name,
                  category: prodCat.find((cat) => cat.value === pack?.category)
                    ?.label,
                  value: pack[rankingType],
                };
              }),
            }}
            showPagination
            totalData={total}
            cardSelections={rankingCardSelections}
            cardSelected={rankingType}
            onCardSelect={(selected) => {
              setRankingType(selected);
            }}
            onPageChange={(page, pageSize) => {
              setPagination({ page: page, pageSize: pageSize });
            }}
          />
        )}
      </Space>
    </MainCard>
  );
};

export default PackageRanking;
