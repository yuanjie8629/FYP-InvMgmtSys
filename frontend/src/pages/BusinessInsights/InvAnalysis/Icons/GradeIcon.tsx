import { Typography } from 'antd';

export interface GradeIconProps {
  grade: string;
  width?: number | string;
  height?: number | string;
  fontSize?: number;
  style?: React.CSSProperties;
  className?: string;
}

const GradeIcon = ({
  grade,
  width = 70,
  height = 80,
  fontSize = 40,
  className,
  style,
  ...props
}: GradeIconProps) => {
  const { Text } = Typography;
  return (
    <Text
      style={{
        width: width,
        height: height,
        borderRadius: 12,
        color: 'white',
        fontSize: fontSize,
        userSelect: 'none',
        ...style,
      }}
      className={`center-flex${
        className !== undefined ? ` ${className}` : ' bg-primary'
      }`}
      strong
    >
      {grade}
    </Text>
  );
};

export default GradeIcon;
