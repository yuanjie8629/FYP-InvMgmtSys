import { HiCheckCircle } from 'react-icons/hi';
import Button, { ButtonProps } from '..';

const ActivateButton = ({ children = 'Activate', ...props }: ButtonProps) => {
  return (
    <Button
      icon={<HiCheckCircle size={16} style={{ marginRight: 3 }} />}
      className='center-flex'
      {...props}
    >
      {children}
    </Button>
  );
};

export default ActivateButton;
