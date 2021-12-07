import { List, ListProps, Skeleton, Typography, Row, Col } from 'antd';

interface RankingListProps extends ListProps<any> {
  itemList: {
    date: string;
    type: 'sales' | 'units';
    items: {
      itemNm: string;
      itemCat?: string;
      value: number;
    }[];
  };
}

const RankingList = (props: RankingListProps) => {
  const { Text, Title } = Typography;
  return (
    <List
      dataSource={props.itemList.items}
      renderItem={(item) => (
        <List.Item key={item.itemNm}>
          <Skeleton title={false} active loading={false}>
            <List.Item.Meta
              key={item.itemNm}
              title={
                <Text className='dashboard-top-product-title'>
                  {item.itemNm}
                </Text>
              }
              description={
                <Text className='dashboard-top-product-cat'>
                  {item.itemCat}
                </Text>
              }
            ></List.Item.Meta>
            <Row align='middle' gutter={[5, 5]}>
              <Col>
                <Title level={5}>{item.value}</Title>
              </Col>
              <Col>
                <Text className='dashboard-top-product-sales'>
                  {props.itemList.type === 'sales' ? 'sales' : 'units'}
                </Text>
              </Col>
            </Row>
          </Skeleton>
        </List.Item>
      )}
      {...props}
    ></List>
  );
};

export default RankingList;