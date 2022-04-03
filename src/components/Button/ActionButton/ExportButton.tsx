import { HiDocumentDownload } from 'react-icons/hi';
import Button, { ButtonProps } from '..';

const ExportButton = ({ children = 'Export', ...props }: ButtonProps) => {
  return (
    <Button
      icon={<HiDocumentDownload size={16} style={{ marginRight: 4 }} />}
      className='center-flex'
      type='primary'
      {...props}
    >
      {children}
    </Button>
  );
};

export default ExportButton;
