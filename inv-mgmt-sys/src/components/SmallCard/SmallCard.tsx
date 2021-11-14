import { Card, CardProps as AntdCardProps } from 'antd';
import './SmallCard.less';

interface CardProps extends AntdCardProps {
  backgroundColor?:
    | 'default'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'unselected';
  width?: number;
  children?: React.ReactNode;
}

const SmallCard = ({
  children,
  width,
  backgroundColor = 'default',
  className,
}: CardProps) => {
  return (
    <Card
      bordered={false}
      className={`small-card small-card-${backgroundColor} ${className}`}
      bodyStyle={{ width: width }}
    >
      {children}
    </Card>
  );
};

export default SmallCard;
