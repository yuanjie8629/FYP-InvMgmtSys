import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Space, Typography, Collapse, Row, Col } from 'antd';
import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
import InformativeTable from '@components/Table/InformativeTable';
import DescriptionList from '@components/List/DescriptionList';
import { getDt } from '@/utils/dateUtils';
import voucherList from './voucherList';
import FilterInputs from './FilterInputs';
import './InvAnalysis.less';
import { abcAnalysis, eoqAnalysis, hmlAnalysis, ssAnalysis } from './Analyses';
import AnalysisCard from '@/components/Card/AnalysisCard';

const InvAnalysis = () => {
  const { Text, Title } = Typography;
  const { Panel } = Collapse;
  const [invAnalysisListFltr, setInvAnalysisListFltr] = useState(voucherList);

  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(
    () =>
      setInvAnalysisListFltr(
        voucherList.filter((voucher) =>
          searchParams.get('type') !== null
            ? voucher.status === searchParams.get('type')
            : setSearchParams({ type: 'abc' })
        )
      ),
    [searchParams, setSearchParams]
  );

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
  } =>
    analysis === 'abc'
      ? abcAnalysis
      : analysis === 'hml'
      ? hmlAnalysis
      : analysis === 'eoq'
      ? eoqAnalysis
      : ssAnalysis;

  const getAnalysisDesc = (analysis: string) => getAnalysis(analysis).desc;

  const getAnalysisComponent = (analysis: string) =>
    getAnalysis(analysis).hasOwnProperty('component')
      ? getAnalysis(analysis).component
      : null;

  const analysisDesc = getAnalysisDesc(searchParams.get('type'));
  const analysisComponent = getAnalysisComponent(searchParams.get('type'));

  return (
    <Layout>
      <MainCardContainer className='inv-analysis'>
        {analysisDesc !== null ? (
          <MainCard bodyStyle={{ padding: 0 }}>
            <Collapse bordered={false} expandIconPosition='right'>
              <Panel
                header={
                  <Text style={{ fontWeight: 500 }} className='text-lg'>
                    {analysisDesc.header}
                  </Text>
                }
                key={`info-${searchParams.get('type')}`}
              >
                <DescriptionList
                  grid={{ column: 3 }}
                  dataSource={analysisDesc?.content}
                  titleProps={{ style: { fontSize: 18 } }}
                  style={{ borderTop: '1px solid #f0f0f0' }}
                />
              </Panel>
            </Collapse>
          </MainCard>
        ) : null}

        {analysisComponent !== null ? (
          <MainCard bodyStyle={{ padding: 0 }}>
            <Collapse bordered={false} expandIconPosition='right'>
              <Panel
                header={
                  <Text style={{ fontWeight: 500 }} className='text-lg'>
                    {analysisComponent.header}
                  </Text>
                }
                key={`info-${searchParams.get('type')}`}
              >
                <Row gutter={[30, 30]}>
                  {analysisComponent.content.map((component) => (
                    <Col key={component.key} flex='25%'>
                      <AnalysisCard component={component} />
                    </Col>
                  ))}
                </Row>
              </Panel>
            </Collapse>
          </MainCard>
        ) : null}

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
              <Title level={4}>
                {`${
                  invAnalysisTab.find(
                    (tab) => tab.key === searchParams.get('type')
                  )?.tab
                } Analysis`}
              </Title>
              <Text>{getDt(undefined, undefined, 'YYYY MMMM')}</Text>
            </Space>
            <InformativeTable
              dataSource={invAnalysisListFltr}
              columns={[]}
              rowSelectable={false}
              scroll={{ x: 1200 }}
            />
          </Space>
        </MainCard>
      </MainCardContainer>
    </Layout>
  );
};

export default InvAnalysis;
