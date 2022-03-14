import ResultFeedback from '.';
import Button from '@components/Button';
import { useNavigate } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';

interface SuccessResultProps {
  record: 'prod' | 'pack';
  type: 'add' | 'edit';
}

const SuccessResult = ({ type, record }: SuccessResultProps) => {
  const navigate = useNavigate();
  const getRecord = 'prod' ? 'Product' : 'pack' ? 'Package' : null;

  const button = [
    <Button
      type='primary'
      onClick={() => {
        navigate(findRoutePath(`${record}Mgmt`));
      }}
    >
      Manage {getRecord}
    </Button>,
    <Button
      onClick={() => {
        navigate(findRoutePath(`${record}Add`));
      }}
    >
      Add Another {getRecord}
    </Button>,
  ];
  return (
    <ResultFeedback
      status='success'
      title={`Your ${getRecord} Have Been Successfully ${
        type === 'add' ? 'Added' : 'Updated'
      }.`}
      extra={button}
    />
  );
};

export default SuccessResult;