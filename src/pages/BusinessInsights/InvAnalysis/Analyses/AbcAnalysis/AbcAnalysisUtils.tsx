import { GradeIcon } from '../../Icons';
import { GradeIconProps } from '../../Icons/GradeIcon';

export const GradeA = (props: Omit<GradeIconProps, 'grade'>) => (
  <GradeIcon grade='A' className='bg-green-400' {...props} />
);
export const GradeB = (props: Omit<GradeIconProps, 'grade'>) => (
  <GradeIcon grade='B' className='bg-blue-400' {...props} />
);
export const GradeC = (props: Omit<GradeIconProps, 'grade'>) => (
  <GradeIcon grade='C' className='bg-red-400' {...props} />
);

export const GradeUndefined = (props: Omit<GradeIconProps, 'grade'>) => (
  <GradeIcon grade='?' className='bg-grey-400' {...props} />
);

export const abcDesc = {
  header: 'ABC analysis grades the products based on sales per month.',
  content: [
    {
      key: 'gradeA',
      title: 'Grade A',
      desc: 'Grade A contribute to 80% of revenue. Make sure to keep enough stocks since these products produce the most revenue.',
      icon: <GradeA />,
    },
    {
      key: 'gradeB',
      title: 'Grade B',
      desc: 'Grade B contribute to 15% of revenue. Do not keep too many stocks on hand since these products produce lower revenue.',
      icon: <GradeB />,
    },
    {
      key: 'gradeC',
      title: 'Grade C',
      desc: 'Grade C contribute to 5% of revenue. These products are low in demand. Consider ways to promote these products.',
      icon: <GradeC />,
    },
  ],
};

const abcUtils = {
  desc: abcDesc,
};

export default abcUtils;
