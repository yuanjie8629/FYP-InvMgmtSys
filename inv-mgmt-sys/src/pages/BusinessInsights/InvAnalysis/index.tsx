import React, { useEffect, useState } from 'react';
import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
import FilterInputs from './FilterInputs';
import { Space, Typography, Collapse } from 'antd';
import InformativeTable from '@components/Table/InformativeTable';
import voucherList from './voucherList';
import { useSearchParams } from 'react-router-dom';
import DescriptionList from '@components/List/DescriptionList';
import GradeIcon from './GradeIcon';
import './InvAnalysis.less';
import { getDt } from '@/utils/dateUtils';

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

  const abcDesc = {
    header: 'ABC analysis grades the products based on sales per month.',
    content: [
      {
        key: 'gradeA',
        title: 'Grade A',
        desc: 'Grade A contribute to 80% of revenue. Make sure to keep enough stocks since these products produce the most revenue.',
        icon: <GradeIcon grade='A' className='bg-green-400' />,
      },
      {
        key: 'gradeB',
        title: 'Grade B',
        desc: 'Grade B contribute to 15% of revenue. Do not keep too many stocks on hand since these products produce lower revenue.',
        icon: <GradeIcon grade='B' className='bg-blue-400' />,
      },
      {
        key: 'gradeC',
        title: 'Grade C',
        desc: 'Grade C contribute to 5% of revenue. These products are low in demand. Consider ways to promote these products.',
        icon: <GradeIcon grade='C' className='bg-red-400' />,
      },
    ],
  };

  const hmlDesc = {
    header: 'HML analysis grades the products based on sales per month.',
    content: [
      {
        key: 'gradeH',
        title: 'Grade H',
        desc: 'Grade H products make up 75% of the total unit price ratio. These products are costly. Make sure you have strict control on these high-unit-value products.',
        icon: <GradeIcon grade='H' className='bg-green-400' />,
      },
      {
        key: 'gradeM',
        title: 'Grade M',
        desc: 'Grade M products make up 15% of the total unit price ratio. These products do not cost too much. Moderate control on these products is sufficient.',
        icon: <GradeIcon grade='M' className='bg-blue-400' />,
      },
      {
        key: 'gradeL',
        title: 'Grade L',
        desc: 'Grade L products make up 10% of the total unit price ratio. These products are low in unit price. Less control is required for the products.',
        icon: <GradeIcon grade='L' className='bg-red-400' />,
      },
    ],
  };

  const getAnalysisDesc = (analysis: string) =>
    analysis === 'abc' ? abcDesc : analysis === 'hml' ? hmlDesc : null;

  return (
    <Layout>
      <MainCardContainer className='inv-analysis'>
        <MainCard bodyStyle={{ padding: 0 }}>
          <Collapse bordered={false} expandIconPosition='right'>
            <Panel
              header={
                <Text style={{ fontWeight: 500 }} className='text-lg'>
                  {getAnalysisDesc(searchParams.get('type'))?.header}
                </Text>
              }
              key={`info-${searchParams.get('type')}`}
              style={{
                backgroundColor: 'white',
                borderRadius: 6,
              }}
            >
              <DescriptionList
                grid={{ column: 3 }}
                dataSource={getAnalysisDesc(searchParams.get('type'))?.content}
                titleProps={{ style: { fontSize: 18 } }}
                style={{ borderTop: '1px solid #f0f0f0' }}
              />
            </Panel>
          </Collapse>
        </MainCard>
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
