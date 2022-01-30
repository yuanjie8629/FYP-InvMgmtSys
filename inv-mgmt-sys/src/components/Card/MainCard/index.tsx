import { Card, CardProps } from 'antd';
import './MainCard.less';

const MainCard = (props: CardProps) => {
  return (
    <Card
      bordered={false}
      bodyStyle={{ padding: 35 }}
      {...props}
      className={`container-card width-full height-full ${props.className}`}
    />
  );
};

export default MainCard;
