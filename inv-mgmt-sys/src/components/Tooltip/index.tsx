import { Tooltip as AntdTooltip, TooltipProps as AntdTooltipProps } from 'antd';

export type TooltipProps = AntdTooltipProps & {
  title: string;
};

const Tooltip = ({ title, children, overlayStyle, ...props }: TooltipProps) => {
  return (
    <AntdTooltip
      title={title}
      overlayStyle={{
        maxWidth: 300,
        textAlign: 'justify',
        ...overlayStyle,
      }}
    >
      <span style={{ cursor: 'help' }}>{children}</span>
    </AntdTooltip>
  );
};

export default Tooltip;
