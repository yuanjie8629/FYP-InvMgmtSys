import { Card, CardProps } from 'antd';
import './MainCard.less';

const MainCard = (props: CardProps) => {
  return (
    <Card
      bordered={false}
      bodyStyle={{ padding: 35 }}
      {...props}
      className={`container-card full-width full-height ${
        props.className !== undefined ? props.className : ''
      }`}
    />
  );
};

export default MainCard;
