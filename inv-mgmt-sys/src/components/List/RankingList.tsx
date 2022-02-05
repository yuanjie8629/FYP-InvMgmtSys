import React, { useState } from 'react';
import ColorCard from '@components/Card/ColorCard';
import {
  List,
  ListProps,
  Skeleton,
  Typography,
  Row,
  Col,
  Space,
  Select,
  SelectProps,
  Popover,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import './RankingList.less';
import CarouselArrow from '@components/Carousel/CarouselArrow';
import { splitIntoChunks } from '@utils/arrayUtils';

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
  cardSelections?: { key: string; label: string; desc?: string }[];
  selectOptions?: SelectProps;
  onCardSelect?: (selected: string) => void;
  onSelectChange?: (selected: string) => void;
}

const RankingList = ({
  onCardSelect = () => '',
  onSelectChange = () => '',
  ...props
}: RankingListProps) => {
  const { Text, Title } = Typography;

  const [selectedCard, setSelectedCard] = useState('bySales');
  return (
    <Space direction='vertical' className='full-width'>
      {props.cardSelections !== undefined ||
      props.selectOptions !== undefined ? (
        <Row justify='space-between' align='middle'>
          <Col span={13}>
            {props.cardSelections !== undefined ? (
              <CarouselArrow style={{ width: 274 }}>
                {splitIntoChunks(props.cardSelections, 2).map(
                  (chunks, index) => (
                    <div key={`rankingSelections-${index}`}>
                      <Row gutter={20}>
                        {chunks.map((selection) => (
                          <Col>
                            <ColorCard
                              key={selection.key}
                              bodyStyle={{ padding: 15 }}
                              style={{ minWidth: 125 }}
                              backgroundColor={
                                selectedCard === selection.key
                                  ? 'success'
                                  : 'grey'
                              }
                              hover={selectedCard !== selection.key
                                ? 'success'
                                : null}
                              label={
                                <>
                                  <Text className='text-break'>
                                    {selection.label}
                                  </Text>
                                  <Popover
                                    content={selection.desc}
                                    overlayStyle={{
                                      width: 300,
                                      textAlign: 'justify',
                                    }}
                                  >
                                    <QuestionCircleOutlined
                                      style={{ padding: '0 5px' }}
                                      className='color-grey'
                                    />
                                  </Popover>
                                </>
                              }
                              indicator={
                                selectedCard === selection.key ? 'true' : null
                              }
                              onClick={() => {
                                setSelectedCard(selection.key);
                                onCardSelect(selection.key);
                              }}
                            />
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )
                )}
              </CarouselArrow>
            ) : null}
          </Col>
          {props.selectOptions !== undefined ? (
            <Col span={7}>
              <Select
                {...props.selectOptions}
                className='full-width'
                onChange={(value) => onSelectChange(value)}
              />
            </Col>
          ) : null}
        </Row>
      ) : null}
      <List
        dataSource={props.itemList.items}
        renderItem={(item) => (
          <List.Item key={item.itemNm}>
            <Skeleton title={false} active loading={false}>
              <List.Item.Meta
                key={item.itemNm}
                title={
                  <Text className='ranking-list-title'>{item.itemNm}</Text>
                }
                description={
                  <Text className='ranking-list-cat'>{item.itemCat}</Text>
                }
              />
              <Row align='middle' gutter={[5, 5]}>
                <Col>
                  <Title level={5} className='ranking-list-value'>
                    {item.value}
                  </Title>
                </Col>
                <Col>
                  <Text className='ranking-list-sales'>
                    {props.itemList.type === 'sales' ? 'sales' : 'units'}
                  </Text>
                </Col>
              </Row>
            </Skeleton>
          </List.Item>
        )}
      />
    </Space>
  );
};

export default RankingList;
