import './Button.less';
import { Button, ButtonProps as AntdButtonProps } from 'antd';

interface ButtonProps extends AntdButtonProps {
  color?: 'success' | 'warning' | 'info';
}

export default function CustomButton(props: ButtonProps) {
  const { className, ...rest } = props;
  return (
    <Button
      {...rest}
      className={props.className + ' ' + props.color}
      // Cancel focus style
      onFocus={(e) => {
        e.target.blur();
      }}
    >
      {props.children}
    </Button>
  );
}
