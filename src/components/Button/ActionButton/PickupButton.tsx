import { MdStore } from 'react-icons/md';
import Button, { ButtonProps } from '..';

const PickupButton = ({ children = 'Pickup', ...props }: ButtonProps) => {
  return (
    <Button
      icon={<MdStore size={18} style={{ marginRight: 3 }} />}
      className='center-flex'
      {...props}
    >
      {children}
    </Button>
  );
};

export default PickupButton;
