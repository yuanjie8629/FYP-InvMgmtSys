import { Typography } from 'antd';
import { TitleProps } from 'antd/es/typography/Title';

const BoldTitle = ({ style, ...props }: TitleProps) => {
  const { Title } = Typography;
  return <Title style={{ fontWeight: 700, ...style }} {...props} />;
};

export default BoldTitle;
