import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Space, Typography, Row, Col } from 'antd';
import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
import InformativeTable from '@components/Table/InformativeTable';
import DescriptionList from '@components/List/DescriptionList';
import AnalysisCard from '@/components/Card/AnalysisCard';
import CollapseCard from '@/components/Card/CollapseCard';
import { getDt } from '@/utils/dateUtils';
import FilterInputs from './FilterInputs';
import { abcAnalysis, eoqAnalysis, hmlAnalysis, ssAnalysis } from './Analyses';
import './InvAnalysis.less';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { BoldTitle } from '@/components/Title';

const InvAnalysis = () => {
  const { Text } = Typography;

  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('type') === null) setSearchParams({ type: 'abc' });
  }, [searchParams, setSearchParams]);

  const invAnalysisTab = [
    { key: 'abc', tab: 'ABC' },
    { key: 'hml', tab: 'HML' },
    { key: 'eoq', tab: 'EOQ' },
    { key: 'ss', tab: 'Safety Stock' },
  ];

  const getAnalysis = (
    analysis: string
  ): {
    desc: {
      header: string;
      content: {
        key: string;
        title: string;
        desc: string;
        icon: JSX.Element;
      }[];
    };
    component?: {
      header: string;
      content: {
        key: string;
        label: string;
        desc: string;
        prodList: string[];
      }[];
    };
    columns: {
      title: string;
      dataIndex?: string | string[];
      key: string;
      sorter?: boolean;
      align?: 'left' | 'center' | 'right';
      width?: number | string;
      fixed?: 'left' | 'right';
      render?: any;
    }[];
    tableScroll?: number;
    data: any[];
  } =>
    analysis === 'abc'
      ? abcAnalysis
      : analysis === 'hml'
      ? hmlAnalysis
      : analysis === 'eoq'
      ? eoqAnalysis
      : ssAnalysis;

  const analysis = getAnalysis(searchParams.get('type'));

  return (
    <Layout>
      <MainCardContainer
        className={`inv-analysis${
          ['abc', 'hml'].includes(searchParams.get('type'))
            ? ` grade-analysis`
            : ''
        }`}
      >
        {analysis.desc !== undefined && (
          <CollapseCard
            key={`desc-${searchParams.get('type')}`}
            label={analysis.desc.header}
          >
            <DescriptionList
              grid={{ column: 3 }}
              dataSource={analysis.desc.content}
              titleProps={{ style: { fontSize: 18 } }}
              style={{ borderTop: '1px solid #f0f0f0' }}
            />
          </CollapseCard>
        )}

        {analysis.component !== undefined && (
          <CollapseCard
            key={`component-${searchParams.get('type')}`}
            label={analysis.component.header}
            suffixIcon={
              analysis.component.content.some(
                (component) => component.prodList.length > 0
              ) ? (
                <HiXCircle size={20} className='color-error' />
              ) : (
                <HiCheckCircle size={20} className='color-primary' />
              )
            }
          >
            <Row gutter={[30, 30]}>
              {analysis.component.content.map((component) => (
                <Col key={component.key} flex='25%'>
                  <AnalysisCard component={component} />
                </Col>
              ))}
            </Row>
          </CollapseCard>
        )}

        <MainCard
          tabList={invAnalysisTab}
          activeTabKey={searchParams.get('type')}
          onTabChange={(key) => {
            setSearchParams({ type: key });
          }}
        >
          <FilterInputs />
        </MainCard>
        <MainCard>
          <Space direction='vertical' size={15} className='full-width'>
            <Space direction='vertical' size={5}>
              <BoldTitle level={4}>
                {`${
                  invAnalysisTab.find(
                    (tab) => tab.key === searchParams.get('type')
                  )?.tab
                } Analysis`}
              </BoldTitle>
              <Text type='secondary'>
                {getDt(undefined, undefined, 'YYYY MMMM')}
              </Text>
            </Space>
            <InformativeTable
              dataSource={analysis.data}
              columns={analysis.columns}
              rowSelectable={false}
              scroll={{
                x:
                  analysis.tableScroll !== undefined
                    ? analysis.tableScroll
                    : undefined,
              }}
            />
          </Space>
        </MainCard>
      </MainCardContainer>
    </Layout>
  );
};

export default InvAnalysis;
