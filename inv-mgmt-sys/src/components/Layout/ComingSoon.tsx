import ContainerCard from '@components/Card/ContainerCard';
import Layout from '@components/Layout/Layout';
import { Space, SpaceProps, Typography } from 'antd';
import Button from '@components/Button';
import { useNavigate } from 'react-router-dom';

interface ComingSoonProps extends SpaceProps {
  img: string;
}

const ComingSoon = (props: ComingSoonProps) => {
  const { Text, Title } = Typography;
  const navigate = useNavigate();
  return (
    <Layout>
      <div className='coming-soon'>
        <Space
          direction='vertical'
          size={20}
          className='container-card-wrapper'
          align='center'
        >
          <ContainerCard width='100%' contentStyle={{ padding: '0 10px' }}>
            <img
              src={props.img}
              alt='comingSoonImg'
              height={370}
              width={490}
            ></img>
          </ContainerCard>
          <Title>Coming Soon</Title>
          <Text type='secondary' className='text-lg'>
            We Are Working Hard to Give You a Better Experience.
          </Text>
          <Button type='primary' onClick={() => navigate('/')}>
            Go Back to Dashboard
          </Button>
        </Space>
      </div>
    </Layout>
  );
};

export default ComingSoon;
