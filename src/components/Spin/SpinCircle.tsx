import { Spin, SpinProps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface SpinCircleProps extends SpinProps {
  children?: React.ReactNode;
}

const SpinCircle = (props: SpinCircleProps) => {
  return (
    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} />} {...props} />
  );
};

export default SpinCircle;
