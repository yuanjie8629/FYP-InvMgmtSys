import { HiThumbUp } from 'react-icons/hi';
import Button, { ButtonProps } from '..';

const AcceptButton = ({ children = 'Accept', ...props }: ButtonProps) => {
  return (
    <Button
      icon={<HiThumbUp size={16} style={{ marginRight: 4 }} />}
      className='centerFlex'
      {...props}
    >
      {children}
    </Button>
  );
};

export default AcceptButton;
