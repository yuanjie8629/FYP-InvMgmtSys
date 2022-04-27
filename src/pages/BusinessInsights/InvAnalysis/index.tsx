import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Row, Col, CardProps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
import MainCardContainer from '@components/Container/MainCardContainer';
import DescriptionList from '@components/List/DescriptionList';
import AnalysisCard from '@components/Card/AnalysisCard';
import CollapseCard from '@components/Card/CollapseCard';
import {
  AbcAnalysis,
  abcUtils,
  EoqAnalysis,
  eoqUtils,
  HmlAnalysis,
  hmlUtils,
  SsAnalysis,
  ssUtils,
} from './Analyses';
import './InvAnalysis.less';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { invAnalysisAPI, invAnalysisCheckAPI } from '@api/services/analysisAPI';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { getPrevMth } from '@utils/dateUtils';
import AbcFilterInputs from './Analyses/AbcAnalysis/AbcFilterInputs';
import HmlFilterInputs from './Analyses/HmlAnalysis/HmlFilterInputs';
import EoqFilterInputs from './Analyses/EoqAnalysis/EoqFilterInputs';
import SsFilterInputs from './Analyses/SsAnalysis/SsFilterInputs';

export interface InvAnalysisProps extends CardProps {
  data?: any[];
  loading?: boolean;
  totalCount?: number;
  currentPg?: number;
  defPg?: number;
}

const InvAnalysis = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [messageApi] = useContext(MessageContext);
  const [list, setList] = useState([]);
  const [recordCount, setRecordCount] = useState<number>();
  const [tableLoading, setTableLoading] = useState(false);
  const [invalidComponentData, setInvalidComponentData] = useState([]);
  const [componentLoading, setComponentLoading] = useState(false);
  const [currentPg, setCurrentPg] = useState(1);
  const defPg = 5;

  const getTableData = (isMounted: boolean = true) => {
    if (searchParams.has('month')) {
      setList([]);
      setCurrentPg(1);
      setTableLoading(true);
      invAnalysisAPI(searchParams.get('type'), location.search)
        .then((res) => {
          if (isMounted) {
            setList(res.data?.results);
            setRecordCount(res.data?.count);
            if (searchParams.has('offset')) {
              let offset = Number(searchParams.get('offset'));
              setCurrentPg(offset / defPg + 1);
            }
            setTableLoading(false);
          }
        })
        .catch((err) => {
          if (err.response?.status !== 401) {
            setTableLoading(false);
            showServerErrMsg();
          }
        });
    }
  };

  const getInvalidComponents = (isMounted: boolean = true) => {
    if (
      searchParams.has('month') &&
      ['ss', 'eoq'].includes(searchParams.get('type'))
    ) {
      let type =
        searchParams.get('type') === 'ss'
          ? 'ss'
          : searchParams.get('type') === 'eoq'
          ? 'eoq'
          : undefined;

      setInvalidComponentData([]);
      setComponentLoading(true);
      invAnalysisCheckAPI(type, `?month=${searchParams.get('month')}`)
        .then((res) => {
          if (isMounted) {
            setInvalidComponentData(res?.data);
            if (searchParams.has('offset')) {
              let offset = Number(searchParams.get('offset'));
              setCurrentPg(offset / defPg + 1);
            }
            setComponentLoading(false);
          }
        })
        .catch((err) => {
          if (err.response?.status !== 401) {
            setComponentLoading(false);
            showServerErrMsg();
          }
        });
    }
  };

  useEffect(
    () => {
      if (!(searchParams.has('month') && searchParams.has('type'))) {
        setSearchParams({
          type: 'abc',
          month: getPrevMth(undefined, undefined, 'YYYY-MM'),
          limit: String(defPg),
        });
      }
      let isMounted = true;
      getTableData(isMounted);
      getInvalidComponents(isMounted);
      return () => {
        isMounted = false;
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, searchParams.get('type')]
  );

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

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
      }[];
    };
  } =>
    analysis === 'abc'
      ? abcUtils
      : analysis === 'hml'
      ? hmlUtils
      : analysis === 'eoq'
      ? eoqUtils
      : ssUtils;

  const analysis = getAnalysis(searchParams.get('type'));
  const handleTabChange = (key: string) => {
    setSearchParams({
      type: key,
      month: getPrevMth(undefined, undefined, 'YYYY-MM'),
      limit: String(defPg),
    });
  };

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
              componentLoading ? (
                <LoadingOutlined className='color-grey' />
              ) : analysis.component.content
                  .map((component) => {
                    let match = false;
                    Object.keys(invalidComponentData).forEach((key) => {
                      if (component.key === key) {
                        console.log(invalidComponentData[key]);
                        if (invalidComponentData[key].length > 0) match = true;
                      }
                    });
                    return match;
                  })
                  .includes(true) ? (
                <HiXCircle size={20} className='color-error' />
              ) : (
                <HiCheckCircle size={20} className='color-primary' />
              )
            }
          >
            <Row gutter={[30, 30]}>
              {analysis.component.content.map((component) => {
                return (
                  <Col key={component.key} flex='25%'>
                    <AnalysisCard
                      component={component}
                      dataList={invalidComponentData[component.key]}
                      loading={componentLoading}
                    />
                  </Col>
                );
              })}
            </Row>
          </CollapseCard>
        )}

        <MainCard
          tabList={invAnalysisTab}
          activeTabKey={searchParams.get('type')}
          onTabChange={handleTabChange}
        >
          {searchParams.get('type') === 'abc' ? (
            <AbcFilterInputs />
          ) : searchParams.get('type') === 'hml' ? (
            <HmlFilterInputs />
          ) : searchParams.get('type') === 'eoq' ? (
            <EoqFilterInputs />
          ) : (
            <SsFilterInputs />
          )}
        </MainCard>
        {searchParams.get('type') === 'abc' ? (
          <AbcAnalysis
            data={list}
            defPg={defPg}
            currentPg={currentPg}
            totalCount={recordCount}
            loading={tableLoading}
          />
        ) : searchParams.get('type') === 'hml' ? (
          <HmlAnalysis
            data={list}
            defPg={defPg}
            currentPg={currentPg}
            totalCount={recordCount}
            loading={tableLoading}
          />
        ) : searchParams.get('type') === 'eoq' ? (
          <EoqAnalysis
            data={list}
            defPg={defPg}
            currentPg={currentPg}
            totalCount={recordCount}
            loading={tableLoading}
          />
        ) : (
          <SsAnalysis
            data={list}
            defPg={defPg}
            currentPg={currentPg}
            totalCount={recordCount}
            loading={tableLoading}
          />
        )}
      </MainCardContainer>
    </Layout>
  );
};

export default InvAnalysis;
