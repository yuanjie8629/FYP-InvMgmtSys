import './Button.less';
import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd';

interface ButtonProps extends AntdButtonProps {
  color?: 'success' | 'warning' | 'info' | 'grey';
  children?: React.ReactNode;
}

const Button = (props: ButtonProps) => {
  return (
    <AntdButton
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
    </AntdButton>
  );
};

export default Button;
