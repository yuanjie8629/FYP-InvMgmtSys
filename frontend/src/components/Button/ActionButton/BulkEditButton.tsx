import { ReactComponent as BulkEditIcon } from '@assets/Icons/BulkEditIcon.svg';
import Button, { ButtonProps } from '..';

const BulkEditButton = ({
  children = 'Bulk Updates',
  ...props
}: Omit<ButtonProps, 'type'>) => {
  return (
    <Button
      type='primary'
      icon={<BulkEditIcon style={{ marginRight: 5 }} fill='white' />}
      className='center-flex'
      {...props}
    >
      {children}
    </Button>
  );
};

export default BulkEditButton;
