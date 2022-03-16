import { Spin, SpinProps } from 'antd';

interface FormSpinProps extends SpinProps {}

const FormSpin = (props: FormSpinProps) => {
  return (
    <Spin
      style={{
        position: 'fixed',
        top: '50%',
        transform: 'translate(0,-50%)',
      }}
      {...props}
    >
      {' '}
    </Spin>
  );
};

export default FormSpin;
