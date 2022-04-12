import React, { useState } from 'react';
import ColorCard from '@components/Card/ColorCard';
import {
  List,
  ListProps,
  Typography,
  Row,
  Col,
  Space,
  Select,
  SelectProps,
  Pagination,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import './RankingList.less';
import CarouselArrow from '@components/Carousel/CarouselArrow';
import { splitIntoChunks } from '@utils/arrayUtils';
import Popover from '@components/Popover';
import { BoldTitle } from '@components/Title';
import { RankingType } from '@utils/optionUtils';

export interface RankingDataProps {
  type: RankingType;
  items: {
    name: string;
    category?: string;
    value: number;
  }[];
}

export interface RankingListProps extends Omit<ListProps<any>, 'dataSource'> {
  dataSource: RankingDataProps;
  showPagination?: boolean;
  totalData?: number;
  cardSelections?: { key: string; label: string; desc?: string }[];
  cardSelected?: string;
  selectOptions?: SelectProps;
  onCardSelect?: (selected: RankingType) => void;
  onSelectChange?: (selected: string) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  currentPg?: number;
}

const RankingList = ({
  dataSource,
  showPagination = false,
  totalData,
  cardSelections,
  cardSelected,
  selectOptions,
  onCardSelect = () => null,
  onSelectChange = () => null,
  onPageChange = () => null,
  currentPg = 1,
  ...props
}: RankingListProps) => {
  const { Text } = Typography;
  const [selectedCard, setSelectedCard] = useState(cardSelected || 'sales');

  return (
    <Space direction='vertical' className='full-width'>
      {(cardSelections !== undefined || selectOptions !== undefined) && (
        <Row justify='space-between' align='middle'>
          <Col span={13}>
            {cardSelections !== undefined && (
              <CarouselArrow style={{ width: 274 }}>
                {splitIntoChunks(cardSelections, 2).map((chunks, index) => (
                  <div key={`rankingSelections-${index}`}>
                    <Row gutter={20}>
                      {chunks.map((selection) => (
                        <Col key={`col-${selection.key}`}>
                          <ColorCard
                            key={selection.key}
                            bodyStyle={{ padding: 15 }}
                            style={{ minWidth: 125 }}
                            backgroundColor={
                              selectedCard === selection.key
                                ? 'success'
                                : 'grey'
                            }
                            hover={
                              selectedCard !== selection.key ? 'success' : null
                            }
                            label={
                              <>
                                <Text className='text-break'>
                                  {selection.label}
                                </Text>
                                {selection.desc !== undefined && (
                                  <Popover content={selection.desc}>
                                    <QuestionCircleOutlined
                                      style={{
                                        padding: '0 5px',
                                      }}
                                      className='color-grey'
                                    />
                                  </Popover>
                                )}
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
                ))}
              </CarouselArrow>
            )}
          </Col>
          {selectOptions !== undefined && (
            <Col span={7}>
              <Select
                {...selectOptions}
                className='full-width'
                onChange={(value) => onSelectChange(value)}
              />
            </Col>
          )}
        </Row>
      )}
      <List
        dataSource={dataSource.items}
        renderItem={(item: {
          name: string;
          category?: string;
          value: number;
        }) => (
          <List.Item key={item.name}>
            <List.Item.Meta
              key={item.name}
              title={<Text className='ranking-list-title'>{item.name}</Text>}
              description={
                <Text type='secondary' className='ranking-list-cat'>
                  {item.category}
                </Text>
              }
            />
            <Row align='middle' gutter={[5, 5]}>
              {dataSource.type === 'sales' && (
                <Col>
                  <Text className='ranking-list-sales'>RM</Text>
                </Col>
              )}
              <Col>
                <BoldTitle level={5} className='ranking-list-value'>
                  {dataSource.type === 'sales'
                    ? item.value?.toFixed(2)
                    : item.value}
                </BoldTitle>
              </Col>
              {dataSource.type === 'units' && (
                <Col>
                  <Text className='ranking-list-sales'>units</Text>
                </Col>
              )}
            </Row>
          </List.Item>
        )}
        style={{ minHeight: 360 }}
        {...props}
      />
      {dataSource && showPagination && (
        <Row justify='end'>
          <Col>
            <Pagination
              current={currentPg}
              showQuickJumper
              onChange={(page, pageSize) => {
                onPageChange(page, pageSize);
              }}
              showTotal={(total) => `Total ${total} items`}
              total={totalData}
            />
          </Col>
        </Row>
      )}
    </Space>
  );
};

export default RankingList;
