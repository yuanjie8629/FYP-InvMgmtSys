import { HiEyeOff } from 'react-icons/hi';
import Button, { ButtonProps } from '..';

const HideButton = ({ children = 'Hide', ...props }: ButtonProps) => {
  return (
    <Button
      color='grey'
      icon={<HiEyeOff size={16} style={{ marginRight: 4 }} />}
      className='centerFlex'
      {...props}
    >
      {children}
    </Button>
  );
};

export default HideButton;
