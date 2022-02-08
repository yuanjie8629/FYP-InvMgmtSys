import { IconBaseProps } from 'react-icons';
import { MdInfo, MdOutbound, MdStars } from 'react-icons/md';

export interface DescIconProps extends IconBaseProps {
  type: 'info' | 'purpose' | 'benefits';
}

const DescIcon = (props: DescIconProps) => {
  return props.type === 'info' ? (
    <MdInfo className='color-blue-400' size={80} {...props} />
  ) : props.type === 'purpose' ? (
    <MdOutbound className='color-red-400' size={80} color='white' {...props} />
  ) : (
    <MdStars className='color-yellow-400' size={80} {...props} />
  );
};

export default DescIcon;
