import { GradeIcon } from '../Icons';

const abcDesc = {
  header: 'ABC analysis grades the products based on sales per month.',
  content: [
    {
      key: 'gradeA',
      title: 'Grade A',
      desc: 'Grade A contribute to 80% of revenue. Make sure to keep enough stocks since these products produce the most revenue.',
      icon: <GradeIcon grade='A' className='bg-green-400' />,
    },
    {
      key: 'gradeB',
      title: 'Grade B',
      desc: 'Grade B contribute to 15% of revenue. Do not keep too many stocks on hand since these products produce lower revenue.',
      icon: <GradeIcon grade='B' className='bg-blue-400' />,
    },
    {
      key: 'gradeC',
      title: 'Grade C',
      desc: 'Grade C contribute to 5% of revenue. These products are low in demand. Consider ways to promote these products.',
      icon: <GradeIcon grade='C' className='bg-red-400' />,
    },
  ],
};

const abcAnalysis = {
  desc: abcDesc,
};

export default abcAnalysis;
