import { Popover as AntdPopover, PopoverProps as AntdPopoverProps } from 'antd';

export interface PopoverProps extends AntdPopoverProps {}

const Popover = ({ children, overlayStyle, ...props }: AntdPopoverProps) => {
  return (
    <AntdPopover
      overlayStyle={{
        maxWidth: 300,
        textAlign: 'justify',
        ...overlayStyle,
      }}
      {...props}
    >
      <span style={{ cursor: 'pointer' }}>{children}</span>
    </AntdPopover>
  );
};

export default Popover;
