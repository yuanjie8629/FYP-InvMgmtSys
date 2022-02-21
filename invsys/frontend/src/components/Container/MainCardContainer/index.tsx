import { Space, SpaceProps } from 'antd';
import './MainCardContainer.less';

export interface MainCardContainerProps extends SpaceProps {}

const MainCardContainer = ({ className, ...props }: MainCardContainerProps) => {
  return (
    <Space
      direction='vertical'
      size={20}
      className={`main-card-container${
        className !== undefined ? ` ${className}` : ''
      }`}
      {...props}
    />
  );
};

export default MainCardContainer;
