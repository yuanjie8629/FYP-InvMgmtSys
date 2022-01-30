import { Space, SpaceProps } from 'antd';

interface MainCardContainerProps extends SpaceProps {
  func?: string;
}

const MainCardContainer = (props: MainCardContainerProps) => {
  const container = 'main-card-container';
  return (
    <Space
      direction='vertical'
      size={20}
      {...props}
      className={`${props.func === 'add' ? `${container}-add` : container} ${
        props.className
      }`}
    />
  );
};

export default MainCardContainer;
