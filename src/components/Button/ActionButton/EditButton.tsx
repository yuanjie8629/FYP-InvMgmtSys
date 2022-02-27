import { HiPencilAlt } from 'react-icons/hi';
import Button, { ButtonProps } from '..';

const EditButton = ({ children = 'Edit', ...props }: ButtonProps) => {
  return (
    <Button
      icon={<HiPencilAlt size={16} style={{ marginRight: 3 }} />}
      className='center-flex'
      {...props}
    >
      {children}
    </Button>
  );
};

export default EditButton;
