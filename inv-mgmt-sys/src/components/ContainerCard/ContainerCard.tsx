import { Card } from 'antd';

interface ContainerCardProps {
  width?: string | number;
  children?: React.ReactNode;
}
const ContainerCard = ({ width = '95%', ...props }: ContainerCardProps) => {
  return (
    <Card
      bordered={false}
      style={{
        width: width,
        boxShadow:
          '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
        padding: '15px 25px',
      }}
    >
      {props.children}
    </Card>
  );
};

export default ContainerCard;
