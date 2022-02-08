import { Card, CardProps } from 'antd';
import './MainCard.less';

const MainCard = ({ className, ...props }: CardProps) => {
  return (
    <Card
      bordered={false}
      bodyStyle={{ padding: 35 }}
      className={`main-card full-width full-height${
        className !== undefined ? ` ${className}` : ''
      }`}
      {...props}
    />
  );
};

export default MainCard;
