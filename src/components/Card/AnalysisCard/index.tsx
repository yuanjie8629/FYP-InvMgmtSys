import { Skeleton, Tooltip, Typography } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ColorCard, { ColorCardProps } from '../ColorCard';
import Button from '@components/Button';
import { useNavigate } from 'react-router-dom';

export interface AnalysisCardProps extends ColorCardProps {
  component: {
    key: string;
    label: string;
    desc: string;
  };
  dataList: any[];
  loading?: boolean;
}

const AnalysisCard = ({
  component,
  dataList,
  loading,
  ...props
}: AnalysisCardProps) => {
  const { Text } = Typography;
  const navigate = useNavigate();
  return (
    <ColorCard
      label={
        loading ? (
          <Skeleton active={loading} paragraph={null} />
        ) : component.desc !== undefined ? (
          <Tooltip title={component.desc}>
            <Text
              strong
              type='secondary'
              className='text-break'
              style={{ cursor: 'pointer' }}
            >
              {component.label}
              <QuestionCircleOutlined
                style={{
                  padding: '0 5px',
                }}
                className='color-grey'
              />
            </Text>
          </Tooltip>
        ) : (
          <Text strong type='secondary' className='text-break'>
            {component.label}
          </Text>
        )
      }
      backgroundColor={
        loading ? 'grey' : dataList?.length <= 0 ? 'success' : 'error'
      }
      indicator={loading ? undefined : dataList?.length <= 0 ? 'true' : 'false'}
      bodyStyle={{ padding: 15 }}
    >
      {loading ? (
        <Skeleton
          active={loading}
          title={null}
          paragraph={{ rows: 2, width: '100%' }}
        />
      ) : dataList?.length <= 0 ? (
        <Text strong className='color-primary'>
          All set!
        </Text>
      ) : (
        <>
          <Text strong type='danger'>
            Please add the cost for:
          </Text>
          <ul>
            {dataList?.map((prod) => (
              <li className='color-error' style={{ fontWeight: 600 }}>
                <Button
                  color='error'
                  type='link'
                  onClick={() => {
                    navigate(`/product/${prod.id}`);
                  }}
                >
                  {prod.name}
                </Button>
              </li>
            ))}
          </ul>
        </>
      )}
    </ColorCard>
  );
};

export default AnalysisCard;
