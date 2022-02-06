import Layout from '@components/Layout';
import { Card, Space, SpaceProps, Typography } from 'antd';
import Button from '@components/Button';
import { useNavigate } from 'react-router-dom';

interface ComingSoonProps extends SpaceProps {
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
          <Card bodyStyle={{ padding: 15 }}>
            <img src={img} alt='comingSoonImg' height={370} width={490}></img>
          </Card>
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
