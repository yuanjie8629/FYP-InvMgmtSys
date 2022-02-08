import { Typography } from 'antd';

interface GradeIconProps {
  grade: string;
  style?: React.CSSProperties;
  className?: string;
}

const GradeIcon = ({ grade, className, style, ...props }: GradeIconProps) => {
  const { Text } = Typography;
  return (
    <Text
      style={{
        width: 70,
        height: 80,
        borderRadius: 12,
        color: 'white',
        fontSize: 40,
        userSelect: 'none',
        ...style,
      }}
      className={`centerFlex${
        className !== undefined ? ` ${className}` : ' bg-primary'
      }`}
      strong
    >
      {grade}
    </Text>
  );
};

export default GradeIcon;
