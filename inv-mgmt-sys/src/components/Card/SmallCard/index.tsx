import { Card, CardProps as AntdCardProps } from 'antd';
import './SmallCard.less';

interface CardProps extends AntdCardProps {
  backgroundColor?:
    | 'default'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'unselected'
    | 'grey';
  children?: React.ReactNode;
}

const SmallCard = ({
  backgroundColor = 'default',
  className,
  ...props
}: CardProps) => {
  return (
    <Card
      {...props}
      bordered={false}
      className={`small-card small-card-${backgroundColor} ${className}`}
    />
  );
};

export default SmallCard;
