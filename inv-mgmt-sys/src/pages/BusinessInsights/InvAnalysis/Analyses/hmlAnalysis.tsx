import { GradeIcon } from '../Icons';

const hmlDesc = {
  header: 'HML analysis grades the products based on sales per month.',
  content: [
    {
      key: 'gradeH',
      title: 'Grade H',
      desc: 'Grade H products make up 75% of the total unit price ratio. These products are costly. Make sure you have strict control on these high-unit-value products.',
      icon: <GradeIcon grade='H' className='bg-green-400' />,
    },
    {
      key: 'gradeM',
      title: 'Grade M',
      desc: 'Grade M products make up 15% of the total unit price ratio. These products do not cost too much. Moderate control on these products is sufficient.',
      icon: <GradeIcon grade='M' className='bg-blue-400' />,
    },
    {
      key: 'gradeL',
      title: 'Grade L',
      desc: 'Grade L products make up 10% of the total unit price ratio. These products are low in unit price. Less control is required for the products.',
      icon: <GradeIcon grade='L' className='bg-red-400' />,
    },
  ],
};


const hmlAnalysis = {
  desc: hmlDesc
}

export default hmlAnalysis;
