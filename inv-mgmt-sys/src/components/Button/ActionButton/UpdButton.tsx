import { MdUpdate } from 'react-icons/md';
import Button, { ButtonProps } from '..';

const UpdButton = ({ children = 'Update', ...props }: ButtonProps) => {
  return (
    <Button
      icon={<MdUpdate size={16} style={{ marginRight: 4 }} />}
      className='centerFlex'
      {...props}
    >
      {children}
    </Button>
  );
};

export default UpdButton;
