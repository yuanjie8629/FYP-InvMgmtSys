import { HiPause } from 'react-icons/hi';
import Button, { ButtonProps } from '..';

const SuspendButton = ({ children = 'Suspend', ...props }: ButtonProps) => {
  return (
    <Button
      color='error'
      icon={<HiPause size={16} style={{ marginRight: 3 }} />}
      className='center-flex'
      {...props}
    >
      {children}
    </Button>
  );
};

export default SuspendButton;
