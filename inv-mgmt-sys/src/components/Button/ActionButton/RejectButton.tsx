import { HiThumbDown } from 'react-icons/hi';
import Button, { ButtonProps } from '..';

const RejectButton = ({ children = 'Reject', ...props }: ButtonProps) => {
  return (
    <Button
      icon={<HiThumbDown size={16} style={{ marginRight: 4 }} />}
      className='centerFlex'
      {...props}
    >
      {children}
    </Button>
  );
};

export default RejectButton;
