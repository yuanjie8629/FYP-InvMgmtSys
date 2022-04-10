import { Space, Typography } from 'antd';
import Layout from '@components/Layout';
import MainCard from '@components/Card/MainCard';
import { BoldTitle } from '@components/Title';
import Button from '@components/Button';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const OrderAdd = () => {
  const { Text } = Typography;
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
              src='https://res.cloudinary.com/yuanjie/image/upload/v1649580973/CommingSoon/eCommerce_xssyk7.gif'
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
          <BoldTitle>E-commerce</BoldTitle>
          <Text type='secondary' className='text-lg'>
            Please click the button below to make order.
          </Text>
          <Button
            type='primary'
            onClick={() =>
              window.open('https://fyp-shrf-ecommerce.herokuapp.com/', '_blank')
            }
          >
            Go to Sharifah Food E-commerce
          </Button>
        </Space>
      </span>
    </Layout>
  );
};

export default OrderAdd;
