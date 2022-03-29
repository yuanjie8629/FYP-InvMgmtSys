import { HiXCircle } from 'react-icons/hi';
import Button, { ButtonProps } from '..';

const CancelButton = ({ children = 'Cancel', ...props }: ButtonProps) => {
  return (
    <Button
      color='error'
      icon={<HiXCircle size={16} style={{ marginRight: 3 }} />}
      className='center-flex'
      {...props}
    >
      {children}
    </Button>
  );
};

export default CancelButton;
