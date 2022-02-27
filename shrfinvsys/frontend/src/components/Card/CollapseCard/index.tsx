import { Col, Collapse, CollapseProps, Row, Typography } from 'antd';
import MainCard from '../MainCard';

interface CollapseCardProps extends CollapseProps {
  key: string;
  label: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const CollapseCard = ({
  key,
  label,
  prefixIcon,
  suffixIcon,
  children,
  ...props
}: CollapseCardProps) => {
  const { Text } = Typography;
  const { Panel } = Collapse;
  return (
    <MainCard bodyStyle={{ padding: 0 }}>
      <Collapse bordered={false} expandIconPosition='right' {...props}>
        <Panel
          header={
            <Row align='middle' gutter={10}>
              {prefixIcon !== undefined ? (
                <Col className='center-flex'>{prefixIcon}</Col>
              ) : null}
              <Col>
                <Text style={{ fontWeight: 500 }} className='text-lg'>
                  {label}
                </Text>
              </Col>
              {suffixIcon !== undefined ? (
                <Col className='center-flex'> {suffixIcon}</Col>
              ) : null}
            </Row>
          }
          key={key}
        >
          {children}
        </Panel>
      </Collapse>
    </MainCard>
  );
};

export default CollapseCard;
