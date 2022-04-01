import { findRoutePath } from '@utils/routingUtils';
import { MdChevronRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Button from '..';

const MoreButton = ({ route }: { route: string }) => {
  const navigate = useNavigate();
  return (
    <Button
      type='link'
      color='info'
      onClick={() => navigate(findRoutePath(route))}
      className='dashboard-more-btn center-flex'
    >
      More
      <MdChevronRight size={23} style={{ position: 'relative', right: 3 }} />
    </Button>
  );
};

export default MoreButton;
