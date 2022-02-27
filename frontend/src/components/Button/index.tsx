import './Button.less';
import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd';

export interface ButtonProps extends AntdButtonProps {
  color?: 'success' | 'warning' | 'error' | 'info' | 'grey';
}

const Button = ({ color, className, ...props }: ButtonProps) => {
  return (
    <AntdButton
      className={`${className !== undefined ? className : ''}${
        color !== undefined ? ` btn-${color}` : ''
      }`}
      {...props}
    />
  );
};

export default Button;
export declare type ButtonType = (props: ButtonProps) => JSX.Element;
