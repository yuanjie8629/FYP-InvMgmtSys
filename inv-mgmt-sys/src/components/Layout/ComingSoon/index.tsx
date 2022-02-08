import Layout from '@components/Layout';
import { Space, SpaceProps, Typography } from 'antd';
import Button from '@components/Button';
import { useNavigate } from 'react-router-dom';
import MainCard from '@/components/Card/MainCard';

export interface ComingSoonProps extends SpaceProps {
  img: string;
}

const ComingSoon = ({ img, ...props }: ComingSoonProps) => {
  const { Text, Title } = Typography;
  const navigate = useNavigate();
  return (
    <Layout>
      <div className='coming-soon'>
        <Space
          direction='vertical'
          size={20}
          className='main-card-container'
          align='center'
        >
          <MainCard bodyStyle={{ padding: 15 }}>
            <img
              src={img}
              alt='comingSoonImg'
              height={370}
              width={490}
              draggable='false'
              style={{
                borderRadius: 6,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />
          </MainCard>
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
