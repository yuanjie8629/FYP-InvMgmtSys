import { Card } from 'antd';

interface ContainerCardProps {
  width?: string | number;
  height?: string | number;
  children?: React.ReactNode;
}
const ContainerCard = ({
  width = '95%',
  height = '100%',
  ...props
}: ContainerCardProps) => {
  return (
    <Card
      bordered={false}
      style={{
        width: width,
        height: height,
        boxShadow:
          '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
        padding: '10px 25px',
        borderRadius: 12,
      }}
      {...props}
    >
      {props.children}
    </Card>
  );
};

export default ContainerCard;
