import { Spin, SpinProps } from 'antd';

interface SpinMaskProps extends SpinProps {
  children?: React.ReactNode;
}

const SpinMask = (props: SpinMaskProps) => {
  return <Spin indicator={null} {...props} />;
};

export default SpinMask;
