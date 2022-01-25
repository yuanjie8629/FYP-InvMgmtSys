import { Card, CardProps } from 'antd';
import './ContainerCard.less';
interface ContainerCardProps extends CardProps {
  width?: string | number;
  height?: string | number;
  contentStyle?: React.CSSProperties;
  children?: React.ReactNode;
}
const ContainerCard = ({
  width = '95%',
  height = '100%',
  contentStyle = { padding: '10px 25px' },
  ...props
}: ContainerCardProps) => {
  return (
    <Card
      bordered={false}
      style={{
        width: width,
        height: height,
      }}
      className='container-card'
      {...props}
    >
      <div style={contentStyle}>{props.children}</div>
    </Card>
  );
};

export default ContainerCard;
