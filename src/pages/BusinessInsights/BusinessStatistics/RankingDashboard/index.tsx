import DropdownDate from '@components/Input/DropdownDate';
import { getDt } from '@utils/dateUtils';
import { Col, Row } from 'antd';
import { useState } from 'react';
import { DashboardContainer } from '..';
import PackageRanking from './PackageRanking';
import ProductRanking from './ProductRanking';

export interface RankingDtInfo {
  date: string;
  label: string;
  cat: string;
}

export interface RankingDashboardProps {
  dateInfo: RankingDtInfo;
}

export const rankingCardSelections = [
  { key: 'sales', label: 'By Sales', desc: 'Sort ranking by sales' },
  { key: 'units', label: 'By Units', desc: 'Sort ranking by unit sold' },
];

const RankingDashboard = (props) => {
  const [rankingDtInfo, setRankingDtInfo] = useState({
    date: getDt(),
    label: 'Today',
    cat: 'tdy',
  });

  return (
    <DashboardContainer>
      <DropdownDate
        onChange={(dateInfo) => {
          setRankingDtInfo(dateInfo);
        }}
        className='main-card'
      />
      <Row justify='center' gutter={[30, 20]}>
        <Col span={12}>
          <ProductRanking dateInfo={rankingDtInfo} />
        </Col>
        <Col span={12}>
          <PackageRanking dateInfo={rankingDtInfo} />
        </Col>
      </Row>
    </DashboardContainer>
  );
};

export default RankingDashboard;
