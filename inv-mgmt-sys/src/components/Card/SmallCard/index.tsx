import { Card, CardProps as AntdCardProps } from 'antd';
import './SmallCard.less';

interface CardProps extends AntdCardProps {
  backgroundColor?:
    | 'default'
    | 'white'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'grey';
  children?: React.ReactNode;
  hover?:
    | boolean
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'grey';
}

const SmallCard = ({
  backgroundColor = 'default',
  hover = false,
  className,
  ...props
}: CardProps) => {
  return (
    <Card
      bordered={false}
      {...props}
      className={`small-card${
        backgroundColor !== undefined ? `-${backgroundColor} ` : ''
      }${
        hover === true
          ? `small-card-${backgroundColor}-hover`
          : hover !== false
          ? ` small-card-${hover}-hover`
          : ''
      } ${className !== undefined ? className : ''}`}
    />
  );
};

export default SmallCard;
