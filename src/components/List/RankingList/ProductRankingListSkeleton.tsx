import { List, SkeletonProps, Skeleton } from 'antd';

const RankingListSkeleton = (props: SkeletonProps) => {
  return (
    <List
      dataSource={Array.from(Array(6).keys())}
      renderItem={(item) => (
        <List.Item>
          <Skeleton title={null} paragraph={{ rows: 2 }} {...props} />
        </List.Item>
      )}
    />
  );
};

export default RankingListSkeleton;
