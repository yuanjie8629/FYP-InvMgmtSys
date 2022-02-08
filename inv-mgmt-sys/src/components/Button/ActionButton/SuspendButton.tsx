import { HiPause } from 'react-icons/hi';
import Button, { ButtonProps } from '..';

const SuspendButton = ({ children = 'Suspend', ...props }: ButtonProps) => {
  return (
    <Button
      icon={<HiPause size={16} style={{ marginRight: 3 }} />}
      className='centerFlex'
      {...props}
    >
      {children}
    </Button>
  );
};

export default SuspendButton;
