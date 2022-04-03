import { HiPrinter } from 'react-icons/hi';
import Button, { ButtonProps } from '..';

const PrintButton = ({ children = 'Invoice', ...props }: ButtonProps) => {
  return (
    <Button
      icon={<HiPrinter size={16} style={{ marginRight: 4 }} />}
      className='center-flex'
      type='primary'
      {...props}
    >
      {children}
    </Button>
  );
};

export default PrintButton;
