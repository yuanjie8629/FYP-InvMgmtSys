import { HiTrash } from 'react-icons/hi';
import Button, { ButtonProps } from '..';

const DeleteButton = ({ children = 'Delete', ...props }: ButtonProps) => {
  return (
    <Button
      icon={<HiTrash size={16} style={{ marginRight: 3 }} />}
      className='centerFlex'
      {...props}
    >
      {children}
    </Button>
  );
};

export default DeleteButton;
