import { ItemType } from '@utils/optionUtils';
import { List, SkeletonProps, Skeleton, Space, Row, Col } from 'antd';
import './RankingList.less';

interface RankingListSkeletonProps extends SkeletonProps {
  cardSelection?: boolean;
  pagination?: boolean;
  itemType: ItemType;
  total: number;
}
const RankingListSkeleton = ({
  cardSelection = false,
  pagination = false,
  itemType,
  total,
  ...props
}: RankingListSkeletonProps) => {
  return (
    <Space
      direction='vertical'
      size={15}
      className=' full-width'
      style={{ paddingTop: 10 }}
    >
      {cardSelection && (
        <Row justify='space-between' align='middle'>
          <Col className='ranking-list-skeleton-card'>
            <Space size={20}>
              <Skeleton.Button {...props} />
              <Skeleton.Button {...props} />
            </Space>
          </Col>
          {itemType === 'product' && (
            <Col className='ranking-list-skeleton-category'>
              <Skeleton.Button {...props} />
            </Col>
          )}
        </Row>
      )}
      <div>
        <List
          dataSource={Array.from(Array(total).keys())}
          renderItem={(item) => (
            <List.Item className={`ranking-list-skeleton-${itemType}-item`}>
              <Skeleton
                title={itemType === 'package' ? {} : null}
                paragraph={
                  itemType === 'product'
                    ? {
                        rows: 2,
                        width: ['100%', '30%'],
                      }
                    : null
                }
                style={{ minHeight: 48 }}
                {...props}
              />
            </List.Item>
          )}
        />
        {pagination && (
          <Row justify='end'>
            <Col className='ranking-list-skeleton-pagination'>
              <Skeleton paragraph={null} {...props} />
            </Col>
          </Row>
        )}
      </div>
    </Space>
  );
};

export default RankingListSkeleton;
