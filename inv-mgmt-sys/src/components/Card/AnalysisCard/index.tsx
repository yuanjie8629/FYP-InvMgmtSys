import { Tooltip, Typography } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ColorCard, { ColorCardProps } from '../ColorCard';

export interface AnalysisCardProps extends ColorCardProps {
  component: {
    key: string;
    label: string;
    desc: string;
    prodList: string[];
  };
}

const AnalysisCard = ({ component, ...props }: AnalysisCardProps) => {
  const { Text } = Typography;
  return (
    <ColorCard
      label={
        <>
          <Text strong type='secondary' className='text-break'>
            {component.label}
          </Text>
          {component.desc !== undefined ? (
            <Tooltip title={component.desc}>
              <QuestionCircleOutlined
                style={{
                  padding: '0 5px',
                  cursor: 'pointer',
                }}
                className='color-grey'
              />
            </Tooltip>
          ) : null}
        </>
      }
      backgroundColor={component.prodList.length <= 0 ? 'success' : 'error'}
      indicator={component.prodList.length <= 0 ? 'true' : 'false'}
      bodyStyle={{ padding: 15 }}
    >
      {component.prodList.length <= 0 ? (
        <Text strong className='color-primary'>
          All set!
        </Text>
      ) : (
        <>
          <Text strong type='danger'>
            Please add the cost for:
          </Text>
          <ul>
            {component.prodList.map((prod) => (
              <li className='color-error' style={{ fontWeight: 600 }}>
                {prod}
              </li>
            ))}
          </ul>
        </>
      )}
    </ColorCard>
  );
};

export default AnalysisCard;
