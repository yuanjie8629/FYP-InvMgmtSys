import { HiThumbDown } from 'react-icons/hi';
import Button, { ButtonProps } from '..';

const RejectButton = ({ children = 'Reject', ...props }: ButtonProps) => {
  return (
    <Button
      color='error'
      icon={<HiThumbDown size={16} style={{ marginRight: 4 }} />}
      className='center-flex'
      {...props}
    >
      {children}
    </Button>
  );
};

export default RejectButton;
