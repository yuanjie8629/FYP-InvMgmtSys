import { Space, SpaceProps } from 'antd';
import './MainCardContainer.less';

interface MainCardContainerProps extends SpaceProps {
  func?: string;
}

const MainCardContainer = ({
  func,
  className,
  ...props
}: MainCardContainerProps) => {
  const container = 'main-card-container';
  return (
    <Space
      direction='vertical'
      size={20}
      className={`${
        func === 'add' ? `${container}-add` : container
      } ${className}`}
      {...props}
    />
  );
};

export default MainCardContainer;
