import { Spin, SpinProps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
const LoadChart = (props: SpinProps) => {
  return (
    <div className='center-flex full-height full-width' style={{ height: 400 }}>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />} />
    </div>
  );
};

export default LoadChart;
