import Layout from '@components/Layout';
import { Result as AntdResult, ResultProps } from 'antd';
import MainCard from '@components/Card/MainCard';
import SuccessResult from './SuccessResult';
import MainCardContainer from '@components/Container/MainCardContainer';
const ResultFeedback = (props: ResultProps) => {
  return (
    <Layout>
      <MainCardContainer>
        <MainCard bodyStyle={{ padding: 15 }}>
          <AntdResult {...props} />
        </MainCard>
      </MainCardContainer>
    </Layout>
  );
};

export default ResultFeedback;
export { SuccessResult };
