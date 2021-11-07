import './Button.less';
import { Button, ButtonProps as AntdButtonProps } from 'antd';

interface ButtonProps extends AntdButtonProps {
  color?: 'success' | 'warning' | 'info';
  children?: React.ReactNode;
}

const CustomButton = (props: ButtonProps) => {
  return (
    <Button
      {...props}
      className={`${props.className === undefined ? '' : props.className} btn-${
        props.color
      }`}
      // Cancel focus style
      onMouseDown={(e) => {
        e.preventDefault();
      }}
    >
      {props.children}
    </Button>
  );
};

export default CustomButton;
