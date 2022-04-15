import Layout from '@components/Layout';
import { Space, SpaceProps, Typography } from 'antd';
import Button from '@components/Button';
import { useNavigate } from 'react-router-dom';
import MainCard from '@components/Card/MainCard';
import { BoldTitle } from '@components/Title';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export interface ComingSoonProps extends SpaceProps {
  img: string;
}

const ComingSoon = ({ img, ...props }: ComingSoonProps) => {
  const { Text } = Typography;
  const navigate = useNavigate();
  return (
    <Layout>
      <span className='coming-soon'>
        <Space
          direction='vertical'
          size={20}
          className='main-card-container'
          align='center'
        >
          <MainCard bodyStyle={{ padding: 15 }}>
            <LazyLoadImage
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
          <BoldTitle>Coming Soon</BoldTitle>
          <Text type='secondary' className='text-lg'>
            We Are Working Hard to Give You a Better Experience.
          </Text>
          <Button type='primary' onClick={() => navigate('/')}>
            Go Back to Dashboard
          </Button>
        </Space>
      </span>
    </Layout>
  );
};

export default ComingSoon;
