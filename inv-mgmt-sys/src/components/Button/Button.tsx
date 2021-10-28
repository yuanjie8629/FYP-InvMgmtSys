import styles from './Button.module.less';
import { Button, ButtonProps as AntdButtonProps } from 'antd';
import classNames from 'classnames/bind';
interface ButtonProps extends AntdButtonProps {
  color?: 'success' | 'warning' | 'info';
  children?: React.ReactNode;
}
let cx = classNames.bind(styles);

const CustomButton = (props: ButtonProps) => {
  var buttonClass = cx({
    success: props.color === 'success' ? true : false,
    warning: props.color === 'warning' ? true : false,
    info: props.color === 'info' ? true : false,
  });
  return (
    <Button
      {...props}
      className={
        props.className === undefined ? '' : props.className + ' ' + props.color
      }
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
